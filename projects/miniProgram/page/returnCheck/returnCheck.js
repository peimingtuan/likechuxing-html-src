import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
import like from '/common/like';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        pageName:'returnCheckPage',
        floor:'',
        num:'',
        end_branch_id:'',
        branch_name:'',
        branch_addr:'',
        isShow:true,//是否显示车位号填写框
        isActive:false,
        countDown:30,
        showModal:false,//显示检测框,
        carStatus:{
            "car_light": 0,
            "car_door": 0,
            "car_acc": 0,
            "car_trunk":0
        },
        checkLight:true,
        checkDoor:true,
        checkAcc:true,
        checkTrunk:true,
        status:'',
        items:['5层', '4层', '3层', '2层', '地面', 'B1','B2','B3','B4','B5','B6'],
        isShowComfirmBtn:false,
        info:{},
        pageIsShow:false,
        class:[],
        visible:false,
        index:[4],
        isUpdateEndBranch:false
    },
    onLoad() {  
        like.init();
        this.getStartBranch().then(()=>{
            this.getBranch(); 
        }).catch(err=>{
            console.log(err)
        })  
    },
    getCarNum(e) {
        this.setData({
            num:utils.trimStr(e.detail.value)
        })
        this.isActive()
    },
    getPickerItem(e) {
        let index = e.detail.value;
        let isShow = true
        if(index==4){
            isShow = false
        }
        this.setData({
            floor:this.data.items[index],
            isShow,
            num:''
        })
        this.isActive();
    },
    getStartBranch(){
        let { uuid, sign } = app.globalData;
    
        let data = {
            uuid:uuid,
            sign:sign
        }
        let self = this;
        return new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetCurrentOrder(),
                data
            }).then((res)=>{
                if(res.status==0) {
                    let info = res.data;
                    self.setData({
                        info:info,
                        branch_name:info.end_branch_name||'',
                        branch_addr:info.end_branch_addr||'',
                        end_branch_id:info.end_branch_id||''
                    })
                    resolve(res);  
                }
            }).catch((err)=>{
                reject(err);
            })
        })

    },
    getBranch(callback) {
        let { uuid, sign, longitude,latitude } = app.globalData;
        let { end_branch_id } = this.data;
        let _this = this;
        my.getLocation({
            success:(res)=>{
                let data = {
                    uuid:uuid,
                    sign:sign,
                    user_lat:res.latitude,
                    user_lng:res.longitude,
                 }
                 http.post({
                     url:api.apiGetFinishCheckBranch(),
                     data
                 }).then((res)=>{
                     if(res.status==0) {
                        let isShow = true;
                        let floor = '';
                        if(res.data.is_floor) {
                            isShow = false;
                            floor = '地面'
                        }
                        
                        _this.setData({
                            isShow:isShow,
                            floor:floor,
                            branch_addr:res.data.branch_addr,
                            branch_name:res.data.branch_name,
                            end_branch_id:res.data.branch_id,
                            pageIsShow:true
                        })
                        _this.isActive();
                        my.confirm({
                            content:'系统检测您当前位于'+res.data.branch_name+'，是否更改',
                            success:(bool)=>{
                                if(bool.confirm){
                                   _this.goReturnCarPage()
                                }
                            }
                        });
                        callback&&callback()
                     }else{
                         my.alert({
                            content:res.msg,
                            success:()=>{
                                my.navigateBack();
                            }
                         });
                     }
                 }).catch((err)=>{
                     console.log(err)
                 })
            }
        });    

    },
    returnBtn(e){
        let { floor,num,isActive,end_branch_id } = this.data;
        let { uuid, sign, longitude,latitude } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:latitude,
            user_lng:longitude,
            parking_floor:floor,
            end_branch_id:end_branch_id
        }
        if(num) {
            data.parking_no = num
        }
        let _this = this;
        if(isActive) {
            this.setData({
                showModal:true,
            })
            this.countTime()
            http.post({
                url:api.apiFinish(),
                data,
            }).then((res)=>{
                let status = res.status;
                switch(status) {
                    case 0://还车成功情况一：支付款为0去行程详情页
                    _this.setData({
                        status,
                        checkLight:false,
                        checkDoor:false,
                        checkAcc:false,
                        checkTrunk:false,
                    })
                    app.globalData.is_car_begin = ''
                    break;
                    case 1013://还车成功情况二：去支付
                    _this.setData({
                        status,
                        checkLight:false,
                        checkDoor:false,
                        checkAcc:false,
                        checkTrunk:false,
                    })
                    app.globalData.is_car_begin = ''
                    break;
                    case 2001://还车失败
                    _this.setData({
                        status,
                        carStatus:res.data,
                        checkLight:false,
                        checkDoor:false,
                        checkAcc:false,
                        checkTrunk:false,
                    })
                    break;
                    default:
                        my.showToast({
                          content:res.msg
                        });
                        _this.setData({
                            status:status,
                        })
                        _this.closeModal()
                }
                let { carStatus } = _this.data;
                if(carStatus.car_acc||carStatus.car_door||carStatus.car_light||carStatus.car_trunk) {
                    this.setData({
                        isShowComfirmBtn:true
                    })
                }else{
                    this.setData({
                        isShowComfirmBtn:false
                    })
                }
                
                setTimeout(()=>{
                    
                    switch(status) {
                        case 0://还车成功情况一：支付款为0去行程详情页
                        if(res.data.rental_no) {
                            my.redirectTo({
                                url: '/page/tripDetail/tripDetail?rental_no='+res.data.rental_no, 
                            });
                        }
                        app.globalData.is_car_begin = ''
                        break;
                        case 1013://还车成功情况二：确认订单
                        // console.log(res.data)
                        // if(res.data.km_info.match_0){
                        //     console.log(res.data)
                        //     my.redirectTo({
                        //         url: '/page/tripDetail/tripDetail?rental_no='+res.data.rental_no, 
                        //     });
                        //      console.log("over")
                        // }else{
                            if(res.data.rental_no) {
                                my.redirectTo({
                                    url: '/page/submitOrder/submitOrder?rental_no='+res.data.rental_no, 
                                });
                            }
                        // }
                        app.globalData.is_car_begin = ''
                        break;
                    }
                },2000)
        
            }).catch((err)=>{
                console.log(err)
            })
        }
        
    },
    isActive() {
        let { floor,end_branch_id,isShow,num } = this.data;
        if(isShow) {
            if(floor.length&&end_branch_id&&num) {
                this.setData({
                    isActive:true
                })
            }else{
                this.setData({
                    isActive:false
                })
            }
        }else{
            if(floor.length&&end_branch_id) {
                this.setData({
                    isActive:true
                })
            }else{
                this.setData({
                    isActive:false
                })
            }
        }  
    },
    checkModal(callback){
        let _this = this;
        setTimeout(()=>{
            this.setData({
                checkLight:false
            })
        },1000)
        setTimeout(()=>{
            this.setData({
                checkDoor:false
            })
        },2000)
        setTimeout(()=>{
            this.setData({
               checkAcc:false 
            })
        },3000)
        setTimeout(()=>{
            this.setData({ 
                checkTrunk:false
            })
        },4000)
        setTimeout(()=>{
            callback&&callback();
        },4500)
    },
    closeModal(){
        let carStatus = {
            "car_light": 0,
            "car_door": 0,
            "car_acc": 0,
            "car_trunk":0
        }
        this.setData({
            showModal:false,
            checkLight:true,
            checkDoor:true,
            checkAcc:true,
            checkTrunk:true,
            carStatus,
            isShowComfirmBtn:false
        })
    },
    countTime() {
        let num = 30;
        let _this = this;
        this.timer&&clearInterval(this.timer)
        this.timer = setInterval(()=>{
            num--;
            if(num==0) {
                clearInterval(_this.timer)
            }
            _this.setData({
                countDown:num
            })
        },1000)
    },
    onUnload() {
        this.timer&&clearInterval(this.timer)
    },
    goReturnCarPage() {
        let { info } = this.data;
        let pageParam = {
            name:info.begin_branch_name,
            id:info.begin_branch_id,
            isReturnCarPage:true
        }
        my.navigateTo({
            url: '/page/selectEndBranch/selectEndBranch?pageParam='+JSON.stringify(pageParam)
        })
    },
    showPicker() {
        like.showPicker();
    },
    hidePicker(e) {
        like.hidePicker();
    },
    onChangePicker(index) {
        let isShow = true
        if(index[0]==4){
            isShow = false
        }
        this.setData({
            floor:this.data.items[index[0]],
            index,
            isShow,
            num:''
        })
        this.isActive();
    }
})