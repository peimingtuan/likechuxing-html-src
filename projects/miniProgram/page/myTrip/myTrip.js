import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    data:{
        begin:0,
        list:[],
        isEmpty:false,
        loading:false,
        pageName:'myTrip'
    },
    onShareAppMessage,
    onLoad(){
        this.getList()
    },
    getList() {
        let self = this;
        let { uuid,sign,city_id,longitude,latitude,city_name,sys_string } = app.globalData
        http.post({
            url:api.apiGetRentalList(),
            data:{
                uuid,
                sign,
                begin:self.data.begin,
                user_lat:latitude,
                user_lng:longitude,
                user_sys_version:sys_string,
                city_id,
                peccancy_status:0
            }
        }).then((res)=>{
            if(res.status===0) {
                if(res.data.length) {
                    self.setData({
                        isEmpty:false,
                        list:self.data.list.concat(res.data),
                        begin:self.data.begin+10,
                        loading:false
                    })
                }else {
                    if(self.data.begin==0) {
                        self.setData({
                            isEmpty:true,
                        })
                    } 
                    self.setData({
                        loading:false
                    })
                }
            }
        }).catch((err)=>{
            self.setData({
                loading:false
            })
            console.log(err)
        })

    },
    goDetail(e){
        let index = e.target.dataset.index;
        let rental_no = this.data.list[index].rental_no
        let item = this.data.list[index]
        let status = parseInt(item.status)
        switch(status){
            case 1:
                if(!app.globalData.is_car_begin){
                    my.navigateTo({
                        url:'/page/pickCarWaiting/pickCarWaiting'
                    });
                }else if(app.globalData.is_car_begin === 1){
                    my.navigateTo({
                        url:'/page/cuurentTrip/cuurentTrip'
                    });
                }  
                break;
            case 10:
                if(app.globalData.is_car_begin === 0){
                    my.navigateTo({
                        url:'/page/pickCarWaiting/pickCarWaiting'
                    });
                }else if(app.globalData.is_car_begin === 1){
                    my.navigateTo({
                        url:'/page/cuurentTrip/cuurentTrip'
                    });
                }
                break;
            case 15:
                my.navigateTo({
                    url:'/page/submitOrder/submitOrder?rental_no='+rental_no
                });
                break;
            case 16:
                my.navigateTo({
                    url:'/page/submitOrder/submitOrder?rental_no='+rental_no
                }); 
                break;
            case 21:
                my.navigateTo({
                    url:'/page/payOrder/payOrder?rental_no='+rental_no
                });
                break;
            case 22:
                my.navigateTo({
                    url:'/page/payOrder/payOrder?rental_no='+rental_no
                }); 
                break;  
            default:
                my.navigateTo({
                    url:'/page/tripDetail/tripDetail?rental_no='+rental_no
                });
                break;  
        }   
    },
    goApp(){
        my.showToast({
          content:'请下载立刻出行APP进行处理'
        });
    },
    onReachBottom() {
        this.setData({
            loading:true
        })
        this.getList();
    },
    onUnload(){
        app.event.offEvent('refreshMyTrip')
    }
})