<!--
	作者：xurui_518@163.com
	时间：2018-11-29
	描述：选择处理方式
		
-->
<template>
	<div class="moveReason">
		<div class="truck_cont">
			<div class="truck_type">
				<p class="reason_title">
					{{enter=='end'||enter=='check'?'挪车原因':'请选择挪车原因'}}
					<span class="reason_note" @click="note_show=true">
						<img src="../images/icon_reason.png" alt="" />
					</span>
				</p>
	    		<div>
	    			<p class="sort_item" 
						:id="'sort'+sortItem.sortType" 
						v-for="(sortItem,index) in sorts"
						:key = 'index'
						@click="sortCheck(sortItem.sortType,$event)">
						<span class="sort_icon" v-if="sort_type==sortItem.sortType">
							<img src="../images/icon_duigou.png" alt="" />
						</span>
						<i class="icon_no" v-else></i>
						<span  class="sort_own" :class="sort_type==sortItem.sortType?'is_sort':'no_sort'">{{sortItem.sortCont}}</span>
						
					</p>
	    			
	    		</div>
			</div>
			<div class="truck_photo">
				{{enter=='end'||enter=='check'?'挪车前照片：':'挪车前拍照（限三张）：'}}
				<div  v-if="enter=='end'||enter=='check'" >
					<img v-for="(item,index) in checkImg" v-if="checkImg" @click="checkPhone(index)" class="truck_img" :src="item" alt=""/>
				</div>
				<UploadPhoto
					v-if="enter!='end'&&enter!='check'"
                        title=""
                        max="3"
                        ref="photo"
                        :show_uploaded="false"
                        @photoArray = 'photoArray'
                />
				<div class="truck_note">
					现场挪车时‘挪车前拍照’必拍，远程开门和现场临时开门时选拍。
				</div>
			</div>
		</div>
		<!--挪车原因说明-->
		<div class="check_modal note_modal fc33" v-show="note_show">
			<div class="note_content">
				<div class="note_title">
					挪车原因说明
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
		<div class="creat_btn" v-show="enter!='end'">
			<p :class="move_type==1&&sort_type&&length>0||move_type!=1&&sort_type?'crea_submit':'not_crea'" @click="subMit()">提交</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	import photo from '../component/photo'  
  	import {goAjax} from '../js/ajaxCommon.js'
  import UploadPhoto from '../component/upLoadPhoto'
	
	
	export default{
		name:'moveReason',
		 components: {
	      UploadPhoto
	    },
		data(){
			return{
				vin:this.$route.query.vin,
				imageArray:[],
				length:'',
				allPhoto:[{'title':'','top':false,'num':1}],
				textarea1:'',
				feeType:'1',
				truck_fee:'',
				enter:this.$route.query.type,
				finishData:'',
				topData:'',
				topShow:false,
				sort_show:false,
		        sorts:[
					{"sortCont":"网点内恶意停放",'sortType':'1'},
					{"sortCont":"网点内非恶意停放",'sortType':'2'},
					{"sortCont":"停放在网点外",'sortType':'3'},
				],
				sort_type:'',
				note_show:false,
				noteData:["1、网点内恶意停放：影响其他用户的正常出行，存在恶意行为，如:停放在入口、出口、遮挡消防通道，阻碍其他车辆出行等操作。",
				"2、网点内非恶意停放：因停车技术不行导致的停车占了其他车位，不存在恶意行为。",
				"3、停放在网点外：未停在网点内。"],
				move_type:this.$route.query.move_type,
				checkImg:[],
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
			checkEnter(){
				return myAjax.post(getOspApiUrl('/vehicle-move/item-result'), {
					mobile:userData.state.mobile||'13521758602',
				    order_id:this.$route.query.order_id,
				    item_id:'2'
				}).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
			},
			photoArray(){
				this.imageArray = this.$refs.photo.urls;
				this.length = this.$refs.photo.urls.length;
			},
			subMit(){
				var imageArray = this.imageArray.toString();
				var param = {
						mobile:userData.state.mobile||'13521758602',
					    order_id:this.$route.query.order_id,
					    item_id:'2',
					    params:{
					    	move_reason:this.sort_type,//处理方式：1打火启动  2行驶1公里
					    	photo_string:this.imageArray.join(','),
					    }
				}
				if (this.move_type==1&&this.sort_type||this.move_type!=1&&this.sort_type) {
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						window.location.href = 'index.html#/orderDetail?order_id='+this.$route.query.order_id
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}else if(this.length<1){
					this.$_LIKE_toast('请上传挪车照片')
				}
			},
			
			checkPhone(index){
				var that = this;
				var imgs = that.finishData.photo_string.split(',')
			    //图片浏览器
			    dd.previewImage({
			        urls: imgs,//图片地址列表,数组
			        current:imgs[index] //当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
			},
			goDetail(){
				if(this.topData.id){
					this.$router.push({
			          	path:'/hisDetail',
			          	query:{
			            	order_id:this.topData.id,
			            	list:this.$route.query.list
			          	}
			        })
				}
			},
			sortCheck(sortType,e){
				if(this.enter!='end'&&this.enter!='check'){
				this.sort_type=this.sort_type==sortType?'':sortType;}
	      	},
		},
		created(){
		   	if(this.enter=='end'||this.enter=='check'){
				this.checkEnter().then(res=>{
		  			if(res){
			  			this.enter = 'end'
			  			this.finishData = res;
			  			this.sort_type = res.move_reason;
			  			this.checkImg = res.photo_string.split(',')
			  			
			  		}
				})
			}
		}
	}
</script>

<style scoped>
	*{
   	 box-sizing: border-box;
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
	.fc4a90{
		color: #4a90e2;
	}
	.truck_img{
		width: .87rem;
		height: .87rem;
		margin-top: .1rem;
		margin-bottom: .1rem;
		margin-right: .1rem;
	}
	.moveReason{
		background: #F6F6F6;
	}
	.moveReason /deep/ .getpicture-content{
		padding: 0;
		justify-content: flex-start;
	}
	.moveReason /deep/ .getpicture-content>div{
		margin-bottom: 0;
	}
	.moveReason /deep/ .getpicture-content>div>div{
		width: .88rem;
		height: .88rem;
		margin-left: .1rem;
		
	}
	.moveReason /deep/ .photo{
		margin-top: .1rem;
	}
	.moveReason /deep/ .uploadIcon{
		left: .28rem;
    	top: .18rem;
	}
	.moveReason /deep/ .end-photo {
	    left: .17rem;
	    top: .13rem;
	    font-size: .17rem;
	}
	.moveReason /deep/ .check-photo {
	    top: .5rem;
	    left: .08rem;
	}
	.moveReason /deep/ .swat-photo{
		top: .5rem;
		left:.54rem;
	}
  	.truck_cont{
  		margin-bottom: .1rem;
  	}
  	.fee_radio{
  		display: inline-flex;
	    justify-content: center;
	    align-items: center;
  		display: -webkit-inline-flex;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	    margin-right: .1rem;
  	}
  	.truck_type{
  		padding: .19rem .1rem;
  		margin-bottom: .1rem;
  		background: #FFFFFF;
  	}
  	.truck_photo{
  		padding: .17rem .17rem .2rem .1rem;
  		background: #FFFFFF;
  		
  	}
  	.uploadIcon {
	    font-family: 'iconfont';
	    font-size: .32rem;
	}
	
	.end-photo{
	    display:inline-block;
	    position:absolute;
	    left: .34rem;
	    top: .3rem;
	    font-size: .19rem;
	    color: #333333;
	}
	
	.check-photo{
	    display:inline-block;
	    position:absolute;
	    left: .23rem;
	    top: .77rem;
	    color:#43aff7;
	}
	
	.swat-photo{
	    display:inline-block;
	    position:absolute;
	    left: .73rem;
	    top: .77rem;
	    color:#43aff7;
	}
	
	.getpicture-nextbtn {
	    position: fixed;
	    bottom: 0;
	    width: 100%;
	    padding: 5% 2.5%;
	}
	
	.getpicture-nextbtn button {
	    width: 95%;
	    line-height: .45rem;
	    font-size: 14px;
	    text-align: center;
	    color: #fff;
	    background: #d1d1d1;
	    outline: none;
	    border: none;
	    border-radius: 2px;
	    box-sizing: border-box;
	}
	.getpicture-nextbutton{
	    background:#333!important;
	}
	.truck_note{
		padding: 0.12rem .12rem 0rem 0rem;
		/*margin-bottom: .63rem;*/
		color: #999999;
	}
	#textarea{
		width: 100%;
		height: .83rem;
		padding: .12rem .08rem .08rem .08rem;
		background: #FFFFFF;
		font-size: .14rem;
		color: #333;
	}
	.note_txt{
		color: #666666;
		margin-bottom: .13rem;
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
	.crea_submit,.not_crea{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
		
	}
	.crea_submit{
		background: #333333;
	}
	.not_crea{
		background: #D1D1D1;
	}
	.last_note{
		padding: .1rem;
		background: #FFFFFF;
		margin-bottom: .1rem;
	}
	.last_txt{
		padding: .12rem .1rem;
		background: #FDFDFD;
		border: 1px dashed #E6E6E6;
		height: .7rem;
	}
	/*右箭头*/
	.arrdown {
	    display :inline-block;
	    position: relative;
	    width: 15px;
	    height: 15px;
	}
	.arrdown::after {
	    display: inline-block;
	    content: " ";
	    height: 6px;
	    width: 6px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #4A90E2;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 10px;
	    margin-top: -2px;
	}
	.last_txt{
		position: relative;
	}
	.last_right{
		position: absolute;
		right: .1rem;
		color: #4A90E2;
		bottom: .11rem;
	}
	.is_sort{
		color: #44a8ec;
	}
	.no_sort{
		color: #333333;
	}
	.sort_icon{
		display: inline-flex;
		width: .15rem;
		height: .15rem;
		margin-right: .07rem;
	}
	.sort_icon img{
		width: 100%;
		height: 100%;
	}
	.icon_no{
		display: inline-block;
		width: .15rem;
		height: .15rem;
		background: #FFFFFF;
		border: 1px solid #D8D8D8;
		border-radius: 50%;
		margin-right: .07rem;
	}
	.sort_item{
		display: flex;
		align-items: center;
		display: -webkit-flex;
		-webkit-align-items: center;
		margin-top: .18rem;
	}
	.reason_title{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		-webkit-align-items: center;
	}
	.reason_note{
		display: inline-flex;
		width: .15rem;
		height: .15rem;
		margin-left: .07rem;
	}
	.reason_note img{
		width: 100%;
		height: 100%;
	}
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
	    color: #000;
	    margin-bottom: .35rem;
	    border-bottom: 1px solid #F1F1F1;
	    padding-bottom: .15rem;
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