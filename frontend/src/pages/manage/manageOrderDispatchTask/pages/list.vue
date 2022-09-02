<template>
    <div class="List">

        <HeaderTab v-if='head_id!=2'
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="filterShow"
                @tabRefresh="refresh"
                @tabSort='sort'
        />
        <HeaderTab v-else
                :module="headerTabModule2"
                @tabSearch="goSearch"
                @tabRefresh="refresh"
        />
		<div class="list_head">
			<p 
				:class="head_id==index?'active':''" 
				v-for="(item,index) in headItem" 
				:key = 'index'
				@click="goTab(index)">
				{{item}}
			</p>
		</div>
		<!--已领取tab-->
		<div v-if="head_id==3" class="task_tab">
        	<p 
				:class="task_page==index?'task_active':''" 
				v-for="(item,index) in taskItem"
				:key = 'index'
				@click="taskTab(index)">
				{{item}}
			</p>
        </div>
        <div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="head_id!=3&&head_id!=2&&list.length === 0">
            列表为空
        </div>
        <PullDownRefresh
        	v-else
                :opt="opt"
                @pullDown="pullDown"
                ref="pullUpDown"
        >
        	<!--未领取、已领取-->
            <div class="list_cont" v-if="head_id!=2&&task_page=='0'"
            	@click="goDetail(item.plate_no,item.begin_branch_name,item.begin_distance,item.begin_branch_lat,item.begin_branch_lng,
            	item.end_branch_name,item.end_distance,item.end_branch_lat,item.end_branch_lng,item.id,item.car_id)" 
            	v-for="(item,index) in list"
            	:key = 'index'
            >
            	<div class="addr_get fc66">
					<p class="addr_left">
						<span>取：
							<span class="addr_icon">
								<img v-if="item.begin_branch_type==1" src="../images/map-B.png" alt="" />
								<img v-else src="../images/mapb.png" alt="" />
							</span>
							<span class="addr_dec">{{item.begin_branch_name}}</span>
						</span>
					</p>
					<p class="addr_right">
						<span class="fcb0">
							距您当前：{{item.begin_distance}}km
						</span>
					</p>
				</div>
				<div class="addr_give fc66">
					<p class="addr_left">
						<span>还：
							<span class="addr_icon">
								<img v-if="item.end_branch_type==1" src="../images/map-B.png" alt="" />
								<img v-else src="../images/mapb.png" alt="" />
							
							</span>
							<span class="addr_dec">{{item.end_branch_name}}</span>
						</span>
					</p>
					<p class="addr_right">
						<span class="fcb0">
							调度距离：{{item.end_distance}}km
						</span>
					</p>
				</div>
            	<p class="times fc66">完成时间：{{timestampToTime(item.finish_time)}}</p>
            	<div class="task">
            		<p class='get_task' v-if='head_id==0' @click.stop="getTak(item.id,item.plate_no,item.car_id)">领取任务</p>
            		<p class="re_task" v-else-if='head_id==3'>
            			<span class="creat" @click.stop="creatTas(item.plate_no,item.id)">
            				创建工单
            			</span>
            			<span class="cancel" @click.stop="cancelTak($event,item.id,item.task_status)">
            				取消任务
            			</span>
            		</p>
            	</div>
            </div>
            <!--任务包-->
            <taskPack v-if="head_id==2" 
            	:creator = 'creator'
            	@cancelPage = 'cancelPage'
            	ref='taskPage'>
            	
            </taskpack>
            <!--任务包已领取-->
            <div v-if="task_page=='1'">
            	<div class="get_page" 
            		v-for="(items,indexs) in pageData"
            		:key = 'indexs'
            	>
	            	<p class="page_name">
	            		<span>创建人：</span>
	            		<span>{{items.create_user}}</span>
	            	</p>
	            	<p>
	            		<span>创建时间：</span>
	            		<span>{{items.pack_create_time}}</span>
	            	</p>
	            	<div class="get_page_btn">
	            		<p @click.stop="cancelPage(items.pack_id)" v-show="items.is_mine==1">取消任务</p>
	            		<p @click.stop="pageCheck(items.create_user,items.pack_create_time,items.pack_id)">查看任务</p>
	            	</div>
	            </div>
            </div>
            
        </PullDownRefresh>

        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">
            <FilterSingle
                title="网点类型"
                :options="options"
                :required="true"
                ref="filter"
                :preselect='status'
            />
			<FilterMultiple
                title="调度类型"
                :options="taskOpt"
                :preselect="taskStatus"
                ref="taskfilter"
            />
			<FilterMultiple
                title="油/电量"
                :options="oilOpt"
                :preselect="oilStatus"
                ref="oilfilter"
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
		<cancel v-show="modal" ref='cancel' @cancelOrder='cancelOrder' ></cancel>
		<div class="check_modal" v-show="pageModal"> 
			<!--取消-->
			<div class="modal_content  page_modal">
					<div class="modal_det page_det">
						请先将已领取的任务取消！
					</div>
					<div class="alert_btn">
						<p class="tel_con confirm_btn" @click="pageModal=false">
							<a>确认</a>
						</p>
					</div>
			</div>
		
		</div>
		<div class="creat_page" v-if="head_id==2" @click="goNew()">
			<p>
				创建任务包
			</p>
		</div>
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
  import cancel from '../component/cancelOrder'
  import taskPack from '../component/taskPack'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  
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
      cancel,
      taskPack
    },
    data () {
      return {
        headerTabModule: [
          'search',
          'sort',
          'filter',
          'refresh'
        ],
        headerTabModule2: [
          'search',
          'refresh'
        ],
        filter_show: false,
        options:OrderStatus.bizfun.map(item=>{
          item.id = item.status
          return item
        }),
        status:0,
        page:1,
        opt: {
          height: 300, // 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: false // 是否启用上拉
        },
        dataReady:false,
        // 是否是搜索来的
//      search:false,
        list:[],
        headItem:['待领取','待领地图','任务包','已领取'],
        head_id:'0',
        modal:false,
        sort_show:false,
        sorts:[
			{"sortCont":"完成时间从近到远",'sortType':'0'},
			{"sortCont":"距离网点从近到远",'sortType':'1'}
		],
		sort_type:1,
		istab:false,//为了重置筛选，是否切换了tab
		task_id:'',//任务id
		//任务类型
		oilOpt:OrderStatus.disfun.map(item=>{
          item.id = item.status
          return item
        }),
        oilStatus:[],
        taskOpt:'',
        taskStatus:[],
        task_page:'0',//任务包tab栏
        taskItem:['已领取任务','任务包'],
        pageModal:false,
        pageData:'',
        creator:sessionStorage.getItem('user_id')||''
      }
    },
    watch: {
		'$route' (to, from) {
			this.list = []
	        this.dataReady = false
	        this.pullDown()
	        if(sessionStorage.getItem('user_id'))this.head_id='2';
	        this.creator = sessionStorage.getItem('user_id')
		},
		
	},
    destroyed(){
		$('html').css('height','auto');
		$('body').css('height','auto');
	},
	mounted () {
		$('html').css('height','100%');
		$('body').css('height','100%');
		$('.List').height($(window).height());
		
//		userData.save({
//          	mobile:'13521758602'
//        	})
	},
    methods: {
    	select(){
			var param={mobile: userData.state.mobile||'13521758602'}
			return myAjax.post(getOspApiUrl('/algorithm/select'),param).then(res=>{
	          if(res.status !== 0){
	            throw res
	          }else{
	            return res.data;
	          }
	        })
    	},
    	creatTas(plate_no,task_id){
    		sessionStorage.setItem('task_id',task_id);
		    window.location.href = '../manageOrderCardetail/index.html?plate_no='+plate_no+'&task_id='+task_id;
    	},
    	getTak(task_id,plate_no,car_id){
    		this.task_id = task_id;
    		myAjax.post(getOspApiUrl('/algorithm/receive-task'), {
			    mobile: userData.state.mobile||'13521758602',
			    task_id: task_id,
			    car_id:car_id
			}).then(res => {
			  	if (res.status === 0) {
			  		sessionStorage.setItem('task_id',task_id);
		      		window.location.href = '../manageOrderCardetail/index.html?plate_no='+plate_no+'&task_id='+task_id;
		      	}else{
		      		this.$_LIKE_toast(res.msg)
		      	}
			}).catch(err => {
			    console.log(err)
			})
    	},
	    timestampToTime(timestamp) {//转换时间
	        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	        var Y = date.getFullYear() + '-';
	        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	        var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ '  ';
	        var h = date.getHours()+':';
	        var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ':';
	        var s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
	        return Y+M+D+' '+h+m+s;
	    },
      getList(){
		var param = {
			lng: userData.state.locationsLng,
	      	lat: userData.state.locationsLat,
	        biz_type:this.$route.query.type=='map'?'0':this.status,
	        tab_type:this.head_id==3?'1':'0',
	        show_type:'0',
	        mobile:userData.state.mobile||'13521758602',
	        sort:this.sort_type,
	        task_type:this.$route.query.type=='map'?[]:JSON.stringify(this.taskStatus),
	        oil_type:this.$route.query.type=='map'?[]:JSON.stringify(this.oilStatus),
		}
		if(userData.state.city_ids){
			param.city_id=userData.state.city_ids
		}
		if(this.head_id=='3'){
				delete param.branch_id;
		}else{
			if(this.$route.query.search_type=='0'){
				param.car_id = this.$route.query.search_id
			}else if(this.$route.query.search_type=='1'){
				param.branch_id = this.$route.query.search_id
			}
		}
		
		return myAjax.post(getOspApiUrl('/algorithm/list'),param).then(res=>{
          this.dataReady = true
          if(res.status !== 0){
            throw res
          }else{
            return res.data;
          }
        })
      },

      pullDown(){
        this.page = 1;
        if(this.head_id!=2&&this.task_page == 0){
        	this.getList().then(res=>{
	          this.list = res;
	          this.$refs.pullUpDown.update();
	        }).catch(this.handleError);
        }else if(this.head_id==2){
        	console.log('shifou***')
        	this.creator = sessionStorage.getItem('user_id');
        	this.$refs.taskPage.getTask().then(res=>{
        		this.dataReady = true;
		       this.$refs.taskPage.pageData = res;
		        this.$refs.pullUpDown.update();
		    }).catch(this.handleError);
        }else if(this.task_page==1){
        	this.myPage().then(res=>{
        		this.dataReady = true;
	        	this.pageData = res;
	        	 this.$refs.pullUpDown.update();
	      	}).catch(this.handleError)
        }
        
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

      toSearch () {
      	this.head_id = '0';
      	this.status=0;
      	this.oilStatus=[];
      	this.taskStatus=[];
        this.$router.push({
          path:'/searchPro',
          query:{
            show_type:'0'
          }
        })
      },

      pullDown(){
        this.page = 1;
        if(this.head_id!=2&&this.task_page == 0){
        	this.getList().then(res=>{
	          this.list = res;
	          this.$refs.pullUpDown.update();
	        }).catch(this.handleError);
        }else if(this.head_id==2){
        	console.log('shifou***')
        	this.creator = sessionStorage.getItem('user_id');
        	this.$refs.taskPage.getTask().then(res=>{
        		this.dataReady = true;
		       this.$refs.taskPage.pageData = res;
		        this.$refs.pullUpDown.update();
		    }).catch(this.handleError);
        }else if(this.task_page==1){
        	this.myPage().then(res=>{
        		this.dataReady = true;
	        	this.pageData = res;
	        	 this.$refs.pullUpDown.update();
	      	}).catch(this.handleError)
        }
        
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

      toSearch () {
      	this.head_id = '0';
      	this.status=0;
      	this.oilStatus=[];
      	this.taskStatus=[];
        this.$router.push({
          path:'/searchPro',
          query:{
            show_type:'0'
          }
        })
      },
      goSearch () {
      	this.head_id = '0';
      	this.status=0;
      	this.oilStatus=[];
      	this.taskStatus=[];
        this.$router.push({
          path:'/searchName',
          query:{
            show_type:'0'
          }
        })
      },
      filterShow () {
        this.filter_show = true;
      },
      refresh () {
        this.list = []
        this.dataReady = false
        this.pullDown()
      },

      filterClose () {
        this.filter_show = false;
        this.sort_show = false;
      },
      filterReset(){
        this.$refs.filter.reset();
        this.$refs.oilfilter.reset();
        this.$refs.taskfilter.reset()
        
      },
      sort(){
      	this.sort_show = true;
      },
      goSearch () {
      	this.head_id = '0';
      	this.status=0;
      	this.oilStatus=[];
      	this.taskStatus=[];
        this.$router.push({
          path:'/searchName',
          query:{
            show_type:'0'
          }
        })
      },
      filterShow () {
        this.filter_show = true;
      },
      refresh () {
        this.list = []
        this.dataReady = false
        this.pullDown()
      },

      filterClose () {
        this.filter_show = false;
        this.sort_show = false;
      },
      filterReset(){
        this.$refs.filter.reset();
        this.$refs.oilfilter.reset();
        this.$refs.taskfilter.reset()
        
      },
      sort(){
      	this.sort_show = true;
      },
      filterSearch(){
        this.filter_show = false;
        this.status = this.$refs.filter.getResult();
        this.oilStatus = this.$refs.oilfilter.getResult();
        this.taskStatus = this.$refs.taskfilter.getResult();
        this.pullDown()
      },
      toDetail(id){
        this.$router.push({
          path:'/detail',
          query:{
            order_id:id
          }
        })
      },
      handleError(err){
        if(err && err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          console.log(err)
        }
      },
      goTab(index){
      	index!=1?this.head_id = index:this.head_id;
      	this.dataReady = false;
      	this.task_page = 0;
      	this.creator = '';
      	sessionStorage.removeItem('user_id')
      	if(index==1){
      		this.status=0;
      		this.sort_type=1;
      		this.oilStatus=[];
      		this.taskStatus=[];
      		this.head_id =0;
      		this.$router.push({
	          path:'/disMap'
	        })
      	}else{
      		this.status=0;
      		this.list=[];
      		this.sort_type=1;
      		this.oilStatus=[];
      		this.taskStatus=[];
      		this.getList().then(res=>{
		        this.list = res;
		    }).catch(this.handleError)
      	}
      },
      goDetail(id,begin_name,begin_distance,begin_lat,begin_lng,end_name,end_distance,end_lat,end_lng,task_id,car_id){
      	var branch_info = {'begin_name':begin_name,'begin_distance':begin_distance,'begin_lat':begin_lat,'begin_lng':begin_lng,'end_name':end_name,'end_distance':end_distance,'end_lat':end_lat,'end_lng':end_lng,'task_id':task_id,'car_id':car_id}
      	this.$router.push({
	          path:'/disDetail',
	          query:{
	            plate_no:id,
	            branch_info:JSON.stringify(branch_info),
	            tab_type:this.head_id==3?'1':'0'
	          }
	          
	        })
      },
      cancelTak(e,task_id,task_status){//取消任务
      	if(task_status==1){
	      	e.preventDefault();
	    	 this.$refs.cancel.type_dec=false;
	    	 this.$refs.cancel.modal=true;
	    	 this.$refs.cancel.type_cont='';
	    	 //取消时清除弹层状态
	    	 this.$refs.cancel.textarea1='';
	    	 $('.selec').removeClass('fc44a');
	    	 this.task_id = task_id;
    	}else{
    		this.$_LIKE_toast('工单正在进行，无法取消任务');
    	}
      },
      cancelOrder(){//确认取消
      	this.textarea1 = this.$refs.cancel.textarea1;
      	this.type_cont = this.$refs.cancel.type_cont;
      	this.type_num = this.$refs.cancel.type_num;
      	if(this.textarea1.length>0&&this.type_cont){
      		myAjax.post(getOspApiUrl('/algorithm/cancel'), {
		        mobile: userData.state.mobile,
		        task_id: this.task_id,
		        cancel_type:this.type_num,
		        cancel_remark:this.textarea1
		      }).then(res => {
		      	if (res.status === 0){
		      		this.$refs.cancel.modal = false;
      				this.head_id = 0;
      				this.getList().then(res=>{
				       this.list = res;
				    }).catch(this.handleError)
		      	}else{
		          this.$_LIKE_toast(res.msg)}
		      }).catch(err => {
		        console.log(err)
		      })
      	}else if(!this.type_cont||this.type_cont.length==0){
      		this.$_LIKE_toast('请填写取消类型')
      	}else if(!this.textarea1&&this.textarea1.length==0){
      		this.$_LIKE_toast('请填写备注')
      	}
      },
      sortCheck(sortType,e){
      	this.sort_type = sortType;
      	setTimeout(()=>{
      		this.sort_show = false;
      		this.getList().then(res=>{
		        this.list = res;
		    }).catch(this.handleError)
      	},500)
      },
      goNew(){
      	this.$router.push({
	          path:'/newPage',
	          query:{
	            
	          }
	          
	        })
      },
      taskTab(index){
      	this.task_page = index;
      	if(index==0){
      		this.getList().then(res=>{
	        	this.list = res;
	      	}).catch(this.handleError)
      	}else{
      		this.myPage().then(res=>{
	        	this.pageData = res;
	      	}).catch(this.handleError)
      	}
      },
	pageCheck(name,time,pack_id){
		this.$router.push({
          path:'/pageDetail',
          query:{
            'create_name':name,
            'create_time':time,
            'pack_id':pack_id,
          }
          
        })
	},
	myPage(){
		return myAjax.post(getOspApiUrl('algorithm/my-pack'),{mobile:userData.state.mobile}).then(res=>{
          this.dataReady = true
          if(res.status !== 0){
            throw res
          }else{
            return res.data;
          }
        })
	},
	cancelPage(pack_id){
//		this.pageModal=true;
		myAjax.post(getOspApiUrl('algorithm/cancel-pack'), {
		        mobile: userData.state.mobile,
		        pack_id:pack_id
		      }).then(res => {
		      	if (res.status === 0){
		      		this.head_id = 0;
		      		this.task_page = 0;
		      		this.dataReady = false;
		      		this.getList().then(res=>{
			          this.list = res;
			        }).catch(this.handleError);
		      	}else{
		          this.$_LIKE_toast(res.msg)}
		      }).catch(err => {
		        console.log(err)
		      })
	}
    },
    created(){
		sessionStorage.getItem('user_id')?this.head_id='2':this.head_id='0'
      // 计算列表容器高度
      	this.opt.height = window.innerHeight - window.REM * 0.82 - 1;
      	this.$route.query.type=='map'?this.head_id='0':this.head_id
      	dd.getLocation().then(res => {
          	userData.save({
            	locationsLng: res.longitude||this.$route.query.lng,
            	locationsLat: res.latitude||this.$route.query.lat
          	})
          	if(this.head_id!=2||this.task_page==0){
          		this.getList().then(res=>{
		        	this.list = res;
		      	}).catch(this.handleError)
          	}
          	
		}).catch(err => {
	          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
	   	});
      	this.select().then(res=>{
	        this.taskOpt = res.map(item=>{
	          item.status = item.id
	          return item
	        })
	   }).catch(this.handleError);
//	   //上测试或上线注释掉
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
	.list_head{
		background: #FFFFFF;
		display: flex;
	    justify-content: space-between;
	    align-items: center;
		display: -webkit-flex;
	    -webkit-justify-content: space-between;
	   -webkit-align-items: center;
	    padding: .08rem .1rem;
	}
	.list_head p {
	    width: 24%;
	    text-align: center;
	    border: 1px solid #cdcdcd;
	    line-height: .28rem;
	    border-radius: 2px;
	    background: #FFFFFF;
	}
	.list_head p.active{
		border: none;
		background: #42a8ec;
		color: #FFFFFF;
		border: 1px solid #42a8ec;
	}
	.addr_icon{
		display: inline-block;
		width: .15rem;
		height: .2rem;
		margin-right: .1rem;
	}
	.addr_icon img{
		width: 100%;
		height: 100%;
	}
	.list_cont{
		margin-top: .1rem;
		padding: .2rem .1rem .1rem .1rem;
		background: #FFFFFF;
	}
	.addr_get,.addr_give{
		display: flex;
		justify-content: space-between;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
	}
	.addr_get{
		margin-bottom: .15rem;
	}
	.addr_right{
		width: 51%;
		text-align: right;
	}
	.addr_left{
		width: 50%;
		margin-right: .1rem;
	}
	.addr_left>span{
		display: flex;
		align-items: center;
		display: -webkit-flex;
		-webkit-align-items: center;
	}
	.addr_dec{
		flex: 1;
		-webkit-flex: 1;
	}
	.times{
		padding: .2rem 0 .1rem 0;
	}
	.get_task,.re_task span{
		text-align: center;
	    border: 1px solid #979797;
	    height: .43rem;
	    line-height: .43rem;
	    border-radius: 2px;
	}
	.re_task span{
		display: inline-block;
		width: 47%;
	}
	.creat{
		margin-right: 3%;
		background: #484848;
		color: #FFFFFF;
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
	.creat_page{
		width: 100%;
		height: 0.63rem;
		position: fixed;
		bottom: 0;
		background: #FFFFFF;
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
		-moz-box-shadow: 0px -3px 5px #e7e7e7;
	    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
	    box-shadow: 0px -3px 5px #e7e7e7;
	}
	.creat_page p{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
		background: #333;
	}
	.task_active{
		color: #42a6ea;
		border-bottom: 2px solid #42a6ea;
		
	}
	.task_tab{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		-webkit-justify-content: space-between;
		align-items: center;
		-webkit-align-items: center;
		text-align: center;
		height: .35rem;
		line-height: .35rem;
		color: #999999;
		background: #FFFFFF;
		border-top: 1px solid #F6F6F6;
		border-bottom: 1px solid #F6F6F6;
	}
	.task_tab p{
		width: 50%;
	}
	.get_page{
		padding: .2rem .1rem .1rem .1rem;
		background: #FFFFFF;
		margin-bottom: .1rem;
	}
	.get_page_btn {
	    text-align: right;
	    margin-top: .14rem;
	}
	.get_page_btn p {
	    display: inline-block;
	    text-align: center;
	    width: 35%;
	    padding: .08rem 0;
	    border: 1px solid #666;
	    border-radius: 2px;
	}
	.get_page_btn p:first-child {
	    margin-right: .1rem;
	}
	.page_name{
		margin-bottom: .13rem;
	}
	.page_modal{
		text-align: center;
		height: 1.04rem;
	}
</style>
