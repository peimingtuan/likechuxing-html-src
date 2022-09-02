<template>
	<div class="myList">
		<HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="filterShow"
                @tabRefresh="refresh"
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
        	<div class="his_item" 
        		v-for="listItem in list"
        		:key = 'listItem.id'
        		@click="goFinish(listItem.id,listItem.status)"
        	>
				<div class="car_card">
					<p class="car_plat">
						<span class="fc33">{{listItem.plate_no}}</span>
						(<span class="fc33" v-show="listItem.vin">{{listItem.vin.substring(listItem.vin.length-6)}}</span>)
						<span class="car_status">{{listItem.order_type_text}}</span>
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
						{{listItem.branch_name}}
						{{listItem.current_parking_floor}}
						{{listItem.current_parking_no}}
					</span>
				</p>
				<p class="not_time fc66">
					<span class="is_rule" v-show='listItem.area&&listItem.area!=0'></span><span class="icon_addr no_addr"></span>当前预计停车费
					{{listItem.parking_fee}}
					元
				</p>
				<div class="status_modal">
					<div class="status_title">
						<!--待取车，使用中，已完成-->
						<p
							:class="listItem.status == 1?'move_status_zero':listItem.status == 2?'move_status_one':'move_status_two'"
						>
							<span 
								class="line_left"
								:class="listItem.status == 1?'line_left_zero':listItem.status == 2?'line_left_one':'line_left_two'"
							></span>
							{{listItem.status_text}}
						</p>
						<p class="fc66">
							办公 {{listItem.id}}
						</p>
						
					</div>
					<p class="not_time">
						<span>用车时长：</span>
						<span class='fc33'>
							{{listItem.last_time}}小时
						</span>
					</p>
					<p class="not_time">
						<span>用车里程：</span>
						<span class='fc33'>
							{{listItem.total_km}}公里
						</span>
					</p>
    		</div>
			</div>
        </PullDownRefresh>
		<SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">
            <FilterMultiple
                title="工单状态"
                :options="warnOpt"
                :required="true"
                ref="warnfilter"
                :preselect='zombie_status'
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
	</div>
</template>

