<template>
    <div class="List">

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
            	@click="goDetail(listItem.id,listItem.status)"
            >
        		<div class="car_card">
					<p class="car_plat">
						<span class="fc33">{{listItem.plate_no}}</span>
						(<span class="fc33" v-show="listItem.vin">{{listItem.vin.substring(listItem.vin.length-6)}}</span>)
						<span class="day_type" v-show='listItem.chengdu_limit_record==1'>
						今日限行
						</span>
						<span class="day_type2" v-show='listItem.chengdu_limit_record==2'>
							明日限行
						</span>
					</p>
					<p>ID:{{listItem.id}}</p>
				</div>
				<p class="car_dec"> 
					<span>{{listItem.status_name}}</span>
					<span>
						{{listItem.brand_name}}{{listItem.model_name}}
					</span>
					<span>
						约续航{{listItem.remain_km}}公里
					</span>
					<span>{{listItem.car_factory}}</span>
				</p>
				<p class="fourdet_three" v-show='listItem.limit_record'>
					<span class="three_title">
						<span>今</span>
						<span>明</span>
					</span>
					<span class="three_type">
						<span :class="item.limit==0?'is_drive':item.limit==1?'is_park':'is_stay'"  
							v-for="(item,indexs) in listItem.limit_record"
							:key = 'indexs'
						>
							{{item.limit==0?'开':item.limit==1?'停':'待'}}
						</span>
					</span>
				</p>
				
				<p class="detail_addr fc66">
					<!--条件：根据是否是成都限行或广佛限行判断是否显示，判断限行区域内非与限'rule_not':'onNo'限-->
					<span class="icon_addr">
						<img src="../images/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
						<img src="../images/map-B.png" v-else alt=""/>
					</span>
					<span>
						{{listItem.branch_name}}
					</span>
				</p>
				<p class="not_time fc99" v-if="listItem.parking_fee">
					当前预计停车费{{listItem.parking_fee}}元
				</p>
				<p class="not_time">
					<span class="fc99">处理时长：</span>
					<span class='fcec6e'>
						{{listItem.last_time}}
					</span>
				</p>
				<p class="move_note">
					<span class="note_title fc99">备注：</span>
					<span class="fc66 note_con" v-if='listItem.remark'>
						{{listItem.remark}}
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
            <FilterSingle
                title="维修来源"
                :options="options"
                :required="true"
                ref="filter"
                :preselect='status'
            />
			<FilterMultiple
                title="工单类型"
                :options="oilOpt"
                :preselect="oilStatus"
                ref="oilfilter"
            />
			<div class="FilterBox">
		        <p class="filter-title">维修部位</p>
		        <div class="filter_list">
		            <p class="cont_title" @click="checkMore()">
		            	<span>{{optTxt}}</span>
		            	<span class="arrdown"></span>
		            </p>
		        </div>
		    </div>
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
        <OptMore v-show="modal" 
        	ref='optMore' 
        	:title = '"维修部位"'
        	:resetAll='resetAll' 
        	:filterData='filterData'
        	:all ="'true'"
        	@modalClose = 'modalClose' 
        	@optData = 'optData'>
        </OptMore>
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
  import FilterSingle from '../../../../../other_modules/like-manageOrder/component/FilterSingle'
  import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import OptMore from '../component/optMore'
  
  const OrderStatus = require('../js/orderStatus')
  require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
  require("../css/modal.css")

  export default {
    name: "list",
    components: {
      HeaderTab,
      SlideUpBox,
      FilterSingle,
      FilterMultiple,
      LikeButton,
      PullDownRefresh,
      OptMore
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
        status:-1,
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
			{"sortCont":"距离网点从近到远",'sortType':'1'},
			{"sortCont":"维修时长从大到小",'sortType':'2'}
		],
		sort_type:2,
		istab:false,//为了重置筛选，是否切换了tab
		task_id:'',//任务id
		//任务类型
		oilOpt:OrderStatus.disfun.map(item=>{
          item.id = item.status
          return item
        }),
        oilStatus:[],
      	resetAll:false,//是否重置
      	optTxt:'全部',
      	filterData:[],
      	out_keys:'',
      	parts:''
      	
      }
    },
    destroyed(){
		$('html').css('height','auto');
		$('body').css('height','auto');
	},
	mounted () {
		$('html').css('height','100%');
		$('body').css('height','100%');
		$('.List').height($(window).height());
		this.partsData();
	},
	watch: {
		'$route' (to, from) {
			this.list = []
	        this.dataReady = false
	        this.pullDown()
		}
	},
    methods: {
    	partsData(){
    		myAjax.post(getOspApiUrl('/vehicle-fault/fault-type'), {
			    type:'5',
			    mobile:userData.state.mobile,
			}).then(res => {
			  	if (res.status === 0) {
			  		this.filterData = res.data;
			  		this.$refs.optMore.checkedCon = this.filterData;
		      	}else{
		      		this.$_LIKE_toast(res.msg)
		      	}
			}).catch(err => {
			    console.log(err)
			})
    	},
    	optData(){//组件内筛选值
    		this.optTxt=this.$refs.optMore.optTxt?this.$refs.optMore.optTxt:'全部';
    		this.optId =this.$refs.optMore.optId;
    		this.out_keys = this.$refs.optMore.out_keys;
    	},
    	checkMore(){
    		this.modal = true;
    		this.filter_show = false;
    		this.resetAll = false;
    		/*if(this.$refs.optMore.filterData1.length!=0){
	    		this.$refs.optMore.allName.splice(this.$refs.optMore.allName.length-1,1);
	    		this.$refs.optMore.allId.splice(this.$refs.optMore.allId.length-1,1);
    		}*/
    	},
    	modalClose(){
    		this.filter_show = true;
    		this.modal = false;
    	},
      	getList(){
				var param = {
					lng: userData.state.locationsLng,
			      	lat: userData.state.locationsLat,
			      	mobile:userData.state.mobile,
			      	sort:this.sort_type,
			      	status:this.oilStatus==''?'-1':this.oilStatus.join(','),
			      	source:this.status,
			      	page:this.page
				}
				if(userData.state.city_ids){
					param.city_id=userData.state.city_ids
				}
				if(userData.state.city_ids){
					param.city_id=userData.state.city_ids
				}
				if(this.$route.query.car_id){
					param.car_id=this.$route.query.car_id
				}
				if(this.out_keys){
					param.key = '1';
					delete param.part 
				}
				if(this.parts){
					param.part = this.parts;
					delete param.key;
				}
				return myAjax.post(getOspApiUrl('/vehicle-repair/order-list'),param).then(res=>{
		          this.dataReady = true;
		          	if(this.$route.query.list!='0'){//搜索网点过来没有数据的时候置为空
			          if(res.status !== 0){
			            throw res
			          }else{
			            return res.data;
			          }
			        }else{
			        	return [];
			        }
		        })
      	},
		goDetail(id,status){
			if(status!=4){
				this.$router.push({
		          path:'/orderDetail',
		          query:{
		          	order_id:id
		          }
		        })
			}else{
				this.$router.push({
		          path:'/finishedOrder',
		          query:{
		          	order_id:id
		          }
		        })
			}
			
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
	        this.$refs.optMore.optTxt = this.$refs.optMore.allName.join('-');
	        this.optTxt = this.$refs.optMore.optTxt;
	        
      	},
      	filterReset(){
	        this.$refs.filter.reset();
	        this.$refs.oilfilter.reset();
	        this.resetAll = true;
	        this.optTxt='全部';
	        this.optId = '';
	        this.out_keys = '';
	        this.$refs.optMore.optTxt='全部';
	        this.$refs.optMore.optId='';
	        this.$refs.optMore.optTxt='全部';
	        this.$refs.optMore.out_keys='';
	        this.$refs.optMore.parts='';
	        this.parts='';
	        this.$refs.optMore.allId = [];
      	},
      	sort(){
	      	this.sort_show = true;
      	},
      	filterSearch(){
	        this.filter_show = false;
	        this.status = this.$refs.filter.getResult();
	        this.oilStatus = this.$refs.oilfilter.getResult();
	        this.out_keys = this.$refs.optMore.out_keys;
	        if(this.resetAll){
	        	this.$refs.optMore.optTxt='全部';
	        	this.$refs.optMore.optId = '';
	        	this.$refs.optMore.allName = [];
	        	this.$refs.optMore.allId = [];
	        	this.$refs.optMore.out_keys = '';
	        	this.$refs.optMore.parts = '';
	        }else{
	        	this.$refs.optMore.optTxt = this.$refs.optMore.allName.join('-');
	        	this.parts = this.$refs.optMore.allId.join('-')
	        }
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
      // 计算列表容器高度
      	this.opt.height = window.innerHeight - window.REM * 0.4 - 1
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
//     this.getList().then(res=>{
//	     	this.list = res;
//	   }).catch(this.handleError)
    },
  }
</script>

<style scoped>
    /**/
   .List /deep/ .HeaderTab .item{
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
	.List{
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
		margin-top: .1rem;
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
		height: .36rem;
	    line-height: .36rem;
	    padding: 0 .1rem;
	    display: inline-block;
	    border: 1px solid #dcdcdc;
	    border-radius: 2px;
	    margin-right: .05rem;
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
	.not_time{
		padding-top: .11rem;
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
	    border-radius: 3px;
	    margin-right: .35rem;
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
	.fourdet_three{
		padding-top: .1rem;
	}
	.day_type,.day_type2{
		display: inline-block;
		padding: .03rem .06rem;
		border: 1px solid #ed3800;
		color: #ef5633;
		border-radius: 6px;
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
</style>
