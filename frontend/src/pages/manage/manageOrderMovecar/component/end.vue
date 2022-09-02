<!--
	工单结束页面组件
	1、地图经纬度
	2、本页所有信息
	说明icon_color:根据实际情况修改 取：绿色，修：蓝色，还：红色		
	allInfo:{'plate_no':'粤AC6666','car_info':'北汽','total_km':'23',
			'addrs':[{'icon_color':'1','icon_img':'取','branch_name':'蓝牙测试网点','time':'2018-10-24  10:10'},
				{'icon_color':'2','icon_img':'修','branch_name':'蓝牙测试网点','time':'2018-10-24  10:12'},
				{'icon_color':'3','icon_img':'还','branch_name':'蓝牙测试网点','time':'2018-10-24  10:17'}],
			'remain':'126'
		}
-->
<template>
	<div class="end">
		<div id="container"  v-if='allInfo.end_coord_list.length>0'>
		</div>
		<div class="trail" v-else>
            <img src="../images/trail.png"/><br/>
            <span>轨迹加载失败</span>
        </div>
        <div class="icon_center">
        </div>
        <div class="end_content">
        	<div class="plate_no">
				<p>
					<span class="plate_fz fc33">{{allInfo.plate_no}}</span>
					<span class="fc66">{{allInfo.car_info}}</span>
				</p>
				<span class="plate_fz fc33">
					{{allInfo.total_km}}km
				</span>
			</div>
			<div class="addrs">
				<div class="addrs_item"  
					v-for="(item,index) in allInfo.addrs" 
					:key = 'index'
					:class="allInfo.end_type!=0&&item.icon_color==2?'none':''"
				>
					<span :class="item.icon_color==1?'icon_green':item.icon_color==2?'icon_blue':'icon_red'">{{item.icon_img}}</span>
					<div>
						<p class="fc66">{{item.branch_name}}</p>
						<p class="time fc99">{{item.time}}</p>
					</div>
				</div>
			</div>
			<div class="btns">
				<span class="btn_item" 
					:class="'btn_item'+index"
					v-for="(item,index) in buttons" 
					:key = 'index'
					@click="goBtn(index)"
				>{{item}}</span>
			</div>
			<p class="remain">
				<span>续航里程{{allInfo.remain}}km</span>
				<span @click="goDetail()">
					工单详情
					<span class="right_icon"></span>
				</span>
			</p>
        </div>
        <div class="footer_btn">
        	<p @click="checkMap()">查询网点</p>
        	<p @click="goIndex()">返回首页</p>
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
		name:'end',
		props: {

	    	allInfo:{// 所有结束页面信息，车牌，地址等
//		        default:{},
//		        type:Object
			},
	    	buttons:{// 下面三个按钮 同步油量，开门，锁门
		        default:[],
		        type:Array
			},
	    	
	      	
	    },
		data(){
			return {
				btnNum:''
			}
		},
		mounted () {
			$('.end').height(window.innerHeight)
		},
		updated(){
			this.inits();
		},
	    methods: {
	    	inits(){
			        let arrytrail = [],
                            lng,
                            lat;
                     var arrytrailmany = [],//存放轨迹数组
			                starticon = [],//起点
			                chargeicon=[],//维修站
			                endicon = [];//终点
                    var end = this.allInfo.end_coord_list;
                   if(end){
                    	for (var i = 0; i < end.length; i++) {
	                        lng = end[i].lng;
	                        lat = end[i].lat;
	                        arrytrail = [lng, lat];
	                        arrytrailmany.push(arrytrail);
	                    }
                    	starticon = arrytrailmany[0];//起始位置
	                    endicon = arrytrailmany[arrytrailmany.length - 1];//结束位置
                    
	                    //创建地图
	                    var map = new AMap.Map('container', {
	                        zoom: 12
	                    });
	                    //添加点标记，并使用自己的icon
	                    if(starticon.length!=0){
	                        let startmark = new AMap.Marker({
	                            map: map,
	                            position: starticon,
	                            offset: new AMap.Pixel(-12.5, -30),
	                            icon: new AMap.Icon({
	                                size: new AMap.Size(25, 30),  //图标大小
	                                image: require('../images/get_icon.png'),
	                                imageSize: new AMap.Size(23, 30)
	                            })
	                        });
	                    }
	                    if(endicon.length!=0){
	                        let endtmark = new AMap.Marker({
	                            map: map,
	                            position: endicon,
	                            offset: new AMap.Pixel(-12.5, -30),
	                            icon: new AMap.Icon({
	                                size: new AMap.Size(25, 30),  //图标大小
	                                image: require('../images/icon_fix.png'),
	                                imageSize: new AMap.Size(25, 30)
	                            })
	                        });
	                    }
	                    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
	
	                        if (!PathSimplifier.supportCanvas) {
	                            alert('当前环境不支持 Canvas！');
	                            return;
	                        }
	
	                        var pathSimplifierIns = new PathSimplifier({
	                            zIndex: 100,
	                            map: map, //所属的地图实例
	
	                            getPath: function (pathData, pathIndex) {
	
	                                return pathData.path;
	                            },
	                            getHoverTitle: function (pathData, pathIndex, pointIndex) {
	
	                                return null;
	                            },
	                            renderOptions: {
	
	                                renderAllPointsIfNumberBelow: -1,//绘制路线节点，如不需要可设置为-1
	                                //轨迹线的样式
	                                pathLineStyle: {
	                                    strokeStyle: 'green',
	                                    lineWidth: 5,
	                                    dirArrowStyle: true
	                                }
	                            }
	
	                        });
	
	                        window.pathSimplifierIns = pathSimplifierIns;
	
	                        //设置数据
	                        pathSimplifierIns.setData([{
	                            path: arrytrailmany
	                        }]);
	
	                        //选中路线0
	                        //pathSimplifierIns.setSelectedPathIndex(0);
	                    });
	                }
	    	},
	    	checkMap(){
	    		this.$emit('checkMap');
	    	},
	    	goDetail(){
	    		this.$emit('goDetail');
	    	},
	    	goBtn(index){
	    		this.btnNum = index;
	    		this.$emit('goBtn');
	    	},
	    	goIndex(){
	    		window.location.href='../manageOrderMain/index.html#/list'
	    	}
        }
	}
