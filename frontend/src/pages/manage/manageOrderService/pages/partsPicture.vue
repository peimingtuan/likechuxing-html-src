<!--
	1、入口判断，是否已经拍照过，如果已经拍照img则展示接口请求的地址即可
-->
<template>
	<div class="partsPicture">
		<div class="getpicture-content">
		    <div class="left">
		        <p>车辆左前照片</p>
		
		        <div>
		            <input type="hidden" value="" class="image"/>
		            <span class="uploadIcon" @click="getPicture($event)">&#xe616;</span>
		            <span class="end-photo none">已上传</span>
		            <span class="check-photo none" @click="checkPhone($event)">查看</span>
		            <span class="swat-photo none" @click='deletePhone($event)'>重拍</span>
		        </div>
		    </div>
		    <div class="right">
		        <p>车辆右前照片</p>
		
		        <div>
		            <input type="hidden" value="" class="image"/>
		            <span class="uploadIcon" @click="getPicture($event)">&#xe616;</span>
		            <span class="end-photo none">已上传</span>
		            <span class="check-photo none" @click="checkPhone($event)">查看</span>
		            <span class="swat-photo none" @click='deletePhone($event)'>重拍</span>
		        </div>
		    </div>
		    <div class="left">
		        <p>车辆左后照片</p>
		
		        <div>
		            <input type="hidden" value="" class="image"/>
		            <span class="uploadIcon" @click="getPicture($event)">&#xe616;</span>
		            <span class="end-photo none">已上传</span>
		            <span class="check-photo none" @click="checkPhone($event)">查看</span>
		            <span class="swat-photo none" @click='deletePhone($event)'>重拍</span>
		        </div>
		    </div>
		    <div class="right">
		        <p>车辆右后照片</p>
		
		        <div>
		            <input type="hidden" value="" class="image"/>
		            <span class="uploadIcon" @click="getPicture($event)">&#xe616;</span>
		            <span class="end-photo none">已上传</span>
		            <span class="check-photo none" @click="checkPhone($event)">查看</span>
		            <span class="swat-photo none" @click='deletePhone($event)'>重拍</span>
		        </div>
		    </div>
		</div>
		<div class="getpicture-nextbtn">
		    <button @click="submite()">提交</button>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
//	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	
	import myAjax from '../js/withJq.js'
	import {goAjax} from '../js/ajaxCommon.js'
	
  	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
//	const goAjax = require('../js/ajaxCommon.js')
	export default {
		name:'partsPicture',
		data(){
			return {
				imageArray:[],
				length:'',
			}
		},
		mounted () {
			
		},
	    methods: {
	    	init(){
				
	    	},
	    	getPicture(e){
				let btn = $(e.target);
				var number;
				var userAgent = navigator.userAgent,
			        number = 40,
			        isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1, //android终端
			        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			    if (isiOS) {
			        number = 80;
			    }
			    var that = this;
			    //钉钉上传图片，仅支持手机拍照
			    dd.uploadImageFromCamera({
			        compression: true,//(是否压缩，默认为true)
			        quality: number, // 图片压缩质量,
			        resize: number, // 图片缩放率
			        stickers: {   // 水印信息
			            time: "",
			            dateWeather: "",
			            username: "",
			            address: ""
			        }
			    }).then(result=> {
			        that.image(result,btn);
			        that.imageArray.push(result[0]);
			    }).catch(err => {
			      console.log(err)
			    })
			    
			},
			image(file,btn) {
			    btn.siblings(".image").val(file[0]);
			    btn.hide();
			    btn.siblings('.end-photo').removeClass("none");
			    btn.siblings('.check-photo').removeClass("none");
			    btn.siblings('.swat-photo').removeClass("none");
			    this.length++;
			    if (this.length > 3) {
			        $(".getpicture-nextbtn button").addClass("getpicture-nextbutton");
			    } else {
			        $(".getpicture-nextbtn button").removeClass("getpicture-nextbutton");
			    }
			},
			checkPhone(e){
				let btn = $(e.target);
				var that = this;
			    //图片浏览器
			    dd.previewImage({
			        urls: that.imageArray,//图片地址列表,数组
			        current: btn.siblings(".image").val()//当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
			},
			deletePhone(e){
				this.length--;
			    if (this.length > 3) {
			        $(".getpicture-nextbtn button").addClass("getpicture-nextbutton");
			    } else {
			        $(".getpicture-nextbtn button").removeClass("getpicture-nextbutton");
			    }
			    $(e.target).addClass("none");
			    $(e.target).siblings('.end-photo').addClass("none");
			    $(e.target).siblings('.check-photo').addClass("none");
			    $(e.target).siblings(".uploadIcon").fadeIn(1500);
			    let index = this.imageArray.indexOf($(e.target).siblings(".image").val());
			    this.imageArray.splice(index, 1);
			    $(e.target).siblings(".image").val("");
			},
			submite(){
				var imageArray = this.imageArray.toString()
				var params = {
					    	key:this.$route.query.key||'',
					    	photo_string:imageArray
					    };
				
				var param = {
						mobile:userData.state.mobile,
					    order_id:this.$route.query.order_id,
					    item_id:this.$route.query.item_id,
					    params:params
				};
				if (this.length > 3) {
					goAjax(param);
					if(goAjax(param).status=== 0 ){
						window.location.href = 'index.html#/orderDetail?order_id='+this.$route.query.order_id
					}else{
						this.$_LIKE_toast(goAjax(param).msg)
					}
				}
				
			}
        }
	}
</script>

<style scoped>
	.getpicture-content {
	    padding: .23rem .41rem;
	}
	
	.getpicture-content .left {
	    margin-right: .23rem;
	}
	
	.getpicture-content > div {
	    margin-bottom: .23rem;
	}
	
	.getpicture-content > div > p {
	    text-align: center;
	    line-height: .47rem;
	}
	
	.getpicture-content > div > div {
	    position: relative;
	    width: 1.22rem;
	    height: 1.22rem;
	    background: #f4f4f4;
	}
	
	.uploadIcon {
	    font-family: 'iconfont';
	    font-size: .32rem;
	    position: absolute;
	    left: .45rem;
	    top: .45rem;
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
	
</style>