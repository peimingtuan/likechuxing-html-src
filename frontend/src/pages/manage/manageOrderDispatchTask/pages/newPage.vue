<!--
	作者：xurui_518@163.com
	时间：2018-11-14
	描述：创建任务
-->
<template>
	<div class="newPage">
		<div>
			<div class="task_type">
				<p class="type_title">请选择领取类型</p>
				<div class="filter_all">
					<p class="sort_item" 
						:id="'sort'+sortItem.sortType" 
						v-for="(sortItem,index) in types"
						:key = 'index'
						@click="sortCheck(sortItem.sortType,$event)">
						<span  class="sort_own" :class="sort_type==sortItem.sortType?'is_sort':'no_sort'">{{sortItem.sortCont}}</span>
						<span class="sort_icon" v-show="sort_type==sortItem.sortType">
							<img src="../images/duigou.png" alt="" />
						</span>
					</p>
				</div>
			</div>
			<div class="task_num" @click="choiceNum()">
				<p class="num_title" :class="status_txt?'fc33':'fc99'">
					<span>{{status_txt?'数量：'+status_txt:'请选择领取任务数量'}}</span>
					<span class="right_icon"></span>
				</p>
			</div>
		</div>
		<div class="task_note">
			<span class="note_icon">
				<img src="../images/icon_note.png"/>
			</span>
			<span @click="note_show=true">任务包说明</span>
			
		</div>
		<!--调度说明-->
		<div class="check_modal note_modal fc33" v-show="note_show">
			<div class="note_content">
				<div class="note_title">
					调度说明
				</div>
				<p class="note_item" 
					v-for='(item,index) in noteData'
					:key = 'index'
				>
					{{item}}
				</p>
			</div>
			<div class="note_close" @click="note_show=false">
				<img src="../images/close-btn.png"/>
			</div>
		</div>
		<div class="task_btn">
			<p @click="cancel()">取消</p>
			<p @click="submit()">确认</p>
		</div>
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
	require("../css/modal.css")
	export default {
		name: "newPage",
		components: {
	      cancel
	    },
	    data () {
	      return {
	      	types:[
				{"sortCont":"多人调度含加油模式",'sortType':'1'},
				{"sortCont":"多人调度不含加油模式",'sortType':'2'},
				{"sortCont":"单人加油模式",'sortType':'3'},
			],
			noteData:["1、多人调度含加油模式:适用于一个人开车拉着N个人来调度，调度任务中包含需要加油的车辆；",
			"2、多人调度不含加油模式:适用于一个人开车拉着N个人来调度，调度任务中不含需要加油的车辆；",
			"3、单人加油模式:适用于一个人开车加油后再继续找另一台加油车辆，如此循环；",
			"4、领取任务包时如没有满足需求的任务时，请在待领取任务中查找。"],//调度说明需求
			sort_type:'1',
			status_txt:'',
			note_show:false,
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
	    	sortCheck(sortType,e){
      			this.sort_type = sortType;
      			this.status_txt = ''
      		},
      		choiceNum(){
	            let _this2=this,optCon;
	            this.sort_type==3?optCon = [
	                	{'name':'2'},{'name':'3'},{'name':'4'},{'name':'5'},
	                ]:optCon = [
	                	{'name':'2'},{'name':'3'},{'name':'4'},{'name':'5'},
	                	{'name':'6'},{'name':'7'},{'name':'8'},{'name':'9'},{'name':'10'},
	                ]
	            new Select({
	                name: '选择领取任务数量',
	                id: 'num',
	                options: optCon,
	                callback: function (item) {
	                    _this2.status_txt=item.name;
	                    
	                    
	                }
	            })
	        },
	        cancel(){
	        	this.$router.push({
		          path:'/list',
		          query:{
		            
		          }
		          
		        })
	        },
	        submit(){
	        	if(this.status_txt){
		        	myAjax.post(getOspApiUrl('algorithm/create-pack'), {
					    mobile: userData.state.mobile||'13521758602',
					    lng: userData.state.locationsLng,
						lat: userData.state.locationsLat,
						type:this.sort_type,
					    num:this.status_txt,
					    
					}).then(res => {
					  	if (res.status === 0) {
					  		this.$router.push({
					          path:'/pageDetail',
					          query:{
					            pack_id:res.data.pack_id
					          }
					          
					        })
				      	}else{
				      		this.$_LIKE_toast(res.msg)
				      	}
					}).catch(err => {
					    console.log(err)
					})
		        }else{
		        	this.$_LIKE_toast('请选择任务数量')
		        }
	        	
	        	
	        },
	        pageNote(){
	        	
	        },
	    }
		
	}
</script>

<style scoped>
	.task_type,.task_num{
		background: #FFFFFF;
	}
	.task_num{
		margin-top: .1rem;
	}
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
	.sort_icon{
		display: inline-block;
		width: .234rem;
		height: .15rem;
	}
	.sort_icon img{
		width: 100%;
		height: 100%;
	}
	.sort_item,.type_title,.num_title{
		  display: flex;
		  display: -webkit-flex;
	    justify-content: space-between;
	    -webkit-justify-content: space-between;
	    height: .53rem;
	    border-bottom: 1px solid #EDEDED;
	    align-items: center;
		-webkit-align-items: center;
		padding-left: .21rem;
		padding-right: .12rem;
	}
	.filter_cont{
		padding: 0.12rem 0.1rem 0.1rem 0.1rem;
	}
	.filter_all{
		margin: 0;
	}
	.is_sort{
		color: #44a8ec;
	}
	.no_sort{
		color: #333333;
	}
	.type_title{
		color: #333333;
		padding-left: .11rem;
		font-size: 14px;
		font-weight: bold;
	}
	.num_title{
		padding-left: .11rem;
		background: #fff;
	    height: .53rem;
	    line-height: .53rem;
	    padding: 0 .1rem;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    border-bottom: 1px solid #F6F6F6;
	}
	/*右箭头*/
	.right_icon {
	    display :inline-block;
	    position: relative;
	    width: 20px;
	    height: 15px;
	}
	.right_icon::after {
	    display: inline-block;
	    content: " ";
	    height: 10px;
	    width: 10px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #D1D1D1;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 0px;
	    margin-top: -5px;
	}
	.task_note{
		text-align: center;
		color: #999999;
		margin-top: .17rem;
	}
	.note_icon{
		width: .18rem;
		height: .18rem;
		display: inline-block;
		
	}
	.note_icon img{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	.task_btn{
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
	.task_btn p{
		width: 49%;
		padding: 0.1rem;
		text-align: center;
		border-radius: 2px;
		color: #333;
		border: 1px solid #333333;
	}
	/*调度说明*/
	.check_modal.note_modal{
		background-color: #fff;
	    display: block;
	    text-align: center;
	}
	.note_content{
		width: 100%;
		padding: .19rem;
	}
	.note_title{
		text-align: center;
	    font-size: .2rem;
	    color: #333;
	    margin-bottom: .12rem;
	    font-weight: bold;
	}
	.note_item{
		text-align: left;
	    color: #333;
	    margin-bottom: .12rem;
	}
	.note_close{
		width: .35rem;
		height: .35rem;
	  position: fixed;
		bottom: .8rem;
		left: 47%;
		transform: translateX(0);
	}
	.note_close img{
		width: 100%;
		height: 100%;
	}
</style>

