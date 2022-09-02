<template>
	<div class="oilList">
         <div>
         	<div v-show="type==1" class="charge_info">
         		<p>
         			最近三次充电方式
         		</p>
	         	<div  class="charge_top">
	         		<div class="last_charge"
	         			v-for="(item,index) in chargeType"
	         			:key = 'index'
	         		>
	         			<div class="image_process">
	         				<img 
	         					:src="item==0?imgSrc0:item==1?imgSrc1:imgSrc2" 
	         					alt="" 
	         				/>
	         			</div>
	         			<p>
	         				{{item==1?'快充':item==2?'慢充':'无数据'}}
	         			</p>
	         		</div>
	         		<div class="last_charge">
	         			<div class="image_process">
	         				<img src="../images/nowicon.png" alt="" />
	         			</div>
	         			<p>请合理安排本次充电方式</p>
	         		</div>
	         	</div>
         	</div>
         	<div class="list_item" 
         		v-for="(item,index) in list" 
         		:key='index'
         		@click="goNext(item.id)"
         	>
         		<div>
         			<p class="item_time">
         				<span class="fc66">{{item.create_time}} </span> 
         				&nbsp;
         				&nbsp;
         				&nbsp;
         				{{item.fee}}元
         			</p>
         			<p>
         				{{type==1?item.charge_branch_name:item.name}}
         			</p>
         		</div>
         		<span class="arrdown"></span>
         	</div>
         </div>
         <div class="creat_btn" v-if="enter!='1'">
			<p class="crea_submit subf33" @click="createSub()">{{type==1?'录入充电信息':'录入加油信息'}}</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	  
	
	export default{
		name:'oilList',
		components: {
	    },
		data(){
			return{
				dataReady:false,
				list:[],
				type:this.$route.query.type,//1、电车       2/3、油车
				enter:this.$route.query.enter||'',//1为查看 0为录入
				chargeType:[],
				imgSrc0:require('../images/noinfo.png'),
				imgSrc1:require('../images/quick.png'),
				imgSrc2:require('../images/trickle.png'),
				order_id:this.$route.query.order_id,
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
				var param = {
	            	"mobile":userData.state.mobile||sessionStorage.getItem('mobile'),
					order_id:this.$route.query.order_id
				}
				var apiUrl;
				apiUrl = this.type==1?'/vehicle-office/charging':'/vehicle-office/oils';
				return myAjax.post(getOspApiUrl(apiUrl),param).then(res=>{
		          this.dataReady = true;
			          if(res.status !== 0){
			            throw res
			          }else{
			            return res.data;
			          }
		        })
			},
			goNext(id){//录入enter=0，查看enter=1
				if(this.type!=1){
					window.location.href='../manageOrder/oilerSingle/checkoilerinfo.html?type=1&office_id='+id;
				}else{
					this.$router.push({
						path:'/chargeInfo',
						query:{
							'his_id':id,
							enter:'1'
						}
					})
				}
			},
			createSub(){
				if(this.type!=1){
					sessionStorage.removeItem('order_id')
    				sessionStorage.removeItem('type')
					window.location.href='../manageOrder/oilerSingle/editrefueling.html?type=1&order_id='+this.order_id;
				}else{
					this.$router.push({
						path:'/chargeInfo',
						query:{
							'order_id':this.order_id,
							'type':'1',
							enter:'0'
						}
					})
				}
			}
		},
		created(){
			if(this.type == 1){
				this.$route.meta.title='充电记录'
				document.title = this.$route.meta.title
				var title = this.$route.meta.title
				dd.setWebTitle(title)
			}else{
				this.$route.meta.title='加油记录'
				document.title = this.$route.meta.title
				var title = this.$route.meta.title
				dd.setWebTitle(title)
			}
			this.init().then(res=>{
				this.dataReady=true;
		     	this.list = res;
				if(this.type==1){//电车显示前三次处理方式
					var allType=[];
					for(var i=0;i<res.length;i++){
						allType.push(res[i].type);
					}
					allType.length>3?allType.slice(0,4)
					:allType.length==0?allType=[0,0,0]:allType.length==1?
					allType.unshift(0,0):allType.length==2?
					allType.unshift(0):allType;
					this.chargeType = allType
				}
				
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
.list_item{
	background: #FFFFFF;
	    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .15rem;
    margin-bottom: .1rem;
}
.list_item:last-child{
	margin-bottom: .63rem;
}
.arrdown {
    display :inline-block;
    position: relative;
    width: 20px;
    height: 15px;
}
.arrdown::after {
    display: inline-block;
    content: " ";
    height: 10px;
    width: 10px;
    border-width: 2px 2px 0px 0px;
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
.creat_btn{
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
.crea_submit{
	width: 95%;
	color: #FFFFFF;
	padding: 0.15rem;
	text-align: center;
	border-radius: 2px;
}
.subf33{
	background: #333333;
}
.item_time{
	padding-bottom: .1rem;
}
.image_process{
	display: inline-block;
	width: .3rem;
	height: .3rem;
}
.image_process img{
	width: 100%;
	height: 100%;
}
.charge_top {
    
    display: flex;
    justify-content: space-between;
     align-items: flex-start;
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: flex-start;
    padding: .2rem 0 .1rem 0; 
}
.charge_info{
	padding: .18rem .12rem .2rem .1rem;
	background: #fff;
	margin-bottom: .1rem;
}
.last_charge{
	width: 20%;
	text-align: center;
}
</style>