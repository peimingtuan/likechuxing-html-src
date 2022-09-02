<!--
	1、入口判断，是否已经拍照过，如果已经拍照img则展示接口请求的地址即可
	2、
-->
<template>
	<div class="photo">
		<div class="getpicture-content">
		    <div class="allpho" 
		    	:class="[index%2==1?'right':'left','allpho'+index]" 
		    	v-for="(photo,index) in allPhoto"
		    	:key = 'index'
		    >
		        <p v-show="photo.top">{{photo.title}}</p>
		        <div>
		            <input type="hidden" value="" class="image" :class="'image'+index"/>
		            <span class="uploadIcon" @click="getPicture(photo.num,$event,index)">&#xe616;</span>
		            <span class="num" v-show="photo.num">{{num}}/3</span>
		            <span class="end-photo none">已上传</span>
		            <span class="check-photo none" @click="checkPhone(index)">查看</span>
		            <span class="swat-photo none" @click='deletePhone(photo.num,index,$event)'>重拍</span>
		        </div>
		        
		       
		        <p v-show="!photo.top">{{photo.title}}</p>
		    </div>
		    
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	export default {
		name:'photo',
		props: {
	    	allPhoto:{// 预制选项
		        default:[],
		        type:Array
			},
	    	type:''
	      	
	    },
		data(){
			return {
				imageArray:[],
				length:'',
				num:1,
				isFirst:'',//第一张照片是否拍摄
				plate:'',
				repair_list:'',
				invoice:'',
				repair_parts:[],
				partsNum:[],
			}
		},
		mounted () {
			
		},
	    methods: {
	    	init(){
				
	    	},
	    	getPicture(photo,e,index){
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
			    //钉钉上传图片，即可以拍照也可以选择图片
			    dd.uploadImage({
			        compression:true,
			          multiple: true,
			          max: 3,
			          quality: 50,
			          resize: 50
			    }).then(result=> {
			    	if(that.type==1&&index>=1){
			    		that.partsNum.push(result[0]);
			    	}
			    	if(that.type=='2'&&index==0){
			    		that.plate = result[0];
			    	}else if(that.type=='2'&&index==1){
			    		that.repair_list = result[0];
			    	}else if(that.type=='2'&&index==2){
			    		that.invoice = result[0];
			    	}else if(that.type=='2'&&index>=3){
			    		that.repair_parts.push(result[0]);
			    	}
			    	that.image(result,btn);
			    	that.imageArray.splice(index,0,result[0]);
			        if(photo==1){
			        	that.num++;
			        	if(that.type==1&&that.partsNum.length<2){//判断是否符合继续添加条件
							that.allPhoto.push({'title':'','top':true,'num':1})
						}else if(that.type==2&&that.num<=3){
							that.allPhoto.push({'title':'','top':true,'num':1})
						}
			        }
			        that.$emit('photoArray',true);
			    }).catch(err => {
			      console.log(err)
			    })
			    
			},
			image(file,btn) {
			    btn.siblings(".image").val(file[0]);
			    btn.hide();
			    btn.siblings('.num').addClass("none");
			    btn.siblings('.end-photo').removeClass("none");
			    btn.siblings('.check-photo').removeClass("none");
			    btn.siblings('.swat-photo').removeClass("none");
			    this.length++;
			    this.$emit('photoArray',true);
			},
			checkPhone(index){
				let btn = $('.image'+index);
				var that = this;
			    //图片浏览器
			    dd.previewImage({
			        urls: that.imageArray,//图片地址列表,数组
			        current: btn.val()//当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
			},
			deletePhone(num,item,e){
				this.length--;
				let index = this.imageArray.indexOf($(e.target).siblings(".image").val());
				if(num==1){
					this.num!=1?this.num--:this.num;
					var denum = item-3;
					$(e.target).parent().parent('.allpho').remove();
					if(this.num==3)this.allPhoto.push({'title':'','top':true,'num':1})
					this.repair_parts.splice(index,1);
					this.partsNum.splice(index,1);
					if(this.num==1){
						this.repair_parts=[];
						this.partsNum=[];
					}
				}else{
					$(e.target).addClass("none");
				    $(e.target).siblings('.num').removeClass("none");
				    $(e.target).siblings('.end-photo').addClass("none");
				    $(e.target).siblings('.check-photo').addClass("none");
				    $(e.target).siblings(".uploadIcon").fadeIn(1500);
				}
				if(this.type=='2'&&item==0){
		    		this.plate = '';
		    	}else if(this.type=='2'&&item==1){
		    		this.repair_list = '';
		    	}else if(this.type=='2'&&item==2){
		    		this.invoice = '';
		    	}
			    this.imageArray.splice(index,1);
			    $('.image'+index).val("");
			    this.$emit('photoArray',true);
			}
        }
	}
</script>

<style scoped>
	.left{float: none;}
	.right{float: none;}
	.getpicture-content {
		display: flex;
	    flex-wrap: wrap;
	    justify-content: space-between;
	    display: -webkit-flex;
	    -webkit-flex-wrap: wrap;
	    -webkit-justify-content: space-between;
	    padding: .23rem .41rem;
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
	.uploadIcon{
		font-family: 'iconfont';
	    font-size: .32rem;
	}
	.uploadIcon{
	    position: absolute;
	    left: .45rem;
	    top: .45rem;
	}
	.num{
		position: absolute;
		font-size: 15px;
		top: .52rem;
		left: .3rem;
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
	.allpho{
		text-align: center;
	}
</style>