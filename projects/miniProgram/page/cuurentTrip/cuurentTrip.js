import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        currentPage:true,
        longitude:0,
        latitude:0,
        markers:[],
        controls:[
            {
                id:1,//个人中心入口
                position:{
                    top: 80,
                    left: 6,
                    width: 44,
                    height: 44,
                },
                iconPath:'/image/profileBtn.png',
                clickable: true
            },
            {
                id:2,
                position:{
                    left:337,
                    top:100,
                    width:44,
                    height:44,
                },
                iconPath:'/image/resetBtn.png',
                clickable: true
            }
        ],
        info:{},
        h:0,
        m:0,
        total_km:0,
        total_money:0,
        price_insurance:0,
    },
    onLoad() {
        this._getInfo();
    },
    onReady() {
        this.mapCtx = my.createMapContext('map');//获取地图el
        this._setRetBtnPosition(225);
        this._setProfilePosition();  
        this.refreshInfo();
        let _this = this;
    },
    refreshInfo() {
        let _this = this;
        this.timer&&clearInterval(this.timer);
        this.timer = setInterval(()=>{
            _this._getInfo();
        },60000)
    },
    _getInfo(){
        let { uuid, sign } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign
        }
        let self = this;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetCurrentOrder(),
                data
            }).then((res)=>{
                if(res.status==0) {
                    resolve(res);
                    let info = res.data;

                    let beginPoint = {};
                    let endPoint = {};
                    beginPoint.longitude = info.begin_branch_lng;
                    beginPoint.latitude = info.begin_branch_lat;
                    beginPoint.iconPath = '/image/qu.png';
                    beginPoint.width = 36;
                    beginPoint.height = 44;

                    endPoint.longitude = info.drive_lng;
                    endPoint.latitude = info.drive_lat;
                    endPoint.iconPath = '/image/huan.png';
                    endPoint.width = 36;
                    endPoint.height = 44;
                    
                    let markers = [];
                    markers.push(beginPoint);
                    if(info.drive_lng) {
                        markers.push(endPoint);
                    }

                    let total_time = info.total_time;
                    let time = utils.formatTime(total_time)
                    self.setData({
                        info:info,
                        total_money:utils.switchNum(info.total_money),
                        total_km:utils.switchNum(info.total_km),
                        longitude:info.car_lng,
                        latitude:info.car_lat,
                        markers:markers,
                        h:time.hour,
                        m:time.minute,
                        price_insurance:Number(info.price_insurance) > 0 ? info.price_insurance : Number(info.price_insurance)
                    })
                    if(info.end_branch_name) {
                        self._setRetBtnPosition(260);
                    }      
                }
            }).catch((err)=>{
                reject(err);
            })
        })
        return p ;
    },
    _setProfilePosition(){//设置个人中心入口的图标位置
        let self = this;
        my.createSelectorQuery()
        .selectViewport().boundingClientRect()
        .exec((res)=>{
            let controls =self.data.controls;
            controls[1].position.left = res[0].width-50;
            self.setData({
                controls:controls
            })
        })
    },
    _setRetBtnPosition(propBoxHeight) {//设置回到定位点按钮的位置
        var _this  = this;
        my.createSelectorQuery()
        .selectViewport().boundingClientRect()
        .select('.mapWrap').boundingClientRect()
        .exec((res)=>{
            let controls = _this.data.controls;
            controls[1].position.top = res[0].height - propBoxHeight- 47;
            
            _this.setData({
                controls:controls
            })
        })
    },
    _goProfile() {//跳转
        my.redirectTo({
            url:'/page/profile/profile'
        });
    },
    controltap(e) {
        switch (e.controlId) {
            case 1:
            this._goProfile();
            break;
            case 2:
            this.mapCtx.moveToLocation();
            break;
            case 3:
            my.makePhoneCall({
              number: '400-666-2333'
            });
            break;
        }
    },
    _findCar() {//鸣笛找车
        let { sign,uuid }  = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
        }
        http.post({
            url:api.apiFindCar(),
            data
        }).then((res)=>{
            if(res.status==0) {
                my.showToast({
                    content:res.msg
                });
            }else{
                my.showToast({
                    content:'寻车失败'
                });
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    _openDoor() {
        let { uuid , sign , latitude , longitude ,city_id,sys_string } = app.globalData
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:latitude,
            user_lng:longitude,
            city_id:city_id,
            user_sys_version:sys_string
        }
        http.post({
            url:api.apiOpenDoor(),
            data,
        }).then((res)=>{
            my.showToast({
                content:res.msg
            });
        }).catch((err)=>{
            console.log(err)
        })
    },
    _closeDoor() {
        let { uuid , sign , latitude , longitude ,city_id,sys_string } = app.globalData
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:latitude,
            user_lng:longitude,
            city_id:city_id,
            user_sys_version:sys_string
        }
        http.post({
            url:api.apiCloseDoor(),
            data
        }).then((res)=>{
            my.showToast({
                content:res.msg
            });
        }).catch((err)=>{
            console.log(err)
        })
    },
    _returnCar() {
        let { info } = this.data;
        my.redirectTo({
            url:'/page/returnCheck/returnCheck?info='+JSON.stringify(info)
        })
    },
    _goMore() {
        my.navigateTo({
            url:'/page/strokeMore/strokeMore'
        })
    },
    _openLocation() {
        let info = this.data.info;
        my.openLocation({
            longitude: info.drive_lng, // 经度
            latitude: info.drive_lat, // 纬度
            name: info.end_branch_name, // 位置名称
            address: info.end_branch_addr // 地址的详细说明
        });
    },
    goReturnCarPage() {
        let { info } = this.data;
        let pageParam = {
            name:info.begin_branch_name,
            id:info.begin_branch_id
        }
        console.log(pageParam)
        my.navigateTo({
            url: '/page/returnCarOutlets/returnCarOutlets?pageParam='+JSON.stringify(pageParam)
        })
    },
    onUnload() {
        this.timer&&clearInterval(this.timer);
    },
    onHide() {
        this.timer&&clearInterval(this.timer);
    },
    onShow() {
        this._getInfo();
        this.refreshInfo();
    }
})