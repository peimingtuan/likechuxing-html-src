import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        amount:'',
        can_refund:'',
        openFree:'',
        pageIsShow:false
    },
    onLoad(query) {
        this.getBailInfo();
    },
    goAuthentication() {
        let { can_refund } = this.data;
        if(can_refund) {
            my.alert({
              content:'请去立刻出行app上进行退还保证金操作'
            });
        }
    },
    goBailRcord() {
        my.navigateTo({
            url:'../../page/bailRecording/bailRecording'
        });
    },
    getBailInfo() {
        let { uuid,sign,longitude,latitude,city_name,city_id } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:longitude,
            user_lng:latitude,
            city_id:city_id,
            city_name:city_name
        }
        let _this = this;
        http.post({
            url:api.apiQueryBail(),
            data:data
        }).then((res)=>{
            console.log(res)
            if(res.status===0) {
                let amount = parseFloat(res.data.deposit).toFixed(2)
                let arr = [];
                if(res.data.des){
                    arr = res.data.des.split('\n')
                }
                for(let i = 0;i<arr.length;i++){
                    if(i%2 !==0){
                        arr.splice(i,1)
                    }
                }
                _this.setData({
                    des:arr,
                    amount:amount,
                    openFree:res.data.tag,
                    can_refund:res.data.can_refund,
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    goIndex() {
        my.reLaunch({
            url: '/page/index/index',
            complete:()=>{
                app._getBaseInfo()
            }
        });
    },
    goBailDesc() {
        my.navigateTo({
            url:'/page/bailDesc/bailDesc'
        })
    },
    goDesc() {
        my.navigateTo({
            url:'/page/freeDesc/freeDesc'
        })
    },
})