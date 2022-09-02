<template>
	<div class="carParts">
		<!--维修信息录入时才显示-->
		<div class="carsingle-content">
			
		</div>
		<div class="carsingle-check">
		    <input class="" name="" type="checkbox" value=""/>
		    外观无伤
		</div>
		<div class="carsingle-nextbtn">
		    <button @click="goNext()">下一步</button>
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
  
  	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
  	require("../css/modal.css")
	export default {
		name:'carParts',
		components: {
	    },
		data(){
			return {
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
			switch(type){//0 取车验车单 1换车验车单
				case '0':
					this.$route.meta.title='取车验车单'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
					break;
				case '1':
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
			$('body').css('background','#FFFFFF');
			this.init();
		},
	    methods: {
	    	show(){
	    		$('.carsingle-content').toggleClass('none');
	    		$('.out_parts .arrdown').toggleClass('active')
	    	},
	    	init(){
	    		//默认选中checkbox
					$(".carsingle-check input").attr("checked", true);
					$(".carsingle-check input").attr("disabled", true);
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
				        if($(".select").length > 0){
			            	$(".carsingle-check input").prop("checked", false);
				            $(".carsingle-nextbtn button").text("外观有伤，上传照片")
			            }else if($(".select").length <= 0){
				            $(".carsingle-check input").prop("checked", true);
				            $(".carsingle-nextbtn button").text("下一步");
				        }
				    }
				});
	    	},
	    	goNext(){
	    		var  type = this.type,that=this;
	    		if(type==0){
	    			this.$router.push({
				        path:'/servicePhoto',
					        query:{
					          	type:'0',
					          	key:that.singleArray.join(','),
					          	item_id:'2',
					        	order_id:this.$route.query.order_id,
					        }
				    })
    			}else{
	    			this.$router.push({
				        path:'/servicePhoto',
					        query:{
					          	type:'1',
					          	key:that.singleArray.join(','),
					          	item_id:'4',
					        	order_id:this.$route.query.order_id,
					        }
				    })
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