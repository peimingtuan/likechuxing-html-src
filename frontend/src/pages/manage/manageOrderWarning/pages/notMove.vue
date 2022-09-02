<template>
    <div class="notMove">

        <HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="filterShow"
                @tabRefresh="refresh"
                @tabSort='sort'
        />
        <div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="list.length === 0">
            列表为空
        </div>
        <PullDownRefresh
        	v-else
                :opt="opt"
                @pullDown="pullDown"
                @pullUp="pullUp"
                ref="pullUpDown"
        >
            <div class="list_cont move_item" 
            	v-for="(listItem,index) in list"
            	:key = 'index'
            	@click="goDetail(listItem.id,listItem.status,listItem.plate_no)"
            >
        		<div class="car_card">
					<p class="car_plat">
						<span class="fc33">{{listItem.plate_no}}</span>
						(<span class="fc33" v-show="listItem.vin">{{listItem.vin.substring(listItem.vin.length-6)}}</span>)
						<span class="car_status">{{listItem.status_name}}</span>
					</p>
					<div>
						<span class="day_type" v-show='listItem.chengdu_limit_record==1'>
						今日限行
						</span>
						<span class="day_type2" v-show='listItem.chengdu_limit_record==2'>
							明日限行
						</span>
						<p class="fourdet_three" v-show='listItem.limit_record'>
							<span class="three_type">
								
								<span class="limit_type" 
									:class="indexs<2&&item.limit==0?'limit_type_green':indexs<2&&item.limit==1?'limit_type_red':''" 
									v-for="(item,indexs) in listItem.limit_record"
									:key = 'indexs'
								>
									<i v-show="indexs<2" class="limit_date">{{indexs==0?'今':indexs==1?'明':''}}</i>
									<i :class="item.limit==0?'is_drive':item.limit==1?'is_park':'is_stay'">
										{{item.limit==0?'开':item.limit==1?'停':'待'}}
									</i>
									
								</span>
							</span>
						</p>
					</div>
					
				</div>
				<p class="car_dec"> 
					
					<span>
						{{listItem.brand_name}}{{listItem.model_name}}
					</span>
					<span class="car_color">{{listItem.color}}</span>
					<span>
						约续航{{listItem.remain_km}}公里
					</span>
				</p>
				
				
				<p class="detail_addr fc66">
					<!--条件：根据是否是成都限行或广佛限行判断是否显示，判断限行区域内非与限'rule_not':'onNo'限-->
					<span class="move_rule" :class="listItem.area==1?'onNo':'rule_not'" v-show='listItem.area'>{{listItem.area&&listItem.area==1?'限':'非'}}</span>
					<span class="icon_addr">
						<img src="../images/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
						<img src="../images/map-B.png" v-else alt=""/>
					</span>
					<span>
						{{listItem.branch_addr}}
						{{listItem.parking_floor}}
						层
						{{listItem.parking_no}}
						车位
					</span>
				</p>
				<p class="not_time fc66" v-show="listItem.park_fee||listItem.park_fee!=0">
					<span class="is_rule" v-show='listItem.area&&listItem.area!=0'></span><span class="icon_addr no_addr"></span>当前预计停车费
					{{listItem.park_fee}}
					元
				</p>
				<div class="status_modal">
					<p 
						:class="listItem.no_move_status == 0?'move_status_zero':listItem.no_move_status == 1?'move_status_one':'move_status_two'"
					>
						<span 
							class="line_left"
							:class="listItem.no_move_status == 0?'line_left_zero':listItem.no_move_status == 1?'line_left_one':'line_left_two'"
						></span>
						{{listItem.no_move_status_text}}
					</p>
					<p class="not_time">
						<span>里程未动时长：</span>
						<span class='fc33'>
							{{listItem.unmove_hours}}小时
						</span>
					</p>
					<p class="not_time">
						<span>处理后未动时长：</span>
						<span class='fc33' v-if="listItem.uncheck_hours">
							{{listItem.uncheck_hours}}小时
						</span>
						<span class='fc33' v-else>
							0
						</span>
					</p>
					<p class="not_time">
						<span>未动类型：</span>
						<span class='fc33'>
							{{listItem.unmove_type_text}}
						</span>
					</p>
				</div>
				
				<p class="move_note fc33" v-show="listItem.last_desc">
					<span class="note_title">备注：</span>
					<span class="note_con" v-if='listItem.last_desc'>
						{{listItem.last_desc}}
					</span>
				</p>
    		</div>
            
            <div class="orderBox"
                 v-for="item in list"
                 :key="item.id"
                 @click="()=>toDetail(item.id)"
            >
                
            </div>
            
        </PullDownRefresh>

        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">
            <FilterMultiple v-if="cityData.length>1"
                title="城市"
                :options="cityOpt"
                :preselect="city_id"
                ref="cityfilter"
            />
            <FilterSingle
                title="预警类型"
                :options="warnOpt"
                :required="true"
                ref="warnfilter"
                :preselect='zombie_status'
            />
            <FilterSingle
                title="未动类型"
                :options="cartypeOpt"
                :required="true"
                ref="cartypefilter"
                :preselect='cartype_status'
            />
            <FilterSingle
                title="网点合作类型"
                :options="options"
                :required="true"
                ref="filter"
                :preselect='branch_type'
            />
			<FilterMultiple
                title="车辆状态"
                :options="carOpt"
                :preselect="car_status"
                :isAll = 'true'
                ref="carfilter"
            />
            <div class="box-footer">
                <LikeButton
                        text="重置"
                        type="gray"
                        @click="filterReset"
                        class="btn"
                />
                <LikeButton
                        text="确定"
                        type="primary"
                        @click="filterSearch"
                        class="btn float-right"
                />
            </div>
        </SlideUpBox>
        <SlideUpBox v-if="sort_show" title="排序" ref="slideUpBox" @close="filterClose">
		  	<div class="filter_all">
				<p class="sort_item" 
					:id="'sort'+sortItem.sortType" 
					v-for="(sortItem,index) in sorts"
					:key = 'index'
					@click="sortCheck(sortItem.sortType,$event)">
					<span  class="sort_own" :class="sort_type==sortItem.sortType?'is_sort':'no_sort'">{{sortItem.sortCont}}</span>
					<span class="sort_icon" v-show="sort_type==sortItem.sortType">
						<img src="../images/duigou.png" alt="" />
					</span>
				</p>
			</div>
		</SlideUpBox>
    </div>
