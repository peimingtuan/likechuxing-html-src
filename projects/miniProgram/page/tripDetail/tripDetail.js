import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        longitude:0,
        latitude:0,
        markers:[],
        polyline:[],
        ctrl:[
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
        ],
        info:{},
        line:{},
        time:'',
        rental_no:'',
        rental_id:'',
        fee_total:'',
        pageIsShow:false
    },
    onLoad(query) {
        query.rental_no = query.rental_no;
        this.setData({
            rental_no:query.rental_no
        })
        this._getDetail();
        this._getTripDetail();  
        var pages = getCurrentPages()
        var prevPage = pages[pages.length-2]
        if(prevPage.data.pageName=='myTrip'){
            prevPage.setData({
                begin:0,
                list:[]
            })
            prevPage.getList()
        }
    },
    _getTripDetail(){
        let { rental_no }= this.data;
        let { uuid, sign } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            rental_no:rental_no
        }
        let _this = this;
        http.post({
            url:api.apiTripDetail(),
            data
        }).then((res)=>{
            console.log(res)
            if(res.status==0){
                let info = res.data;
                let time = utils.formatTime(info.total_time)
                _this.setData({
                    info:info,
                    h:time.hour,
                    m:time.minute,
                    time:_this.toTime(info.end_time),
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
        
    },
    _getDetail(){
        let { uuid, sign } = app.globalData;
        let { rental_no } = this.data;
        let data = {
            uuid:uuid,
            sign:sign,
            rental_no:rental_no
        }
        let _this = this;
        http.post({
            url:api.apiCarLine(),
            data
        }).then((res)=>{
            if(res.status==0) {
                let  start_point_lat = res.data.start_point_lat;
                let  start_point_lng = res.data.start_point_lng;
                let  end_point_lat = res.data.end_point_lat||app.globalData.latitude;
                let  end_point_lng = res.data.end_point_lng||app.globalData.longitude;

                let beginPoint = {};
                let endPoint = {};
                beginPoint.longitude = start_point_lng;
                beginPoint.latitude = start_point_lat;
                beginPoint.iconPath = '/image/qu.png';
                beginPoint.width = 36;
                beginPoint.height = 44;

                endPoint.longitude = end_point_lng;
                endPoint.latitude = end_point_lat;
                endPoint.iconPath = '/image/huan.png';
                endPoint.width = 36;
                endPoint.height = 44;
                
                let markers = [];
                markers.push(beginPoint);
                //路线

                let points = res.data.points
                if(points.length) {
                    for(let i = 0;i<points.length;i++) {
                        points[i].longitude = points[i].lng
                        points[i].latitude = points[i].lat
                    }
                }
                markers.push(endPoint);
                let polylineItem = {
                        points:points,
                        color:'#4A4F5EFF',
                        dottedLine:false,
                        width:4
                };
                let polyline = [];
                polyline.push(polylineItem);
                console.log(polyline)
                _this.setData({
                    line:res.data,
                    rental_id:res.data.rental_id,
                    longitude:start_point_lng,
                    latitude:start_point_lat,
                    markers:markers,
                    polyline:polyline,
                    fee_total:utils.switchNum(res.data.fee),
                })
            }
        }).catch((err)=>{
            console.log(err)
        })

    },
    _goCarImg() {//跳转验车单
        my.navigateTo({
            url:'/page/checkCarBeforeImg/checkCarBeforeImg?rental_id='+this.data.rental_id
        });
    },

    _goFeeDetail() {
        my.navigateTo({
            url:'/page/feeList/feeList?rental_no='+this.data.rental_no
        })
    },
    _goAppraise() {
        let data = this.data.line.comment
        if(data.has_commented==0){
            my.navigateTo({
                url:'/page/appraise/appraise?rental_no='+this.data.rental_no+'&data='+JSON.stringify(data)
            })            
        }else{
            my.navigateTo({
                url:'/page/reviews/reviews?data='+JSON.stringify(data)
            })  
        }
    },
    toTime(timestamp) {
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
    controlTap(e) {
        if(e.controlId==1) {
            my.navigateTo({
                url:'/page/profile/profile'
            })
        }
    },
    _goApp(){
        my.showToast({
          content:'请下载立刻出行APP查看详情'
        });
    }
})