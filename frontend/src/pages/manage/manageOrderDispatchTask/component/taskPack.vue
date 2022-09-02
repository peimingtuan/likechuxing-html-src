<!--
	作者：xurui_518@163.com
	时间：2018-11-14
	描述：任务包
-->
<template>
	<div class="taskPack" >
		<div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="pageData.length === 0">
            列表为空
        </div>
		<div v-else class="task_item" 
			v-for="(item,index) in pageData"
			:key = 'index'
		>
			<p class="fc66">
				创建者：<span class="fc33">{{item.create_user}}</span>
			</p>
			<p class="fc66">
				创建时间：<span class="fc33">{{item.pack_create_time}}</span>
			</p>
			<div class="task_btn">
				<p class="cancel" v-show="item.is_mine==1" @click.stop="cancelPage(item.pack_id)">取消任务包</p>
				<p @click.stop="goDetail(item.create_user,item.pack_create_time,item.pack_id)">查看任务</p>
			</div>
		</div>
	</div>
	
</template>

<script>
	import $ from 'jquery'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name: "taskPack",
    props: {
    	creator:''
    },
    data () {
      return {
        pageData:[],
        dataReady:false,
//      creator:this.$route.query.user_id
      }
    },
    mounted () {
    	this.getTask().then(res=>{
    		this.dataReady = true
	        this.pageData = res;
	    }).catch(this.handleError);
	},
    methods: {
	    getTask(){
	    	
	    	var param = {mobile:userData.state.mobile}
	    	if(this.creator){
	    		param.creator = this.creator;
	    	}
			return myAjax.post(getOspApiUrl('algorithm/pack-list'),param).then(res=>{
	          if(res.status !== 0){
	            throw res
	          }else{
	            return res.data;
	          }
	        })
		},
      	goDetail(name,time,pack_id){
      		this.$router.push({
	          path:'/pageDetail',
	          query:{
	            'create_name':name,
	            'create_time':time,
	            'pack_id':pack_id,
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
			      		this.$emit('cancelPage',pack_id);
			      	}else{
			          this.$_LIKE_toast(res.msg)}
			      }).catch(err => {
			        console.log(err)
			      })
		}
      
   },
// created(){
//	   	this.getTask().then(res=>{
//		        this.pageData = res;
//		    }).catch(this.handleError);
// }
}
	
	
</script>

<style scoped>
	.fc99{
   		color: #999999;
   }
   .fc66{
   		color: #666666;
   } 
   .fc33{
   		color: #333333;
   }
   .taskPack{
   	position: relative;
   	padding-bottom: .64rem;
   }
   .task_item{
		margin-top: .1rem;
		padding: .2rem .1rem .1rem .1rem;
		background: #FFFFFF;
	}
	.task_btn {
	    text-align: right;
	    margin-top: .14rem;
	}
	.task_btn p {
	    display: inline-block;
	    text-align: center;
	    width: 35%;
	    padding: .08rem 0;
	    border: 1px solid #666;
	    border-radius: 2px;
	}
	.task_btn p:first-child {
	    margin-right: .1rem;
	}
	.status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
    }
</style>