<script>
	import $ from 'jquery'
 	import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import FilterSingle from '../component/FilterSingle'
	import FilterMultiple from '../component/FilterMultiple'
	import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	  
	const OrderStatus = require('../js/orderStatus')
	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
	require("../css/modal.css")
	
	export default{
		name:'myList',
		components: {
	      HeaderTab,
	      SlideUpBox,
      	  FilterSingle,
          FilterMultiple,
      	  LikeButton,
     	  PullDownRefresh,
	    },
		data(){
			return{
				headerTabModule: [
		          'search',
		          'filter',
		          'refresh'
		        ],
				dataReady:false,
				list:'',
				page:1,
		        opt: {
		          height: 300, // 容器高度
		          usePullDown: true,// 是否启用下拉
		          usePullUp: true // 是否启用上拉
		        },
		        warnOpt:OrderStatus.warnfun.map(item=>{
		          item.id = item.status
		          return item
		        }),
		        zombie_status:[],
		        filter_show: false,
		        car_id: this.$route.query.car_id
			}
		},
		beforeCreate () {
		},
	
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			$('body').css('background','#F6F6F6');
		},
		methods: {
			init(){
				var param;
				if(this.car_id){
					param= {
						"mobile":userData.state.mobile||sessionStorage.getItem('mobile'),
						'lng':sessionStorage.getItem('lng')||userData.state.locationsLng,		//经度
						'lat':sessionStorage.getItem('lat')||userData.state.locationsLat,		//维度
						'status':this.zombie_status.join(','),
						'car_id':this.car_id,
						'is_mine':'0',
						'page':this.page
					}
				}else{
					param= {
						"mobile":userData.state.mobile||sessionStorage.getItem('mobile'),
						'lng':sessionStorage.getItem('lng')||userData.state.locationsLng,		//经度
						'lat':sessionStorage.getItem('lat')||userData.state.locationsLat,		//维度
						'status':this.zombie_status.join(','),
						'is_mine':'1',
						'page':this.page
					}
				}
				
				if(this.$route.query.plate_no){
					param.plate_no = this.$route.query.plate_no;
				}
				return myAjax.post(getOspApiUrl('/vehicle-office/order-list'),param).then(res=>{
		          this.dataReady = true;
		          // 计算列表容器高度
      				this.opt.height = window.innerHeight - window.REM * 0.4 - 1;
			          if(res.status !== 0){
			            throw res
			          }else{
			            return res.data;
			          }
		        })
			},
			goFinish(id,status){
				if(status==3){
					this.$router.push({
			          path:'/finishedOrder',
			          query:{
			          	order_id:id
			          }
			        })
				}else if(status==1||status==2){
					this.$router.push({
			          path:'/orderDetail',
			          query:{
			          	order_id:id
			          }
			        })
				}
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
			          query:{
			          	enter:'1'
			          }
			        })
	      	},
	      	pullDown(){
		        this.page = 1
		        this.init().then(res=>{
		          this.list = res;
		          this.$refs.pullUpDown.update();
		        }).catch(this.handleError);
	      	},
	      	pullUp(){
		        this.page++
		        this.init().then(res=>{
		          this.list = this.list.concat(res)
		          if(res.length === 0){
		            this.$refs.pullUpDown.update({noMore:true})
		          }else{
		            this.$refs.pullUpDown.update()
		          }
		        }).catch(this.handleError)
	      	},
	    filterReset(){
	        this.$refs.warnfilter.reset();
	        this.resetAll = true;
      	},
      	sort(){
	      	this.sort_show = true;
      	},
      	filterSearch(){
	        this.filter_show = false;
	        this.zombie_status = this.$refs.warnfilter.getResult();
	        this.pullDown()
      	},
  		handleError(err){
	        if(err && err.msg){
	          this.$_LIKE_toast(err.msg)
	        }else{
	          console.log(err)
	        }
      	},
		},
		created(){
			if(this.car_id){
				this.$route.meta.title='办公用车工单'
				document.title = this.$route.meta.title
				var title = this.$route.meta.title
				dd.setWebTitle(title)
			}else{
				this.$route.meta.title='我的工单'
				document.title = this.$route.meta.title
				var title = this.$route.meta.title
				dd.setWebTitle(title)
			}
			this.init().then(res=>{
		     	this.list = res;
		   	}).catch(this.handleError)
		}
	}
</script>

<style scoped>
	.fc33{
		color: #333333;
	}
	.fcfe{
		color: #fe6d7c
	}
	.fc99{
		color: #999999;
	}
	.fc66{
		color: #666666;
	}
	.box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
    }
    .btn {
        width: 47%;
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
.carpro_card{font-size: .14rem;}
.carpro_date{
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	-webkit-align-items: center;
	justify-content: space-between;
	-webkit-justify-content: space-between;
}
.his_item{
		background-color: #FFFFFF;
		padding: 0.14rem 0.11rem 0.13rem 0.11rem;
		margin-bottom: .1rem;
	}
	.car_card{
		display: flex;
	    align-items: center;
	    justify-content: space-between;
	   	display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
	}
	.is_rule{
		display: inline-block;
		width: .18rem;
		height: .18rem;
	}
	.car_color{
		padding: 0 .06rem;
		border-left: 1px solid #CDCDCD;
		border-right: 1px solid #CDCDCD;
	}
	.car_plat span:first-child{
		font-weight: 700;
	}
	.car_dec span{
	    display: inline-block;
	    /*padding-right: .05rem;*/
	    color: #666;
	    height: .12rem;
	    line-height: .12rem;
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
		padding-right: .1rem;
		
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
	.limit_type i{
		border-radius: 3px;
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
	    padding: .06rem 0 .1rem 0;
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
		color: #7fd51d;
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.line_left{
		display: inline-block;
	    height: .2rem;
	    width: 4px;
	    vertical-align: bottom;
	    border-radius: 0 4px 4px 0;
	    margin-right: .03rem;
	}
	.line_left_zero{
	    background: #FD5264;
	}
	.line_left_one{
	    background: #ffa500;
	}
	.line_left_two{
	    background: #7fd51d;
	}
	.status_title{
		display: flex;
		justify-content: space-between;
		display: -webkit-flex;
		-webkit-justify-content:space-between;
		padding-right: .1rem;
	}
</style>