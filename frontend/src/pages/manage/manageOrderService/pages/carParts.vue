<template>
	<div class="carParts">
		<!--维修信息录入时才显示-->
		<div class="out_parts" @click="show()" v-if="istruck">
			<p>请选择外观类部位</p>
			<span class="arrdown"></span>
		</div>
		<div class="carsingle-content">
			
		</div>
		<div class="carsingle-check" v-if="!istruck">
		    <input class="" name="" type="checkbox" value=""/>
		    外观无伤
		</div>
		<div class="not_out" v-if="istruck">
			<p>请选择非外观类部位</p>
			<span class="not_icon" @click="openCheck()">
				<img src="../images/icon_add.png" alt="" />
			</span>
		</div>
		<div class="check_cont" v-if="checkData.length>0&&istruck">
			<p class="check_item" 
				v-for="(item,index) in checkData"
				:key = 'index'
			>
				<span>{{item}}</span>
				<span class="delete" @click="deleteItem(index)">
					<img  src="../images/icon_delete.png"/>
				</span>
			</p>
		</div>
		<OptMore v-show="modal" 
        	ref='optMore' 
        	:title = '"维修部位"'
        	:resetAll='resetAll' 
        	:filterData='filterData'
        	:source = "'1'"
        	@modalClose = 'modalClose' 
        	@optData = 'optData'>
        </OptMore>
		<div class="carsingle-nextbtn">
		    <button class="bgc8" @click="goNext()">下一步</button>
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
  	import OptMore from '../component/optMore'
  
  	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
  	require("../css/modal.css")
	export default {
		name:'carParts',
		components: {
	      OptMore
	    },
		data(){
			return {
				istruck:this.$route.query.istruck,
				type:this.$route.query.type,
				optTxt:'',
				filterData:[],
			    resetAll:false,//是否重置
			    modal:false,
			    checkData:[],
			    checkId:[],
			    singleArray:[],
			}
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		created(){
			var type = this.type
			switch(type){//0 取车验车单 1维修前拍照 3换车验车单
				case '0':
					this.$route.meta.title='取车验车单'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
					break;
				case '1':
					this.$route.meta.title='维修部位选择'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
					break;
				case '3':
					this.$route.meta.title='还车验车单'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
					break;
				
			}
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			this.istruck?$('body').css('background','#F6F6F6'):$('body').css('background','#FFFFFF');
			this.init();
			this.partsData();
		},
	    methods: {
	    	partsData(){
	    		myAjax.post(getOspApiUrl('/vehicle-fault/fault-type'), {
				    type:'5',
				    mobile:userData.state.mobile,
				}).then(res => {
				  	if (res.status === 0) {
				  		this.filterData = res.data;
				  		this.$refs.optMore.checkedCon = this.filterData;
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
	    	},
	    	openCheck(){
	    		this.modal = true;
	    		this.$refs.optMore.allName.splice(this.$refs.optMore.allName.length-1,1);
    			this.$refs.optMore.allId.splice(this.$refs.optMore.allId.length-1,1);
	    	},
	    	optData(){//组件内筛选值
	    		this.checkData = this.$refs.optMore.checkData
	    		this.checkId = this.$refs.optMore.checkId;
	    		this.unique(this.checkData)
	    		if(this.checkData!=''){
	    			$(".carsingle-nextbtn button").removeClass('bgc8')
	    		}else{
	    			$(".carsingle-nextbtn button").addClass('bgc8')
	    		}
	    	},
	    	modalClose(){
	    		this.modal = false;
	    	},
	    	deleteItem(index){
	    		this.checkData.splice(index,1)
	    		this.$refs.optMore.checkData.splice(index,1)
	    		this.$refs.optMore.checkId.splice(index,1)
	    		if(this.checkData!=''){
	    			$(".carsingle-nextbtn button").removeClass('bgc8')
	    		}else{
	    			$(".carsingle-nextbtn button").addClass('bgc8')
	    		}
	    	},
	    	unique(allarr){//去重
				var res = [];
				var obj = {};
				for(var i=0; i<allarr.length; i++){
				  	if( !obj[allarr[i]] ){
				   		obj[allarr[i]] = 1;
				   		res.push(allarr[i]);
				  	}
				} 
				this.checkData = res;
			},
	    	show(){
	    		$('.carsingle-content').toggleClass('none');
	    		$('.out_parts .arrdown').toggleClass('active')
	    	},
	    	init(){
	    		//默认选中checkbox
	    		if(!this.istruck){
	    			$(".carsingle-nextbtn button").removeClass('bgc8')
					$(".carsingle-check input").attr("checked", true);
					$(".carsingle-check input").attr("disabled", true);
	    		}
				var that=this;
				new CarDamage({
				    parent: document.querySelector('.carsingle-content'),
				    clickable: true,
				    clickCallback: function (area) {
				        let img = $('.carDamage_container .part[data-id="' + area.id + '"]')
				        if (img.hasClass('select')) {
				            img.removeClass('select')
				            var index = that.singleArray.indexOf(area.id);
				            if (index > -1) {
				                that.singleArray.splice(index, 1);
				            }
				        } else {
				            img.addClass('select')
				            that.singleArray.push(area.id)
				        }
				        if($(".select").length > 0&&that.istruck){
			            	$(".carsingle-nextbtn button").removeClass('bgc8')
			            }else if($(".select").length <= 0&&that.istruck){
			            	$(".carsingle-nextbtn button").addClass('bgc8')
			            }
				        if ($(".select").length > 0&&!that.istruck) {
				            $(".carsingle-check input").prop("checked", false);
				            $(".carsingle-nextbtn button").text("外观有伤，上传照片")
				        } else {
				            $(".carsingle-check input").prop("checked", true);
				            $(".carsingle-nextbtn button").text("下一步");
				        }
				    }
				});
	    	},
	    	goNext(){
	    		if($(".select").length > 0||!this.istruck||this.checkData!=''){
		    		var  type = this.type,that=this;
		    		switch(type){//0 取车验车单 1维修前拍照 2维修后拍照 3换车验车单
		    			case '0':
			    			this.$router.push({
						          path:'/partsPicture',
						          query:{
						          	type:'0',
						          	key:that.singleArray.join(','),
						          	item_id:'1',
						        	order_id:this.$route.query.order_id,
						          }
						        })
			     				break;
		    			case '1':
			    			this.$router.push({
						          path:'/servicePhoto',
						          query:{
						          	type:'1',
						          	key:that.singleArray.join(','),
						          	parts:this.checkId.join(','),
						          	item_id:'2',
						        	order_id:this.$route.query.order_id,
						          }
						        })
			     				break;
		    			case '2':
			    			this.$router.push({
						          path:'/servicePhoto',
						          query:{
						          	type:'2',
						          	key:that.singleArray.join(','),
						          	parts:this.checkId.join(','),
						          	item_id:'5',
						        	order_id:this.$route.query.order_id,
						          }
						        })
			     				break;
		    			
		    			case '3':
			    			this.$router.push({
						          path:'/servicePhoto',
						          query:{
						          	type:'3',
						          	key:that.singleArray.join(','),
						          	item_id:'6',
						        	order_id:this.$route.query.order_id,
						          }
						        })
			     				break;
			     		
		    		}
	    		}
	    	}
		}
	}
</script>

<style scoped>
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