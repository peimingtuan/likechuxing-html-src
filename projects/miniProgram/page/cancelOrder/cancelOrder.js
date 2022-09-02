import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        count:'',
        fee:'',
        checkList:[],
        select:[],
        text:'',
        isActive:false,
        pageIsShow:false
    },
    onLoad() {
        this.getList();
    },
    getList() {
        let { uuid,sign } = app.globalData;
        let _this = this;
        http.post({
            url:api.apiGetCancelList(),
            data:{
                uuid,
                sign
            }
        }).then((res)=>{
            console.log(res);
            if(res.status==0) {
                let list = res.data.reasons.slice();
                list.forEach((item)=>{
                    item.isChecked = false;
                })
                _this.setData({
                    count:res.data.count,
                    fee:res.data.fee,
                    checkList:list,
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    select(e) {
        var index = e.target.dataset.key;
        console.log(index)
        let checkList = this.data.checkList.slice();
        let select = this.data.select.slice();
        if(!checkList[index].isChecked) {
            select.push(checkList[index].id)
        }else{
            select.splice(select.indexOf(checkList[index].id),1)
        }
        checkList[index].isChecked = !checkList[index].isChecked;
        this.setData({
            checkList:checkList,
            select:select
        })
        this.ctrlBtn();
    },
    getText(e){
        if(!/^[ ]+$/.test(e.detail.value)) {
            this.setData({
                text:utils.trimStr(e.detail.value)
            })
            console.log(utils.trimStr(e.detail.value))
        }
        this.ctrlBtn();
    },
    ctrlBtn() {
        let { select,text } = this.data;
        if(select.length||text.length){
            this.setData({
                isActive:true
            })
        }else{
            this.setData({
                isActive:false
            })
        } 
    },
    post() {
        let { select,text,isActive } = this.data;
        let  { uuid,sign,longitude,latitude } = app.globalData;
        let str = '^'+select.toString().split(',').join('^')+'^';
        if(isActive) {
            my.showLoading({
              content:'取消中...'
            });
            let data = {
                uuid:uuid,
                sign:sign,
                user_lat:latitude,
                user_lng:longitude,
                reason_ids:str
            }
            if(text.length) {
                data.reason_des = text;
                console.log(data.reason_des.length)
            }
            http.post({
                url:api.apiCancelOrder(),
                data
            }).then((res)=>{
                my.hideLoading();
                if(res.status==0) {
                    my.showToast({
                        content:res.msg,
                        success: (res) => {
                            my.navigateBack({
                                delta:2
                            });
                            app.globalData.is_car_begin = ''
                        },
                    });
                }else if(res.status==1013){
                    my.reLaunch({
                      url: '/page/index/index',
                      complete:()=>{
                        app._getBaseInfo()
                      }
                    });
                    app.globalData.is_car_begin = ''
                }else{
                    my.showToast({
                        content:res.msg
                    });
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    },
    
})