import api from '../../common/api';
import http from '../../common/http';
import util from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        isEmpty:false,
        list:[],
        begin:0
    },
    onLoad() {
        this.getList(0);
        this.getList(1);
    },
    getList(type) {
        let self = this;
        http.post({
            url:api.apiGetCouponList(),
            data:{
                uuid:app.globalData.uuid,
                sign:app.globalData.sign,
                status:1,
                begin:self.data.begin,
                type:type,
                version:2,
            }
        }).then((res)=>{
            
            if(res.status===0) {
                if(res.data.length) {
                    let data =  self.filterData(res.data)
                    self.setData({
                        isEmpty:false,
                        list:self.newList(self.data.list.concat(data)),
                        begin:self.data.begin+10
                    })
                    console.log(self.data.list)

                }else {
                    if(self.data.begin==0) {
                        self.setData({
                            isEmpty:true,
                        })
                    } 
                }
              if (type == 0) {
                self.setData({ couponReady: true })
              } else if(type == 1){
                self.setData({ hongBaoReady: true })
              }
            }
        }).catch((err)=>{
            console.log(err);
        })
    },
    filterData(arr){
        if(!arr.length){
            return []
        }
        let res = arr.map(item=>{
            let resItem = {}
            resItem.name = item.name;
            resItem.case = item.instructions ;
            resItem.time = util.toDate(item.expire_start_time)+' - '+util.toDate(item.expire_end_time);
            resItem.money = parseInt(item.free_money);
            resItem.numCase = item.minimum;
            resItem.freeTime = parseInt(item.free_time/60);
            resItem.type = item.type;
            resItem.status = item.status;
            resItem.timeStart = item.expire_start_time;
            return resItem
        })
        return res
    },
   
    newList(list){
      list.sort((a,b)=>
        new Date(b.timeStart) - new Date(a.timeStart)
      )
      return list
    },
    onReachBottom() {
        this.getList();
        this.getList(1);
    },
    onUnload() {
        this.setData({
            begin:0
        })
    }
})