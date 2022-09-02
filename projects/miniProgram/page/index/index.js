import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import filterBranch from '../../common/filterBranch';
import onShareAppMessage from '../../common/shareAppMessage';

// my.hideShareMenu();
var app = getApp();
Page({
    data: {
        screenHeight:'',
        longitude: 0,
        latitude: 0,
        markers: [],
        controls: [
            {
                id: 1,//个人中心入口
                position: {
                    top: 80,
                    left: 10,
                    width: 40,
                    height: 40,
                },
                iconPath: '/image/profileBtn.png',
                clickable: true
            },
            {
                id: 2,
                position: {
                    left: 337,
                    top: 100,
                    width: 40,
                    height: 40,
                },
                iconPath: '/image/resetBtn.png',
                clickable: true
            },
            {
                id: 3,
                position: {
                    left: 171.5,
                    top: 227,
                    width: 32,
                    height: 52,
                },
                iconPath: '/image/center.png',
                clickable: true
            }
        ],
        list:[],//全部网点
        show: false,
        carList: [],
        currentIndex: 0,//当前选择车辆的index
        pickInfo: {},
        pickAddress: '取车点',//取车点
        pickAddressId: '',//取车点id
        returnAddress: '',//还车点
        returnAddressId: '',//还车点id,
        parking_fee:0,//停车费,
        isHasBranch:false,
        isHasCar:false,
        scale:16,
        returnNum:'0.00',
        show_swiper:false,
        pageIsShow:false,
        insurance_service:1,
        sdewSwitch:true
    },
    onShareAppMessage,
    onLoad() {
        app.event.onEvent('getCityIdSuccess',()=>{
            this._setMapCenter();
            this._getBranchList();
            this.receiveCoupon();
        })
    },
    regionChange(e) {
        let { list, markers } = this.data;
        if (e.type === 'end'){
            let arr = filterBranch.filterDegreeArr(e,list)
            if(markers.toString()==arr.toString()){
                return
            }
            this.setData({
                latitude:e.latitude,
                longitude:e.longitude,
                scale:e.scale,
                markers:arr
            })
        }
    },
    clearData() {
        this.setData({
            pickAddress: '取车点',//取车点
            // pickAddressId: '',//取车点id18507523532
            returnAddress: '',//还车点
            returnAddressId: '',//还车点id,
            returnNum:'0.00',
            currentIndex:0
        })
        this.switchIcon('');
        this._hideView();
    },
    onReady() {
        this.mapCtx = my.createMapContext('map');//获取地图el
        this._setProfilePosition();
        this._setRetBtnPosition(65);
        this.refreshBranch()
    },
    checkPage() {//检查是否有当前行程
        app._checkIsLogin().then((isLogin)=>{
            
            if(isLogin) {
                let { uuid, sign } = app.globalData;
                let data = {
                    uuid:uuid,
                    sign:sign
                }
                http.post({
                    url:api.apiGetCurrentOrder(),
                    data
                }).then((json)=>{
                    switch (json.status) {
                        case 0:
                            if (json.data.is_car_begin == 0) {//创建订单(未开门)
                                app.globalData.is_car_begin = 0
                                my.navigateTo({
                                    url: '/page/pickCarWaiting/pickCarWaiting'
                                })
                            } else if (json.data.is_car_begin == 1) {//订单已开始（计费开始）
                                app.globalData.is_car_begin = 1
                                my.navigateTo({
                                    url: '/page/cuurentTrip/cuurentTrip'
                                })
                            }
                            break;
                        case 1001://未支付订单
                            my.navigateTo({
                                url: '/page/payOrder/payOrder?rental_no=' + json.data.rental_no
                            })
                            break;
                        case 1003:
                            if(json.msg){
                                my.showToast({
                                  content:json.msg, 
                                  duration:1000, 
                                  success: (res) => {
                                    my.navigateTo({
                                        url:'/page/payBail/payBail'
                                    })
                                  },
                                });
                            }else{
                                my.navigateTo({
                                    url:'/page/payBail/payBail'
                                })
                            }
                            
                            break;
                        case 1007:
                            my.navigateTo({
                                url:'/page/orderTip/orderTip'
                            })
                            break;
                        case 1008:
                            my.navigateTo({
                                url:'/page/payTip/payTip'
                            })
                            break;
                        case 1009:
                            my.navigateTo({
                                url: '/page/authentication/authentication'
                            })
                            break;
                        case 1013:  
                            my.navigateTo({
                                url: '/page/submitOrder/submitOrder?rental_no=' + json.data.rental_no
                            })
                            break;
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    refreshBranch() {
        let _this = this;
        this.timer&&clearInterval(this.timer);
        this.timer = setInterval(()=>{
            _this._getBranchList();
        },60000)
    },
    _setMapCenter() {//设置地图定位点
        let { longitude, latitude } = app.globalData;
        this.setData({
            longitude,
            latitude
        })
    },
    _getBranchList() {//获取网点列表
        
        let { sys_string, longitude, latitude, city_id } = app.globalData;
        let { pickAddressId } = this.data;
        let location = { 
            longitude, 
            latitude 
        }
        let self = this;
        http.post({
            url: api.apiBranchList(),
            data: {
                user_lng: longitude,
                user_lat: latitude,
                city_id: city_id,
                user_sys_version: sys_string
            }
        }).then((res) => {
            if (res.status == 0) {
                let arr = res.data;
                if (arr.length) {
                    for (let i = 0; i < arr.length; i++) {
                        arr[i].latitude = arr[i].lat;
                        arr[i].longitude = arr[i].lng;
                        if (arr[i].car_cnt > 8) {
                            arr[i].car_cnt = 9;
                        }
                        if (arr[i].biz_type == 0) {
                            arr[i].iconPath = '/image/' + arr[i].car_cnt + '-nor.png';
                            arr[i].width = 38;
                            arr[i].height = 43;
                        } else {
                            arr[i].iconPath = '/image/' + arr[i].car_cnt + '-norl.png';
                            arr[i].width = 46;
                            arr[i].height = 49;
                        }
                    }
                    let result = filterBranch.filterDegreeArr(location,arr);
                    
                    self.setData({
                        markers: result,
                        list:arr,
                        pageIsShow:true,
                        isHasBranch:true
                    })
                    if(pickAddressId){
                        self.switchIcon(pickAddressId);
                        self._getCarList(pickAddressId).then(() => {
                            my.hideLoading();
                            self._showView();
                        }).catch((err) => {
                            my.hideLoading();
                        })
                    }
                }else{
                    self.setData({
                        isHasBranch: false,
                        pageIsShow:true
                    })
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    },
    _setProfilePosition() {//设置个人中心入口的图标位置
        let self = this;
        my.createSelectorQuery()
            .selectViewport().boundingClientRect()
            .exec((res) => {
                let controls = self.data.controls;
                controls[1].position.left = res[0].width - 50;
                controls[2].position.left = res[0].width/2 -16;
                self.setData({
                    controls: controls
                })
            })
    },
    _setRetBtnPosition(propBoxHeight) {//设置回到定位点按钮的位置
        let _this = this;
        my.createSelectorQuery()
        .selectViewport().boundingClientRect()
        .select('.box').boundingClientRect()
        .exec((res)=>{
            
            let controls = _this.data.controls;
            controls[1].position.top = res[0].height - propBoxHeight- 50;
            controls[2].position.top = (res[0].height - propBoxHeight)/2 - 52;
            _this.setData({
                controls:controls
            })
            
        })
    },
    _goProfile() {//跳转
        app._checkIsLogin().then((res) => {
            if (res) {
                my.navigateTo({
                    url: '/page/profile/profile'
                });
            } else {
                my.navigateTo({
                    url: '/page/alipayLogin/alipayLogin'
                });
            }
        }).catch((err) => {
            console.log(err)
        })
    },
    onMarkerTap(e) {
        this.setData({
            currentIndex:0
        })
        my.hideToast();
        my.showLoading({
            content:'加载中'
        });
        this.switchIcon(e.markerId);
        this._getCarList(e.markerId).then(() => {
            my.hideLoading();
            this._showView();
        }).catch((err) => {
            my.hideLoading();
            console.log(err);
        })

    },
    getParkingFee(id) {
        
        let { carList } = this.data;
        
        this.setData({
            parking_fee:carList[id].parking_fee?utils.switchNum(carList[id].parking_fee):'0.00'
        })
    },
    switchIcon(id) {
        let pickAddressId = this.data.pickAddressId;
        
        let arr = this.data.markers;
        for (let i = 0; i < arr.length; i++) {
            if(arr[i].id==pickAddressId) {
                let str = arr[i].iconPath;
                let num = str.substr(str.indexOf('-') - 1, 1);
                if (arr[i].biz_type == 0) {
                    arr[i].iconPath = '/image/' + num + '-nor.png';
                    arr[i].width = 38;
                    arr[i].height = 43;
                } else {
                    arr[i].iconPath = '/image/' + num + '-norl.png';
                    arr[i].width = 46;
                    arr[i].height = 49;
                }
               
            }
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                let url = arr[i].iconPath;
                let numActive = url.substr(url.indexOf('-') - 1, 1);
                if (arr[i].biz_type == 0) {
                    arr[i].iconPath = '/image/' + numActive + '-sel.png';
                    arr[i].width = 46;
                    arr[i].height = 52;
                } else {
                    arr[i].iconPath = '/image/' + numActive + '-sell.png';
                    arr[i].width = 54;
                    arr[i].height = 58;
                }
            }
        }
        this.setData({
            markers: arr,
            pickAddressId:id
        })
    },
    pressMap() {
        this.switchIcon('')
        this._hideView();
        this.setData({
            isHasCar:false
        })
    },
    _showView() {
        this.setData({
            show: true,
            isHasCar:false
        })
          this._setRetBtnPosition(380);
    },
    _hideView() {
        this.setData({
            show: false,
        })
        this._setRetBtnPosition(65);
    },
    controltap(e) {
        switch (e.controlId) {
            case 1:
                this._goProfile();
                break;
            case 2:
                this.mapCtx.moveToLocation();
                break;
        }
    },
    _getCarList(id) {
        let { longitude, latitude, city_id, sys_string, uuid, sign } = app.globalData;
        let data = {
            user_lng: longitude,
            user_lat: latitude,
            city_id: city_id,
            user_sys_version: sys_string,
            begin_branch_id: id,
            uuid,
            sign
        }
        this.setData({
          currentIndex:0
        })
        let self = this;
        let p = new Promise((resolve, reject) => {
            http.post({
                url: api.apiCarList(),
                data: data
            }).then((res) => {
                if (res.status == 0) {
                    // 先将swiper置为不显示，而后重新显示后重新渲染，会读取配置的current=0
                    self.setData({
                        show_swiper:false
                    })

                    this._getBranchName(id);
                    if (res.data.length > 8) {
                        let arr = res.data.slice(0, 8);
                        self.setData({
                            carList: arr,
                            parking_fee:arr[0].parking_fee?utils.switchNum(arr[0].parking_fee):'0.00',
                            show_swiper:true,
                            isHasCar:false
                        })
                        resolve(res)
                    } else {
                        self.setData({
                            isHasCar:false,
                            show_swiper:true,
                            carList: res.data,
                            parking_fee:res.data[0].parking_fee?utils.switchNum(res.data[0].parking_fee):'0.00'
                        })
                        resolve(res)
                    }

                } else {
                    self._hideView();
                    self.setData({
                        isHasCar:true,
                    })
                    reject(res.msg)
                    // my.showToast({
                    //     content: res.msg
                    // });
                }
            }).catch((err) => {
                console.log(err);
            })
        })
        return p
    },
    _getBranchName(id) {
        let self = this;
        let arr = this.data.markers.slice();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                self.setData({
                    pickAddress: arr[i].name,
                    pickInfo: arr[i]
                })
            }
        }
    },
    goReturnCarPage() {
        let arr = this.data.markers.slice();
        let data = {};
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == this.data.pickAddressId) {
                data = arr[i]
            }
        }
        let pageParam = {
            name:data.name,
            id:data.id
        }
        my.navigateTo({
            url: '/page/returnCarOutlets/returnCarOutlets?pageParam=' + JSON.stringify(data)
        })
    },
    _driveBtn() {
        app._checkIsLogin().then((res)=>{
            if (res) {
                this._order();
            } else {
                my.navigateTo({
                    url: '/page/alipayLogin/alipayLogin'
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    _order() {
        let { carList, pickAddress, pickAddressId, returnAddress, returnAddressId, currentIndex, markers,insurance_service } = this.data;
        let { uuid, sign, city_id, sys_string } = app.globalData;
        if (carList.length == 0) {
            return;
        }
        let obj = carList[currentIndex];
        if (carList[currentIndex].price_insurance <= 0) insurance_service = 0
        let data = {
            uuid: uuid,
            sign: sign,
            begin_branch_id: pickAddressId,
            price_km: obj.price_km||0,
            price_min: obj.price_min||0,
            price_extra: obj.price_extra||0,
            car_id: obj.id,
            source: 1,
            city_id: city_id,
            user_sys_version: sys_string,
            insurance_service
        }
        if (returnAddressId != '') {
            data.end_branch_id = returnAddressId
        }
        //跳转到取车页所传的参数
        let branch = [];
        for (let i = 0; i < markers.length; i++) {
            if (markers[i].id == pickAddressId) {
                branch = markers[i];
            }
        }
        let options = {
            car: carList[currentIndex],
            branch: branch,
            returnAddress: returnAddress
        }
        my.hideToast();
        my.showLoading({
            content:'下单中...'
        })
        let _this = this;
        http.post({
            url: api.apiOrder(),
            data: data
        }).then((res) => {  
            my.hideLoading();
            switch (res.status) {
                case 1:
                    my.showToast({ content: res.msg })
                    break;
                case 0:
                    _this.clearData();
                    my.navigateTo({
                        url: '/page/pickCarWaiting/pickCarWaiting'
                    })
                    break;
                case 1001://未支付订单
                    my.showToast({
                        content: res.msg,
                        success: () => {
                            _this.clearData();
                            my.navigateTo({
                                url: '/page/payOrder/payOrder?rental_no=' + res.data.rental_no
                            })
                        }
                    })
                    break;
                case 1002:
                    my.showToast({
                        content: res.msg,
                        success: () => {
                            http.post({
                                url: api.apiGetCurrentOrder(),
                                data: {
                                    uuid: uuid,
                                    sign: sign
                                }
                            }).then((res) => {
                                if (res.status == 0) {
                                    if (res.data.is_car_begin == 0) {//创建订单(未开门)
                                        _this.clearData();
                                        my.navigateTo({
                                            url: '/page/pickCarWaiting/pickCarWaiting',
                                            success:()=>{
                                                app.globalData.is_car_begin = 0
                                            }
                                        })
                                    } else if (res.data.is_car_begin == 1) {//订单已开始（计费开始）
                                        _this.clearData();
                                        my.navigateTo({
                                            url: '/page/cuurentTrip/cuurentTrip',
                                            success:()=>{
                                                app.globalData.is_car_begin = 1
                                            }
                                        })
                                    }
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    })
                    break;
                case 1003:
                    my.showToast({ 
                        content: res.msg,
                        duration:1000,
                        success:()=>{
                            _this.getStatus().then((bailRes)=>{
                                if(bailRes.deposit_status==1) {
                                    if(bailRes.is_open_zm_auth==1) {
                                        my.navigateTo({
                                            url: '/page/freeDeposit/freeDeposit'
                                        })
                                        
                                    }else{
                                        my.navigateTo({
                                            url: '/page/payBail/payBail'
                                        });
                                    }
                                }else{
                                    my.navigateTo({
                                        url:'/page/bail/bail'
                                    });
                                }
                                _this.clearData();
                            })
                        }
                    })
                    break;
                case 1007:
                _this.clearData();
                    my.navigateTo({
                        url:'/page/orderTip/orderTip'
                    })
                    break;
                case 1008:
                _this.clearData();
                    my.navigateTo({
                        url:'/page/payTip/payTip'
                    })
                    break;
                case 1009:
                    my.showToast({
                        content: res.msg,
                        duration:1000,
                        success: () => {
                            _this.clearData();
                            my.navigateTo({
                                url: '/page/authentication/authentication'
                            })
                        }
                    })
                    break;
                case 1011:
                    my.showToast({ content: res.msg })
                    break;
                case 1013:
                    my.showToast({
                        content: res.msg,
                        duration:1000,
                        success: () => {//去支付
                            _this.clearData();
                            my.navigateTo({
                                url: '/page/submitOrder/submitOrder?rental_no=' + res.data.rental_no
                            })
                        }
                    })
                    break;
                case 1005:
                    _this._getCarList(pickAddressId)
                    break;
                default:
                    my.showToast({ content: res.msg })
            }
        }).catch((err) => {
            my.hideLoading();
            console.log(err)
        })
    },
    getCurrent(e) {
        let index = e.detail.current;
        this.setData({
            currentIndex: index,
        })
        
        this.getParkingFee(index);
    },
    _goCarDetail(e) {
        let data = e.target.dataset.carInfo;
        my.navigateTo({
            url: '/page/carDetail/carDetail?info=' + JSON.stringify(data)
        })
    },
    _openLocation() {
        let info = this.data.pickInfo;
        my.openLocation({
            longitude: info.lng, // 经度
            latitude: info.lat, // 纬度
            name: info.name, // 位置名称
            address: info.address, // 地址的详细说明
            success: (res) => {

            },
        });
    },
    switchChange (){
        // console.log(1)
        my.confirm({
            title: '',
            content:  '购买不计免赔服务后，如果发生交通事故，您无需承担1500元以内的维修费用，建议购买。',
            confirmButtonText: '购买',
            cancelButtonText: '暂不购买',
            success: (result) => {
                // console.log(1)
                if(result.confirm){
                    // console.log(result,1)
                    this.setData({
                        sdewSwitch:true,
                        insurance_service:1,
                    })
                }else{
                    // console.log(result,0)
                    this.setData({
                        sdewSwitch:false,
                        insurance_service:0,
                    })
                }
               
            }
        });
        
        // if(e.detail.value){
        //     this.setData({
        //         insurance_service:1
        //     })
        // }else{
        //     this.setData({
        //         insurance_service:0
        //     })
        // }
    },
    goLikeDesc(e) {
        
        let isClick = e.target.dataset.isClick;
        if(isClick==0) {
            my.navigateTo({
                url:'/page/likeDesc/likeDesc'
            });
        }      
    },
    goLikeSdew() {
        // console.log(1)
        my.navigateTo({
            url:'/page/likeSdew/likeSdew'
        });
    },
    receiveCoupon() {
        let _this = this;
        app.getAccount().then((bindInfo)=>{
            _this.checkPage();
            http.post({
                url:api.apiisCanReceive(),
                data:{
                    openid:bindInfo.openid,
                    activity_id:1,
                    city_id:app.globalData.city_id,
                    uuid:app.globalData.uuid,
                    sign:app.globalData.sign
                }
            }).then((res)=>{
                if(res.status==0) {
                    app.globalData.new_user = res.data.new_user;
                    
                    if(res.data.coupon_stats==1) {
                        my.navigateTo({
                            url:'/page/receiveCoupon/receiveCoupon'
                        });
                    }
                }
            }).catch((err)=>{
                console.log(err);
            })

        }).catch((err)=>{
            console.log(err)
        })


    },
    getStatus(){//获取审核状态
        let { uuid,sign,longitude,latitude,city_name,city_id } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:longitude,
            user_lng:latitude,
            city_id:city_id,
            city_name:city_name
        }
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiQueryBail(),
                data
            }).then((res)=>{
                if(res.status==0) {
                    resolve(res.data);
                }else{
                    reject(res.msg);
                }
            }).catch((err)=>{
                conosle.log(err)
            })
        })
        return p;
    },
    onUnload(){
        app.event.offEvent('getCityIdSuccess')
    }
})
