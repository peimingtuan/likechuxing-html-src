import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        isEmpty:false,
        list:[],
        pageIsShow:false
    },
    onLoad() {
        var _this = this;
        http.post({
            url:api.apiBailHistory(),
            data:{
                uuid:app.globalData.uuid,
                sign:app.globalData.sign
            }
        }).then((res)=>{
            if(res.status===0) {
                if(res.data.length) {
                    let arr = res.data.slice();
                    arr.forEach((item)=>{
                        item.time = utils.toTime(item.time)
                    })
                    _this.setData({
                        list:arr,
                        pageIsShow:true
                    })
                }else{
                    _this.setData({
                        isEmpty:true,
                        pageIsShow:true
                    })
                }
            }
        }).catch((err)=>{
            console.log(err)
        })

    }
})