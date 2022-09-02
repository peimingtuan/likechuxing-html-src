<!--
	作者：xurui_518@163.com
	时间：2018-11-15
	描述：任务包详情
-->
<template>
	<div class="pageDetail">
		<div class="page_head">
			<p class="page_user fc66">
				创建者：<span class="fc33">{{list.pack_creator}}</span>
			</p class="fc66">
			<p>
				创建时间：<span class="fc33">{{list.create_time}}</span>
			</p>
		</div>
		<div class="page_all">
			<div class="page_content fc66" v-for="(item,index) in list.list" :key = 'index'>
				<div class="task_num">
					<p class="fc33 task_dec">任务
						<span>{{index+1}}</span>
					</p>
					<p class="fd56" v-show="item.is_mine==0&&item.task_status!=0">已被领取</p>
					<p class="fd56 delete_icon" v-show="item.task_status==0" @click="deleteTask(item.task_id)">
						<img src="../images/icon_clearn.png" alt="" />
					</p>
				</div>
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
							<span>
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
							<span>
								调度距离：{{item.end_distance}}km
							</span>
						</p>
					</div>
					<p class="task_type">任务类型：
						<span>{{
							item.task_type==1?'调度':
							item.task_type==2?'按建议数摆放':
							item.task_type==3?'爆点疏散':
							item.task_type==4?'加油任务':
							item.task_type==96?'紧急调离':
							'调离'
						}}</span>
					</p>
	            	<p class="times fc66">完成时间：{{item.task_finish_time}}</p>
	            	<div class="task">
	            		<p class='get_task' v-if='item.task_status==0' @click.stop="getTak(item.task_id,item.plate_no,item.car_id,item.pack_id)">领取任务</p>
	            		<p class="re_task" v-if="item.is_mine==1&&item.task_status!=0">
	            			<span class="creat" @click.stop="creatTas(item.plate_no,item.task_id)">
	            				新建工单
	            			</span>
	            			<span class="cancel" @click.stop="cancelTak($event,item.task_id)">
	            				取消任务
	            			</span>
	            		</p>
	            	</div>
	            
			</div>
		</div>
		<div class="progress_btn">
			<p @click="checkProgress()">查看任务进度</p>
		</div>
		<cancel v-show="modal" ref='cancel' @cancelOrder='cancelOrder' ></cancel>
	</div>
</template>

<script>
	import $ from 'jquery'
	import userData from '../../../../../other_modules/like-manageOrder/UserData'
	import {getOspApiUrl} from '../js/getApiUrl'
	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
	import cancel from '../component/cancelOrder'
	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	import {Select} from '../../../../component/Select/index'
	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
	export default {
		name: "pageDetail",
		components: {
	      cancel
	    },
	    data () {
	      return {
	      	list:[],
	      	head_id:'3',
	      	name:this.$route.query.create_name,
	      	time:this.$route.query.create_time,
	      	pack_id:this.$route.query.pack_id,
	      	modal:false,
	      	textarea1:'',
	      	type_cont:'',
		    type_num:'',
		    task_id:''
	      	
	      }
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
	    	checkProgress(){
	    		this.$router.push({
		          path:'/taskProgress',
		          query:{
		            pack_id:this.pack_id
		          }
		        })
	    	},
	    	getList(){
				var param = {
					mobile: userData.state.mobile,
					lng: userData.state.locationsLng,
					lat: userData.state.locationsLat,
					pack_id:this.pack_id
				}
				return myAjax.post(getOspApiUrl('algorithm/pack-detail'),param).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
		    },
	        getTak(task_id,plate_no,car_id,pack_id){
	    		this.task_id = task_id;
	    		myAjax.post(getOspApiUrl('/algorithm/receive-task'), {
				    mobile: userData.state.mobile||'13521758602',
				    task_id: task_id,
				    car_id:car_id,
				    pack_id:pack_id
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
				      	}else if(res.status === '11110'){
				      		this.$_LIKE_toast(res.msg)
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
		    cancelTak(e,task_id){//取消任务
		      	e.preventDefault();
		    	 this.$refs.cancel.type_dec=false;
		    	 this.$refs.cancel.modal=true;
		    	 this.$refs.cancel.type_cont='';
		    	 //取消时清除弹层状态
		    	 this.$refs.cancel.textarea1='';
		    	 $('.selec').removeClass('fc44a');
		    	 this.task_id = task_id;
		    },
		    deleteTask(task_id){
		    	myAjax.post(getOspApiUrl('algorithm/del-pack-task'), {
			        mobile: userData.state.mobile,
			        task_id:task_id
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
		    },
		    creatTas(plate_no,task_id){
	    		sessionStorage.setItem('task_id',task_id);
			    window.location.href = '../manageOrderCardetail/index.html?plate_no='+plate_no+'&task_id='+task_id;
	    	},
	    },
	    created(){
	      // 计算列表容器高度
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
		   //上测试或上线注释掉
//	       this.getList().then(res=>{
//		     	this.list = res;
//		   }).catch(this.handleError)
	    },
	}
</script>

<style scoped>
	.fc33{
		color: #333333;
	}
	.fc66{
		color: #666666;
	}
	.fc99{
		color: #999999;
	}
	.fcb0{
		color: #b0b2b5;
	}
	.fd56{
		color: #fd5264;
	}
	.progress_btn{
		width: 100%;
		height: 0.63rem;
		position: fixed;
		bottom: 0;
		background: #FFFFFF;
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		-webkit-justify-content: space-between;
		align-items: center;
		-webkit-align-items: center;
		-moz-box-shadow: 0px -3px 5px #e7e7e7;
	    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
	    box-shadow: 0px -3px 5px #e7e7e7;
	    padding: 0 .1rem;
	}
	.progress_btn p{
		width: 98%;
		padding: 0.1rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
		background: #333333;
	}
	.page_head{
		padding: .12rem .11rem;
		background: #FFFFFF;
		margin-bottom: .1rem;
	}
	.page_user{
		margin-bottom: .12rem;
	}
	.page_content{
		background: #FFFFFF;
		padding: .12rem .1rem;
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
	.page_content{
		margin-bottom: .15rem;
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
		padding-bottom: .1rem;
	}
	.task_type{
		padding: .2rem 0 .08rem 0;
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
	.page_all{
		padding-bottom: .64rem;
	}
	.task_num{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		-webkit-justify-content: space-between;
		align-items: center;
		-webkit-align-items: center;
		margin-bottom: .13rem;
	}
	.delete_icon{
		width: .18rem;
		height: .18rem;
	}
	.delete_icon img{
		width: 100%;
		height: 100%;
		vertical-align:top;
	}
</style>

