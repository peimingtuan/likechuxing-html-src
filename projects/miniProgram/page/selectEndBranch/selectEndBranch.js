import api from '../../common/api';
import http from '../../common/http';
import filterBranch from '../../common/filterBranch';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        currentTime:0,
        scale:16,
        longitude:0,
        latitude:0,
        markers:[],
        controls:[
            {
                id:1,
                position:{
                    left:337,
                    top:660,
                    width:44,
                    height:44,
                },
                iconPath:'/image/resetBtn.png',
                clickable: true
            },
            {
                id: 2,
                position: {
                    left: 171.5,
                    top: 171,
                    width: 32,
                    height: 52,
                },
                iconPath: '/image/center.png',
                clickable: true
            }
        ],
        show:false,
        returnAddress:'',
        returnName:'还车点',
        num:0,
        id:'',
        pageParam:'',
        pageIsShow:false,
        isUpdate:true,
    },
    onLoad(query) {
        this.setData({
            pageParam:query.pageParam
        })
        this._getBranchList();//获取附近网点
    },
    onReady() {
        this.mapCtx = my.createMapContext('map');//获取地图el
        setTimeout(()=>{
            this._setRetBtnPosition(65);
        },200)
    },
    regionChange(e) {
        if (e.type === 'end' ){
            let { markers }  = this.data
            this.setData({
                scale:e.scale,
                latitude:e.latitude,
                longitude:e.longitude,
                markers
            })
                     
        }
    },
    _setMapCenter() {//设置地图定位点
        return new Promise((resolve,reject)=>{
            my.getLocation({
                success:(res)=>{
                    this.setData({
                        longitude:res.longitude,
                        latitude:res.latitude
                    })
                    resolve(res)
                },
                fail:err=>{
                    reject(err)
                }
            }); 
        })    
    },
    _getBranchList(callback) {//获取网点列表
        this._setMapCenter().then(location=>{
            let self = this;
            let { sys_string, city_id } = app.globalData;
            let data = {
                lng:location.longitude,
                lat:location.latitude,
                city_id:city_id,
                user_sys_version:sys_string,
                from:3,
                is_limit:0,
                branch_id:JSON.parse(this.data.pageParam).id
            }
            http.post({
                url:api.apiGetNearbyBranch(),
                data
            }).then((res)=>{
                if(res.status==0) {
                    let arr = res.data;
                    if(arr.length) {
                        for(let i =0 ;i<arr.length;i++){
                            arr[i].latitude = arr[i].lat;
                            arr[i].area = "1"
                            arr[i].longitude = arr[i].lng;
                            arr[i].drive_overall_view = "sadad"
                            arr[i].max_remain_km = 0,
                            arr[i].walk_overall_view="aaaa"
                            arr[i].walk_remark="ssss"
                            arr[i].unzoned = '1'
                            if(arr[i].car_cnt>8) {
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
                        self.setData({
                            markers:arr,
                            pageIsShow:true
                        })
                        callback&&callback()
                    }else{
                        self.setData({
                            pageIsShow:true
                        })
                    }
                }else{
                    self.setData({
                        pageIsShow:true
                    })
                    my.showToast({
                      content:res.msg
                    });
                }
            }).catch((err)=>{
                self.setData({
                    pageIsShow:true
                })
                console.log(err)
            })
        }).catch(err=>{

        })
        
    },
    _setRetBtnPosition(height) {//设置回到定位点按钮的位置
        var _this  = this;
        my.createSelectorQuery()
        .selectViewport().boundingClientRect()
        .exec((res)=>{
            let controls = _this.data.controls;
            controls[0].position.left = res[0].width - 55;
            controls[0].position.top = res[0].height-height- 110;
            controls[1].position.left = res[0].width/2 -16;
            controls[1].position.top = (res[0].height-height- 56)/2-52;
            _this.setData({
                controls:controls
            })
        })
    },

    onMarkerTap(e) {
        this.switchIcon(e.markerId);
        this._getBranchName(e.markerId,this._showView());
    },
    switchIcon(id) {

        let arr = this.data.markers;
        for (let i = 0; i < arr.length; i++) {
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
            markers: arr
        })
    },
    pressMap() {
        this._hiddenView()
        this.switchIcon('')
    },
    _showView() {
        this.setData({
            show:true
        })
        this._setRetBtnPosition(146);
    },
    _hiddenView() {

        this.setData({
            show:false
        })
        this._setRetBtnPosition(65);
    },
    controltap(e) {
        if(e.controlId==1) {
            this.mapCtx.moveToLocation();
        }
    },
    _getBranchName(id,callback) {
        let self = this;
        let arr = this.data.markers.slice();
        for(let i = 0 ;i<arr.length;i++){
            if(arr[i].id==id){
                self.setData({
                    id:id,
                    returnName:arr[i].name,
                    returnAddress:arr[i].address,
                    num:arr[i].parking_fee_in
                })
            }
        }
        callback&&callback();
    },
    getReturnCarDot() {
        
        let { returnAddress,id,num,returnName } = this.data;
        let pageNode = getCurrentPages();
        let prevPage = pageNode[pageNode.length-2];
        this.upDateReturnAddr(id).then((res)=>{
            if(res.status==0) {
                prevPage.setData({
                    floor:'',
                    num:'',
                    isShow:true,
                    isActive:false,
                    isUpdateEndBranch:true
                })
                prevPage.getStartBranch().then(()=>{
                    my.navigateBack()
                }) 
            }
        }).catch((err)=>{
            console.log(err)
        })
        if(prevPage.currentPage) {
            prevPage._setRetBtnPosition(260);
        }
        
    },
    upDateReturnAddr(id) {//修改还车网点
        let { uuid ,sign } = app.globalData;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiUpdateReturnAddr(),
                data:{
                    uuid,
                    sign,
                    end_branch_id:id
                }
            }).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                reject(err)
            })
        })
        return p;
    }
})