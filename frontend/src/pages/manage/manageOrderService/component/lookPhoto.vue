<!--
	1、入口判断，是否已经拍照过，如果已经拍照img则展示接口请求的地址即可
	2、
-->
<template>
	<div class="lookPhoto">
		<div class="getpicture-content">
		    <div class="pic_item left" v-if="item_id==5" @click="itemFive(allPhoto.plate)">
		    	<span class="pic_txt">
		    		拍摄车牌
		    	</span>
		    	<img :src='allPhoto.plate' alt="" />
			</div>
		    <div class="pic_item right" v-if="item_id==5"  @click="itemFive(allPhoto.repair_list)">
		    	<span class="pic_txt" >
		    		维修清单
		    	</span>
		    	<img :src='allPhoto.repair_list' alt="" />
			</div>
		    <div class="pic_item left"  v-show="allPhoto.invoice" v-if="item_id==5" @click="itemFive(allPhoto.invoice)">
		    	<span class="pic_txt" >
		    		维修发票
		    	</span>
		    	<img :src='allPhoto.invoice' alt="" />
			</div>
		    <div class="pic_item" 
		    	:class="index%2==1?'left':'right'" 
		    	v-if="item_id==5" 
		    	@click="itemFive(item)"  
		    	v-for="(item,index) in allPhoto.repair_parts"
		    	:key = 'index'
		    >
		    	<span class="pic_txt" >
		    		维修部位
		    	</span>
		    	<img :src='item' alt="" />
			</div>
		    <div class="pic_item" 
		    	:class="index%2==1?'right':'left'" 
		    	v-for="(item,index) in allPhoto.photo_string"
		    	:key = 'index'
		    	@click="checkPhone(index)" 
		    	v-if="item_id!=5"
		    >
		    	<span class="pic_txt">
		    		{{
		    			index==0&&item_id=='1'?"车辆左前照片":index==1&&item_id=='1'?"车辆右前照片":
		    			index==2&&item_id=='1'?"车辆左后照片":index==3&&item_id=='1'?"车辆右后照片":
		    			index==0&&item_id=='2'?"*油表":item_id=='2'?"维修部位":
		    			index==0&&item_id=='5'?"拍摄车牌":index==1&&item_id=='5'?"维修清单":
		    			index==2&&item_id=='5'?"维修发票":item_id=='5'?"维修部位":
		    			index==0&&item_id=='6'?"车辆左前照片":index==1&&item_id=='6'?"车辆右前照片":
		    			index==2&&item_id=='6'?"车辆左后照片":index==3&&item_id=='6'?"车辆右后照片":
		    			index==4&&item_id=='6'?"驾驶舱前排照片":index==5&&item_id=='6'?"驾驶舱后排照片":''
		    			
		    		}}
		    	</span>
		    	<img :src="item" alt="" />
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
		name:'checkPhoto',
		props: {
	    	allPhoto:'',
	    	item_id:''
	      	
	    },
		data(){
			return {
				imageArray:[],
				length:'',
				num:1,
				isFirst:'',//第一张照片是否拍摄
			}
		},
		mounted () {
		},
	    methods: {
	    	init(){
				
	    	},
	    	
			checkPhone(index){
				var that = this;
			    //图片浏览器
			    dd.previewImage({
			        urls: that.allPhoto.photo_string,//图片地址列表,数组
			        current:that.allPhoto.photo_string[index] //当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
			},
			itemFive(img_src){
				var that = this;
				var arr = [];
				arr.push(that.allPhoto.plate);
				arr.push(that.allPhoto.repair_list);
				arr.push(that.allPhoto.invoice);
				for(var i = 0;i<=that.allPhoto.repair_parts.length;i++){
					arr.push(that.allPhoto.repair_parts[i])
				}
			    //图片浏览器
			    dd.previewImage({
			        urls: arr,//图片地址列表,数组
			        current:img_src //当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
			},
			
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
	.pic_item{
		text-align: center;
	    display: flex;
	    flex-direction: column;
	    display: -webkit-flex;
	    -webkit-flex-direction: column;
	    
	}
	
	.pic_item img{
	    width: 1.22rem;
	    height: 1.22rem;
	    margin-top: .12rem;
	}
	
</style>