</script>

<style scoped>
	.fc33{
    	color: #333333;
    }
   	.fc99{
   		color: #999999;
   	}
   	.fc66{
   		color: #666666;
   	}
	#container,.trail {
		height: 35%;
	}
	.none{
		display: none;
	}
   #panel {
   	display: none;
            position: fixed;
            background-color: white;
            max-height: 90%;
            overflow-y: auto;
            top: 10px;
            right: 10px;
            width: 280px;
       }
/*****修改地图样式******/
  
	#container /deep/ .amap-marker .amap-lib-marker-from{/*起点*/
		width: .25rem!important;
		height: .28rem!important;
		background-image: url(../images/icon_start.png)!important;
	}
	#container /deep/ .amap-marker .amap-lib-marker-to{/*终点*/
		width: .25rem!important;
		height: .28rem!important;
		background-image: url(../images/icon_finish.png)!important;
	}
	#container /deep/ .amap-marker .amap-lib-marker-mid{/*经过*/
		width: .25rem!important;
		height: .28rem!important;
		background-image: url(../images/icon_fix.png)!important;
	}
	.trail {
	    width: 100%;
	    height: 35%;
	    padding-top: 10px;
	    text-align: center;
	    background: #F6F6F6;
	    overflow: hidden;
	}
	.trail img {
	    /*margin-top: 2rem;*/
	    width: 45%;
	    height: 50%;
	    vertical-align: middle;
	}
	
	.trail span {
	    font-size: .2rem;
	    color: #999999;
	}
	.icon_center{
		width: 1.17rem;
		height: .1rem;
		border-radius: 50px;
		background: #F6F6F6;
		margin: .1rem auto;
	}
	.end_content{
		margin-top: .05rem;
		padding: .1rem;
		z-index: 99;
	}
	.plate_no{
		display: flex;
	    justify-content: space-between;
	    align-items: center;
		display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    -webkit-align-items: center;
	    border-bottom: 1px solid #DBDBDB;
	    padding-bottom: .18rem;
	    
	}
	.plate_fz{
		font-size: 18px;
	}
	.icon_red,.icon_blue,.icon_green{
		display: inline-block;
		width: .25rem;
		height: .25rem;
		line-height: .23rem;
		font-size: 16px;
		border-radius: 50%;
		color: #FFFFFF;
		text-align: center;
		margin-right: .11rem;
	}
	.icon_red{
		background-color: #ea6056;
	}
	.icon_blue{
		background-color: #44A8EC;
	}
	.icon_green{
		background-color: #49bc5b;
	}
	.addrs_item{
		display: flex;
	    align-items: flex-start;
		display: -webkit-flex;
	    -webkit-align-items: flex-start;
	    margin-top: .12rem;
	}
	.time{
		margin-top: .1rem;
	}
	.btns{
		margin-top: .18rem;
	}
	.btn_item {
	    display: inline-flex;
	    display: -webkit-inline-flex;
	    /*width: .94rem;*/
	    height: .34rem;
	    padding: 0 .24rem;
	    color: #ffffff;
	    background: #333;
	    border-radius: 50px;
	    text-align: center;
	    margin-right: .05rem;
	    align-items: center;
	    justify-content: center;
	    -webkit-align-items: center;
	    -webkit-justify-content: center;
	}
	.btn_item0{
		padding: 0 .13rem;
	}
	/*右箭头*/
	.right_icon {
	    display :inline-block;
	    position: relative;
	    width: 10px;
	    height: 15px;
	}
	.right_icon::after {
	    display: inline-block;
	    content: " ";
	    height: 10px;
	    width: 10px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #464646;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 0px;
	    margin-top: -5px;
	}
	.remain{
		color: #464646;
		display: flex;
		justify-content: space-between;
		align-items: center;
		display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    -webkit-align-items: center;
	    margin-top: .23rem;
	    margin-bottom: .85rem;
		
	}
	.footer_btn{
		width: 100%;
	    position: fixed;
	    bottom: 0;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	   	display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    -webkit-align-items: center;
	    height: .63rem;
	    -webkit-align-items: center;
		-moz-box-shadow: 0px -3px 5px #e7e7e7;
	    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
	    box-shadow: 0px -3px 5px #e7e7e7;
	    padding:0 .1rem;
	    z-index: 200;
	    background: #FFFFFF;
	}
	.footer_btn p {
	    width: 48%;
	    text-align: center;
	    border: 1px solid #333;
	    height: .43rem;
	    line-height: .42rem;
	}
</style>