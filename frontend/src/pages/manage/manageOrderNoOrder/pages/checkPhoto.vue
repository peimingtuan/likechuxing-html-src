<!--
	作者：xurui_518@163.com
	时间：2018-10-31
	描述：查看维修前照，维修后照
		
-->
<template>
	<div class="checkPhoto">
		<!--维修信息录入时才显示-->
		<div class="out_parts" @click="show(1)" v-if="istruck">
			<p>外观类部位</p>
			<span class="arrdown"></span>
		</div>
		<div class="carsingle-content none">
			
		</div>
		<div class="not_out" v-if="istruck">
			<p>非外观类部位</p>
			<span class="arrdown" @click="show(2)">
				
			</span>
		</div>
		<div class="check_cont none" v-if="istruck&&checkData.length==0">
			无非外观部位
		</div>
		<div class="check_cont none" v-else-if="istruck">
			<p class="check_item" v-for="(item,index) in checkData":key = 'index' >
				<span>{{item}}</span>
			</p>
		</div>
		<div class="service_photo">
			<lookPhoto 
				:allPhoto = 'allPhoto'
				:item_id = 'item_id'
				ref='check'>
				
			</lookPhoto>
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
	import lookPhoto from '../component/lookPhoto' 
	export default{
		name:'checkPhoto',
		 components: {
	      lookPhoto,
	    },
		data(){
			return{
				imageArray:[],
				length:'',
				item_id:this.$route.query.item_id,//判断入口，如果是1是维修前拍照，否则是为维修后拍照
				allPhoto:'',
				istruck:this.$route.query.istruck,
				type:this.$route.query.type,
				optTxt:'',
				filterData:[],
			    resetAll:false,//是否重置
			    modal:false,
			    checkData:[],
			    checkId:[],
			    singleArray:'',
				
			}
		},
		beforeCreate () {
			
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		created(){
			var type = Number(this.item_id)
			
			var url,param;
				url = '/vehicle-abnormal/item-result';
				param = {mobile:userData.state.mobile,
				    order_id:this.$route.query.order_id,
					item_id:this.$route.query.item_id,}
			this.checkInfo(url,param).then(res=>{
				if(res.length!=0){
					this.allPhoto = res;
			  		this.checkData = res.part;
			  		this.singleArray=res.key;
			  		this.inits(this.singleArray);
			  	}
			}).catch(this.handleError)
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			this.istruck?$('body').css('background','#F6F6F6'):$('body').css('background','#FFFFFF');
		},
		methods: {
			checkInfo(url,param){//查看
				return myAjax.post(getOspApiUrl(url), param).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
			},
			show(index){
				if(index==1){
					$('.carsingle-content').toggleClass('none');
	    			$('.out_parts .arrdown').toggleClass('active')
				}else{
					$('.check_cont').toggleClass('none');
	    			$('.not_out .arrdown').toggleClass('active')
					
				}
	    	},
	    	inits(singleArray){
	    		//默认选中checkbox
	    		if(!this.istruck){
	    			$(".carsingle-nextbtn button").removeClass('bgc8')
					$(".carsingle-check input").attr("checked", true);
					$(".carsingle-check input").attr("disabled", true);
	    		}
				var that=this;
				new CarDamage({
				    parent: document.querySelector('.carsingle-content'),
				    clickable: false,
				    showCallback: function () {
				    	let img,leng = singleArray;
				    	for(let i=0;i<=leng.length;i++){
				    		img = $('.carDamage_container .part[data-id="' + that.singleArray[i] + '"]')
				    		img.addClass('select')
				    	}
				        
				        
				    }
				});
	    	},
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
	.subf33{
		background: #333333;
	}
	.subfc8{
		background: #c8c8c8;
	}
	.truckingInfo{
		background: #F6F6F6;
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
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
	}
	.service_photo{
		margin-bottom: .64rem;
	}
	.none{
		display: none;
	}
	.carsingle-content {
	    margin-top: .1rem;
	    width:100%;
	    height:4.45rem;
	    background: #FFFFFF;
	}
	.carDamage_container {
	    height: 4.21rem;
	}
	.carsingle-check {
	    margin-top: .12rem;
	    text-align: center;
	}
	
	.carsingle-check input {
	    position: relative;
	    top: .03rem;
	    width: .19rem;
	    height: .19rem;
	}
	
	.carsingle-nextbtn {
	    position:fixed;
	    bottom:0;
	    width:100%;
	    padding:5% 2.5%;
	    background: #FFFFFF;
	    font-size: 14px;
	}
	
	.carsingle-nextbtn button {
	    width: 100%;
	    line-height: .45rem;
	    text-align: center;
	    color: #fff;
	    background: #333333;
	    outline: none;
	    border: none;
	    border-radius: 2px;
	    box-sizing: border-box;
	    font-size: 14px;
	}
	.arrdown {
	    display :inline-block;
	    position: relative;
	    width: 24px;
	    height: 14px;
	}
	.arrdown::after {
	    display: inline-block;
	    content: " ";
	    height: 10px;
	    width: 10px;
	    border-width: 0 2px 2px 0;
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
	.arrdown.active::after {
	    border-width:2px 0px 0px 2px;
		margin-top: 0;	    
	    
	}
	.out_parts,.not_out{
		width: 100%;
		background: #FFFFFF;
		display: flex;
	    justify-content: space-between;
	    padding: .2rem .1rem;
	    border-bottom: 1px solid #f6f6f6;
	    display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    font-size: 15px;
	}
	.not_out{
		margin-top: .1rem;
	}
	.bgc8{
		background-color: #C8C8C8!important;
	}
	.not_icon{
		display: inline-block;
		width: .2rem;
		height: .2rem;
	}
	.not_icon img,.delete img{
		width: 100%;
		height: 100%;
	}
	.check_cont{
		padding: .1rem .21rem .1rem .24rem;
		background: #FFFFFF;
		/*margin-bottom: .86rem;*/
	}
	.delete{
		display: inline-block;
		width: .24rem;
		height: .24rem;
	}
	.check_item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		-webkit-align-items: center;
		padding: .1rem;
		border-radius: 6px;
		border: 1px solid #CDCDCD;
	}
	.check_item:not(last-child){
		margin-bottom: .08rem;
	}
	.carParts{
		padding-bottom: .86rem;
	}
</style>