</template>

<script>
  import $ from 'jquery'
  import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  import FilterSingle from '../component/FilterSingle'
  import FilterMultiple from '../component/FilterMultiple'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  
  const OrderStatus = require('../js/orderStatus')
  require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
  require("../css/modal.css")

  export default {
    name: "notMove",
    components: {
      HeaderTab,
      SlideUpBox,
      FilterSingle,
      FilterMultiple,
      LikeButton,
      PullDownRefresh,
    },
    data () {
      return {
        headerTabModule: [
          'search',
          'filter',
          'sort',
          'refresh'
        ],
        filter_show: false,
        options:OrderStatus.bizfun.map(item=>{
          item.id = item.status
          return item
        }),
        branch_type:-1,
        page:1,
        opt: {
          height: 300, // 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        dataReady:false,
        // 是否是搜索来的
//      search:false,
        list:[],
        head_id:'0',
        modal:false,
        sort_show:false,
        sorts:[
			{"sortCont":"里程未动时长从大到小",'sortType':'0'},
			{"sortCont":"距离当前从近到远",'sortType':'1'},
			{"sortCont":"处理后未动时长从大到小",'sortType':'2'},
		],
		sort_type:0,
		istab:false,//为了重置筛选，是否切换了tab
		task_id:'',//任务id
		//任务类型
		
        warnOpt:OrderStatus.warnfun.map(item=>{
          item.id = item.status
          return item
        }),
        zombie_status:0,
        cartypeOpt:OrderStatus.carfun.map(item=>{
          item.id = item.status
          return item
        }),
        cartype_status:0,
      	resetAll:false,//是否重置
      	filterData:[],
      	parts:'',
      	moreData:[],
      	carOpt:'',
        car_status:[1],
      	city_id:[],
      	cityOpt:'',
      	cityData:[],
      	search:this.$route.query.search||false
      }
    },
    destroyed(){
		$('html').css('height','auto');
		$('body').css('height','auto');
	},
	mounted () {
		$('html').css('height','100%');
		$('body').css('height','100%');
		$('.notMove').height($(window).height());
	},
	watch: {
		'$route' (to, from) {
			this.list = []
	        this.dataReady = false
	        this.pullDown()
		}
	},
    methods: {
    	citySatus(){
    		var param = {
				'mobile':sessionStorage.getItem('mobile')||userData.state.mobile,
			}
    		return myAjax.post(getOspApiUrl('/car-catch/count'),param).then(res=>{
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		    })
    	},
    	warnSatus(){
    		var param = {
				'mobile':sessionStorage.getItem('mobile')||userData.state.mobile,
				"city_id":sessionStorage.getItem('city_id')||userData.state.city_ids||'',
				"cat_type":0
			}
    		return myAjax.post(getOspApiUrl('/car-catch/move-dis-config'),param).then(res=>{
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		    })
    	},
      	getList(){
      		var param = {
            	"mobile":userData.state.mobile||sessionStorage.getItem('mobile'),
				'lng':sessionStorage.getItem('lng')||userData.state.locationsLng,		//经度
				'lat':sessionStorage.getItem('lat')||userData.state.locationsLat,		//维度
				'sort_type':this.sort_type,//1距离  0车辆数
				'branch_type':this.branch_type,
				'car_status':this.car_status.join(','),
				'zombie_status':this.zombie_status,
				'cat_type':'0',//0 24小时未动   1远距离
				'unmove_type':this.cartype_status,//1 、车辆未动     2、车机故障
				'page':this.page		//int	页码
			}
				if(this.city_id.join(',')){
					param.city_id=this.city_id.join(',')
				}
				if(this.$route.query.car_id){
					param.car_id=this.$route.query.car_id
				}
				if(this.$route.query.branch_id){
					param.branch_id=this.$route.query.branch_id
				}
				return myAjax.post(getOspApiUrl('/car-catch/move-dis-list'),param).then(res=>{
		          this.dataReady = true;
//		          	if(this.$route.query.list!='0'){//搜索网点过来没有数据的时候置为空
			          if(res.status !== 0){
			            throw res
			          }else{
			            return res.data;
			          }
//			        }else{
//			        	return [];
//			        }
		        })
      	},
		goDetail(id,status,plate_no){
			window.location.href = '../manageOrderCardetail/index.html?plate_no='+plate_no;
		},
      	pullDown(){
	        this.page = 1
	        this.getList().then(res=>{
	          this.list = res;
	          this.$refs.pullUpDown.update();
	        }).catch(this.handleError);
      	},
      	pullUp(){
	        this.page++
	        this.getList().then(res=>{
	          this.list = this.list.concat(res)
	          if(res.length === 0){
	            this.$refs.pullUpDown.update({noMore:true})
	          }else{
	            this.$refs.pullUpDown.update()
	          }
	        }).catch(this.handleError)
      	},
	
      	filterShow () {
	        this.filter_show = true;
      	},
      	refresh () {
	        this.list = []
	        this.dataReady = false
	        this.pullDown();
      	},
  		toSearch () {
	        this.$router.push({
		          path:'/searchPro',
		          
		        })
      	},
      	filterClose () {
	        this.filter_show = false;
	        this.sort_show = false;
	        this.resetAll = false;
	        
      	},
      	filterReset(){
	        this.$refs.filter.reset();
	        this.$refs.carfilter.reset();
	        this.$refs.warnfilter.reset();
	        this.$refs.cityfilter.reset();
	        this.$refs.cartypefilter.reset();
	        this.resetAll = true;
      	},
      	sort(){
	      	this.sort_show = true;
      	},
      	filterSearch(){
	        this.filter_show = false;
	        this.branch_type = this.$refs.filter.getResult();
	        this.car_status = this.$refs.carfilter.getResult();
	        this.zombie_status = this.$refs.warnfilter.getResult();
	        this.city_id = this.$refs.cityfilter.getResult();
	        this.cartype_status = this.$refs.cartypefilter.getResult();
	        this.pullDown()
      	},
  		handleError(err){
	        if(err && err.msg){
	          this.$_LIKE_toast(err.msg)
	        }else{
	          console.log(err)
	        }
      	},
      	sortCheck(sortType,e){
      		this.page = 1;
	      	this.sort_type = sortType;
	      	setTimeout(()=>{
	      		this.sort_show = false;
	      		this.getList().then(res=>{
			        this.list = res;
			    }).catch(this.handleError)
	      	},500)
      	}
    },
    created(){
//  	userData.save({
//          	locationsLng: '116.298611',
//          	locationsLat: '40.044257',
//          	mobile:'13521758602'
//        	})
      // 计算列表容器高度
      	this.opt.height = window.innerHeight - window.REM * 0.4 - 1;
      	if(this.search){
      		this.branch_type = -1;
	        this.car_status = [];
	        this.zombie_status = -1;
	        this.cartype_status = 0;
      	}else{
      		this.branch_type = this.branch_type;
	        this.car_status = [1];
	        this.zombie_status = 0;
	        this.cartype_status = 0;
      	}
      	dd.getLocation().then(res => {
          	userData.save({
            	locationsLng: res.longitude||this.$route.query.lng,
            	locationsLat: res.latitude||this.$route.query.lat
          	})
          	this.getList().then(res=>{
	        	this.list = res;
	      	}).catch(this.handleError)
		}).catch(err => {
	          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
	   	});
	   	this.warnSatus().then(res=>{
	        	this.moreData = res;
			    var carData = this.moreData.map(item=>{
		          item.status = item.id
		          return item
		        });
		        this.carOpt = carData.map(item=>{
		          item.name = item.name+'('+item.count+')'
		          return item
		        });
	      	}).catch(this.handleError)
	   		this.citySatus().then(res=>{
	        	this.cityData = res.cities;
	        	if(this.cityData.length>1){
	        		this.cityOpt = this.cityData.map(item=>{
			          item.status = item.id;
			          return item
			        });
	        	}
	      	}).catch(this.handleError)
//     this.getList().then(res=>{
//	     	this.list = res;
//	   }).catch(this.handleError)
    },
  }
</script>

<style scoped>
    /**/
   .notMove /deep/ .HeaderTab .item{
   	color: #494B51!important;
   }
   *{
   	 box-sizing: border-box;
   	}
   .box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
    }
    .btn {
        width: 47%;
    }
    .fc33{
    	color: #333333;
    }
   .fc99{
   		color: #999999;
   }
   .fc66{
   		color: #666666;
   }
   .f15b{
		color: #F15B5B;
	}
	.notMove{
		background: #F6F6F6;
	}
  	.des{
    	font-size: 13px;
  	}
  	.gray,.des{
	    color:#999;
  	}
  	.status{
	    font-size: 12px;
	    border:solid 1px #dbdbdb;
	    line-height: 0.2rem;
	    padding: 0 0.05rem;
	    border-radius: 3px;
  	}
	
    .status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
    }
	.list_cont{
		padding: .2rem .1rem .1rem .1rem;
		background: #FFFFFF;
	}
	.sort_icon{
		display: inline-block;
		width: .234rem;
		height: .15rem;
	}
	.sort_icon img{
		width: 100%;
		height: 100%;
	}
	.sort_item{
		  display: flex;
		  display: -webkit-flex;
	    justify-content: space-between;
	    -webkit-justify-content: space-between;
	    height: .4rem;
	    border-top: 1px solid #EDEDED;
	    align-items: center;
		-webkit-align-items: center;
	}
	.sort.filter_cont{
		padding: 0.12rem 0.1rem 0.1rem 0.1rem;
	}
	.sort .filter_all{
		margin: 0;
	}
	.is_sort{
		color: #44a8ec;
	}
	.no_sort{
		color: #333333;
	}
	/*列表样式*/
	.car_plat span:first-child{
		font-weight: 700;
	}
	.car_dec span{
	    display: inline-block;
	    /*padding-right: .05rem;*/
	    color: #666666;
	    height: .12rem;
	    line-height: .12rem;
	}
	.car_color{
		padding: 0 .06rem;
		border-left: 1px solid #CDCDCD;
		border-right: 1px solid #CDCDCD;
	}
	.move_item{
		width: 100%;
		background: #FFFFFF;
		padding: .15rem .11rem .13rem .11rem;
		margin-bottom: .1rem;
	}
	.detail_addr{
		padding-top: .14rem;
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		-webkit-align-items: center;
	}
	.icon_addr{
		display: inline-block;
		width: 0.15rem;
		height: 0.2rem;
	}
	.icon_addr img{width: 100%;height: 100%;}
	.no_addr{height: 0;}
	.not_time{
		padding-top: .06rem;
		padding-left: .1rem;
	}
	.status_modal .not_time{
		padding-top: .1rem;
		color: #9b9b9b;
	}
	.move_note{
		padding-top: 0.1rem;
		display: flex;
		display: -webkit-flex;
		align-items: flex-start;
		-webkit-align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		line-height: .18rem;
	}
	.note_title{
		display: inline-block;
		white-space: nowrap;
		flex: 10%;
	}
	.note_con{
		flex: 90%;
		/*margin-left: .15rem;*/
		
	}
	.car_card{
		display: flex;
	    align-items: center;
	    justify-content: space-between;
	   	display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
		padding-bottom: .1rem;
	}
	.is_rule{
		display: inline-block;
		width: .18rem;
		height: .18rem;
	}
	.three_title,.three_type{
		display: flex;
	}
	.three_title{
		margin-bottom: .05rem;
	}
	.is_drive,.is_park,.is_stay,.three_title span{
		  display: flex;
		  display: -webkit-flex;
	    width: .18rem;
	    height: .18rem;
	    line-height: .18rem;
	    font-size: .14rem;
	    text-align: center;
	    /*border-radius: 3px;*/
	    justify-content: center;
	    align-items: center;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	
	.is_drive{
		color: #fff;
		background-color: #b6e088;
	}
	.is_park{
		color: #fff;
		background-color: #ff8e8e;
	}
	.is_stay{
		color: #fff;
		background-color: #D2D2D2;
	}
	.day_type,.day_type2{
		display: inline-block;
		padding: .03rem .06rem;
		border: 1px solid #ed3800;
		color: #ef5633;
		border-radius: 2px;
	}
	.day_type2{
		border: 1px solid #ff9500;
		color: #ff9500;
	}
	/*多级筛选*/	
	.FilterBox {
		  margin: 0.1rem 0;}
	.filter-title {
	    color: #999;
	  }
	.cont_title{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		-webkit-justify-content: space-between;
		margin-top: .25rem;
		padding-bottom: .14rem;
		border-bottom:1px solid #e8e8e8 ;
	}
	/*下箭头*/
	.arrdown {
	    display :inline-block;
	    position: relative;
	    width: 24px;
	    height: 14px;
	}
	.arrdown::after {
	    display: inline-block;
	    content: " ";
	    height: 10px;
	    width: 10px;
	    border-width: 0 2px 2px 0;
	    border-color: #b4b4b4;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 10px;
	    margin-top: -10px;
	}
	.arrdown.active::after {
	    transform-origin: center;
	    transform: rotate(-135deg);
	    transition: transform .3s;
	}
	.car_status{
		display: inline-block;
		padding: .03rem .045rem;
		border: 1px solid #CDCDCD;
		border-radius: 2px;
		
	}
	i{
		font-style: normal;
	}
	.limit_type{
		display: flex;
		margin-right: .05rem;
		border-radius: 3px;
		overflow: hidden;
	}
	.limit_date{
		display: flex;
		display: -webkit-flex;
	    width: .18rem;
	    height: .18rem;
	    line-height: .18rem;
	    font-size: .14rem;
	    text-align: center;
	    margin-right: .05rem;
	    justify-content: center;
	    align-items: center;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	.limit_type_green{
		border: 1px solid #b6e088;
	}
	.limit_type_red{
		border: 1px solid #ff8e8e;
	}
	.move_rule{
		display: flex;
		display: -webkit-flex;
		width: .18rem;
		height: .18rem;
		border-radius: 50%;
		border: 1px dotted #f84b4b;
		color: #f84b4b;
		font-size: .12rem;
		text-align: center;
		line-height: .15rem;
		background-color: #ffeded;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
		overflow: hidden;
	}
	.rule_not{
		color: #e4f4ff;
		background-color: #5cb0dc;
		border: 1px dotted #e4f4ff;
	}
	.status_modal {
	    padding: .06rem 0 .18rem 0;
	    border: 1px dashed #e6e6e6;
	    background: #fdfdfd;
	    margin-top: .12rem;
	    border-radius: 2px;
	}
	.move_status_zero{
		color: #FD5264;
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.move_status_one{
		color: #ffa500;
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.move_status_two{
		color: #666666;
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.line_left{
		display: inline-block;
	    height: .2rem;
	    width: 4px;
	    vertical-align: bottom;
	    border-radius: 0 3px 3px 0;
	    margin-right: .03rem;
	}
	.line_left_zero{
	    background: #FD5264;
	}
	.line_left_one{
	    background: #ffa500;
	}
	.line_left_two{
	    background: #666666;
	}
</style>
