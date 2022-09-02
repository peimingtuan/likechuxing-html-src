import api from '../../common/api';
import utils from '../../common/utils';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        longitude:0,
        latitude:0,
        markers:[],
        controls:[
            {
                id:1,//个人中心入口
                position:{
                    top:80,
                    left:6,
                    width:44,
                    height:44,
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
        minute:'',//剩余多长时间开始计费,
        begin_charge_time:'',
        // pageIsShow:false,
        price_insurance:0
    },
    onLoad() {
        this._getInfo();
    },
    refreshInfo() {
        this.timer&&clearInterval(this.timer);
        this.timer = setInterval(()=>{
            this._getInfo();
        },60000)
    },
    onReady() {
        this.mapCtx = my.createMapContext('map');//获取地图el
        this._setRetBtnPosition(325);
        this._setProfilePosition();
        this.refreshInfo();
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
                    let markersItem = {};
                    let markers = []
                    markersItem.latitude = info.begin_branch_lat;
                    markersItem.longitude = info.begin_branch_lng;
                    let num = info.begin_branch_car_cnt||0
                    if(num>8) {
                        num = 9;
                    }
                    markersItem.iconPath = '/image/'+num+'-sel.png';
                    markersItem.width = 46;
                    markersItem.height= 52;
                    markers.push(markersItem)
                    self.setData({
                        info:info,
                        longitude:info.car_lng,
                        latitude:info.car_lat,
                        markers:markers,
                        begin_charge_time:utils.toHourMinute(info.begin_charge_time),
                        price_insurance:Number(info.price_insurance) > 0 ? info.price_insurance : Number(info.price_insurance)
                        // pageIsShow:true
                    })
                    let s = parseInt(info.left_free_time);
                    if(s==0) {
                        return;
                    }
                    self.countDown(s);
                    
                }else{
                    reject(res);
                }
            }).catch((err)=>{
                console.log(err)
            })
        })
        return p;
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
    _setRetBtnPosition(porpsBoxHeight) {//设置回到定位点按钮的位置
        let  _this = this
        my.createSelectorQuery()
        .selectViewport().boundingClientRect()
        .select('.mapWrap').boundingClientRect()
        .exec((res)=>{
            let controls = _this.data.controls;
            controls[1].position.top = res[0].height-porpsBoxHeight - 47;
            
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
    goReturnCarPage() {
        let { info } = this.data;
        let pageParam = {
            name:info.begin_branch_name,
            id:info.begin_branch_id
        }
        my.navigateTo({
            url:'/page/returnCarOutlets/returnCarOutlets?pageParam='+JSON.stringify(pageParam)
        })
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
            }else {
                my.showToast({
                    content:'寻车失败'
                });
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    _cancelOrder() {//取消订单
        my.navigateTo({
            url:'/page/cancelOrder/cancelOrder'
        });
    },
    _goCarDetail(e) {
        let data = e.target.dataset.carInfo;
        my.navigateTo({
            url:'/page/carDetail/carDetail?info='+JSON.stringify(data)
        })
    },
    _driveBtn(){ 
        my.redirectTo({
            url:'/page/checkCarBefore/checkCarBefore?rental_id='+this.data.info.rental_id
        })
    },
    _openLocation() {
        let info = this.data.info;
        my.openLocation({
            longitude: info.begin_branch_lng, // 经度
            latitude: info.begin_branch_lat, // 纬度
            name: info.begin_branch_name, // 位置名称
            address: info.begin_branch_addr, // 地址的详细说明
        });
    },
    countDown(s) {
        let _this = this;
        var s = parseInt(s);
        this.countTimer&&clearInterval(this.countTimer)
        this.countTimer = setInterval(()=>{
            s--;
            if(s<0||s==0) {
                
                clearInterval(this.countTimer);
                let info = _this.data.info;
                info.is_rental_begin = 1
                _this.setData({
                    info
                })
            }
            if(s<2) {
                 _this._getInfo();
            }
            let m = parseInt(s/60)<10?'0'+parseInt(s/60):parseInt(s/60);
            let ms = s%60<10?('0'+s%60):s%60;
            let str = m+':'+ms;
            _this.setData({
                minute:str,
            })
        },1000)
    },
    onUnload() {
        this.timer&&clearInterval(this.timer);
        this.countTimer&&clearInterval(this.countTimer)
    },
    // onHide() {
    //     this.timer&&clearInterval(this.timer);
    // },
    // onShow() {
    //     // this._getInfo();
    //     // this.refreshInfo();
    // }
})