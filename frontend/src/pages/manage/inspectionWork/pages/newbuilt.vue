<template>
    <div id="newbuilt">
        <div class="car-detail" v-if="resultData !=''">
            <div class="car-top">
                <div class="plate_no">
                    <font class="font1">{{resultData.plate_no}}</font> ({{resultData.vin.substring(11, 17)}})
                    <span class="status_name">{{resultData.status_name}}</span>
                </div>
                <!-- 成都限行-->
                <div class="chengdu-limt" v-if="resultData.chengdu_limit_record && resultData.chengdu_limit_record==1">今日限行</div>
                <div class="chengdu-limt chengdu-limt2" v-else-if="resultData.chengdu_limit_record && resultData.chengdu_limit_record==2">明日限行</div>
                <!-- 广州限行-->
                <div class="gz-limit" v-if="resultData.limit_record && resultData.plate_no.indexOf('粤A') != '-1' && resultData.plate_no != ''">
                    <div class="today-moring" v-for="(item,index) in resultData.limit_record" v-if="index<2">
                        <div>{{index==0?'今':'明'}}</div>
                        <div class="opencar">
                            开
                        </div>
                    </div>
                    <div class="div-com opencar" v-for="(item,index) in resultData.limit_record" v-if="index>1">
                        开
                    </div>
                </div>
                <div class="gz-limit" v-if="resultData.limit_record && resultData.plate_no && resultData.plate_no.indexOf('粤A') == '-1'">
                    <div class="today-moring" v-for="(item,index) in resultData.limit_record" v-if="index<2" :class="item.limit == 0?'':item.limit == 1?'stop-ff8e8e':'wait-D1D1D1'">
                        <div>{{index==0?'今':'明'}}</div>
                        <div :class="item.limit == 0?'opencar':item.limit == 1?'stop-ff8e8e':'waitingcar'">
                            {{item.limit == 0?'开':item.limit==1?'停':'待'}}
                        </div>
                    </div>
                    <div v-for="(item,index) in resultData.limit_record" v-if="index>1" class="div-com" :class="item.limit==0?'opencar':item.limit==1?'stopcar':'waitingcar'">
                        {{item.limit==0?'开':item.limit==1?'停':'待'}}
                    </div>
                </div>
            </div>
            <div class="car-info">
                <span class="brand_name">{{resultData.brand_name}}</span>
                <span class="car-color">{{resultData.color}}</span>
                <span class="carqube" v-if="resultData.car_factory">{{resultData.car_factory}}</span>
                <span class="carqube" v-else>三方</span>
                <span class="remain_km">约续航{{resultData.remain_km}}公里</span>
            </div>
            <div class="getnet">
                <div class="get-left">
                    <img v-if="resultData.biz_type==0" class="mapb" src="../images/mapb.png"/>
                    <img v-else class="mapb" src="../images/map-B.png"/>
                    <span class="branch_addr inline">{{resultData.branch_addr}}</span><br/>
                    <span v-if="resultData.biz_type==1 && resultData.park_fee" class="park_fee">预计停车费<font>{{resultData.park_fee}}</font>元</span>
                </div>
                <div class="get-right" @click="gonavi()">
                    <img src="../images/daohang.png" />
                </div>
            </div>
        </div>
        <div v-else class="status_text">
            暂无获取到车辆信息,稍后重试
        </div>
        <div class="checkbox-type">
            <div><font>*</font>巡检类型:</div>
            <div class="radio">
                <div class="item" v-for="(item,index) in radioList" :key="index" @click="select(index)">
                    <span class="icon" :class="item.selected?'on':''"></span>
                    <span class="label" :class="item.selected?'label-on':''">{{item.name}}</span>
                </div>
            </div>
        </div>
        <!-- 备注信息-->
        <div class="remark-div">
            <remark :showblock="showblock"  :text_value="placeholder"/>
        </div>
        <div class="submit-info">
            提交后，该车的车辆状态变为"巡检"
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/newbuilt.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    import remark from '../component/remark'
    import Button from '../component/bottomBtn'
    import {Indicator} from 'mint-ui'

    export default{
        components: {
            remark,
            Button
        },
        data ()
    {
        return {
            resultData:JSON.parse(sessionStorage.getItem('resultData')) || '',//获取缓存车辆信息
            radioList:[
                {
                    id:1,
                    name:'常规巡检',
                    selected:true
                },
                {
                    id:2,
                    name:'物料补充',
                    selected:false
                }
            ],
            showblock:false,//备注信息必填项
            placeholder:'请填写备注信息，200字以内',//备注信息
            showsubmit:false,//底部按钮
            text:'提交',
            locationsLng:'',
            locationsLat:'',//当前位置经纬度
            type:1 //巡检类型 1 常规巡检 2 物料补充
        }
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        $("body").css("background", "#f6f6f6");
    }
    ,
    methods: {
        select(index){
            let arr = this.radioList.slice();
            arr.map(item=>{
                item.selected = false
            })
            arr[index].selected = true
            this.radioList = arr;
            this.type=arr[index].id;
        },
        //网点导航
        gonavi(){
            var driving,
                    _this=this;
            if(!_this.resultData.begin_branch_lng){
                _this.$_LIKE_toast('没有获取到该网点的经纬度')
                return false;
            }
            AMap.plugin(["AMap.Driving"], function () {
                var drivingOption = {
                    policy: AMap.DrivingPolicy.LEAST_TIME,
                    map: ''
                };
                driving = new AMap.Driving(drivingOption); //构造驾车导航类
            });
            //钉钉获取定位
            dd.getLocation().then(res => {
                driving.search(
                        [res.longitude, res.latitude], [_this.resultData.begin_branch_lng, _this.resultData.begin_branch_lat],
                        function (status, result) {
                            driving.searchOnAMAP({
                                origin: result.origin,
                                destination: result.destination
                            });
                        });
            }).catch(err => {
                _this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
            });
        },
        //创建巡检工单
        submitInfo(){
            Indicator.open({
                text: '提交中...',
                spinnerType: 'fading-circle'
            });
            let _this=this;
//            dd.getLocation({targetAccuracy: 200,
//                coordinate: 1,
//                withReGeocode: false,
//                useCache: true}).then(data => {
//                _this.locationsLng=data.longitude;
//                _this.locationsLat=data.latitude;
                myAjax.post(getApiUrl('/vehicle-inspection/create-order'),{
                    mobile:sessionStorage.getItem("mobile"),
                    car_id:sessionStorage.getItem("car_id"), //车辆id
                    type:_this.type,
                    lng:_this.locationsLng,
                    lat:_this.locationsLat,
                    remark:$(".void_writeinfo").val()//备注信息非必填
                }).then(res=>{
                    Indicator.close();//去除loading
                    if(res.status==0){
                        window.location.href = "index.html#/detail?id="+res.data.id;
                    }else{
                        _this.$_LIKE_toast(res.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
//            }).catch(err => {
//                Indicator.close();//去除loading
//                _this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
//            })
        }
    }
    }
</script>