import api from '../../common/api';
import utils from '../../common/utils';
import http from '../../common/http';
var app = getApp();
Page({
    data:{
        imgList:[
            {
                class:"area1",
                isShow:false
            },
            {
                class:"area7",
                isShow:false 
            },
            {
                class:"area14",
                isShow:false 
            },
            {
                class:"area15",
                isShow:false 
            },
            {
                class:"area16",
                isShow:false 
            },
            {
                class:"area17",
                isShow:false 
            },
            {
                class:"area18",
                isShow:false 
            },
            {
                class:"area19",
                isShow:false 
            },
            {
                class:"area5",
                isShow:false 
            },
            {
                class:"area13",
                isShow:false 
            },
            {
                class:"area12",
                isShow:false 
            },
            {
                class:"area11",
                isShow:false 
            },
            {
                class:"area10",
                isShow:false 
            },
            {
                class:"area9",
                isShow:false 
            },
            {
                class:"area8",
                isShow:false 
            },
            {
                class:"area6",
                isShow:false 
            },
            {
                class:"area2",
                isShow:false 
            },
            {
                class:"area3",
                isShow:false 
            },
            {
                class:"area4",
                isShow:false 
            }
        ],
        areaList:[
            {
                id:1,
                class:'handleArea1'
            },
            {
                id:2,
                class:'handleArea7'
            },
            {
                id:3,
                class:'handleArea14'
            },
            {
                id:4,
                class:'handleArea15'
            },
            {
                id:5,
                class:'handleArea16'
            },
            {
                id:6,
                class:'handleArea17'
            },
            {
                id:7,
                class:'handleArea18'
            },
            {
                id:8,
                class:'handleArea19'
            },
            {
                id:9,
                class:'handleArea5'
            },
            {
                id:10,
                class:'handleArea13'
            },
            {
                id:11,
                class:'handleArea12'
            },
            {
                id:12,
                class:'handleArea11'
            },
            {
                id:13,
                class:'handleArea10'
            },
            {
                id:14,
                class:'handleArea9'
            },
            {
                id:15,
                class:'handleArea8'
            },
            {
                id:16,
                class:'handleArea6'
            },
            {
                id:17,
                class:'handleArea2'
            },
            {
                id:18,
                class:'handleArea3'
            },
            {
                id:19,
                class:'handleArea4'
            }    
        ],
        labelList:[
            {
                id:16,
                class:'handleArea6label'
            },
            {
                id:2,
                class:'handleArea7label'
            },
            {
                id:15,
                class:'handleArea8label'
            },
            {
                id:10,
                class:'handleArea13label'
            },
            {
                id:3,
                class:'handleArea14label'
            },
            {
                id:8,
                class:'handleArea19label'
            }
        ],
        btnText:"外观无伤，跳过",
        isHas:false,
        rental_id:'',
        select:[],
        canClick:true
    },
    onLoad(query) {
        this.setData({
            rental_id:query.rental_id
        })
    },
    handle(e) {
        console.log(e)
        let index = e.target.id - 1;
        console.log('part',index)
        let arr = this.data.imgList;
        arr[index].isShow = !arr[index].isShow;
        this.setData({
            imgList:arr
        })
        this.select();
    },
    handleExtra(e) {
        console.log(e)
        let index = e.target.dataset.id - 1;
        let arr = this.data.imgList;
        arr[index].isShow = !arr[index].isShow;
        this.setData({
            imgList:arr
        })
        this.select();
    },
    select() {
        let arr = this.data.imgList;
        console.log(arr)
        let selectArr = [];
        for(let i = 0;i<arr.length;i++) {
            if(arr[i].isShow) {
                selectArr.push(i+1)
            }
        }
        if(selectArr.length) {
            this.setData({
                btnText:'外观有伤，上传照片',
                isHas:true,
                select:selectArr
            })
        }else{
            this.setData({
                isHas:false,
                btnText:'外观无伤，跳过',
                select:[]
            })
        }
    },
    _handleBtn() {
        let { canClick } = this.data;
        if(this.data.isHas) {
            if(canClick){
                my.navigateTo({
                    url:'/page/uploadCarInjuryImg/uploadCarInjuryImg?rental_id='+this.data.rental_id+'&select='+this.data.select.toString()
                });      
            }
        }else{
            this.setData({
                canClick:false
            })
            this._openDoor();
        }
    },
    _openDoor(){
        
        let { uuid , sign , latitude , longitude ,city_id,sys_string } = app.globalData
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:latitude,
            user_lng:longitude,
            city_id:city_id,
            user_sys_version:sys_string
        }
        let _this = this;
        http.post({
            url:api.apiOpenDoor(),
            data,
        }).then((res)=>{
        
            if(res.status==0) {
                my.redirectTo({
                    url:'/page/cuurentTrip/cuurentTrip',
                    success:()=>{
                        _this.setData({
                            canClick:true
                        })
                    }
                });
                app.globalData.is_car_begin = 1
            }else{
                my.showToast({
                  content:res.msg,
                  success:()=>{
                        _this.setData({
                            canClick:true
                        })
                    }
                });
            }
        }).catch((err)=>{
            console.log(err)
            _this.setData({
                canClick:true
            })
        })
    },
    goLicence() {
        my.navigateTo({
            url:'/page/license/license'
        });
    },
    onUnload(){
        let arr =  this.data.imgList.slice();
        arr.forEach((item)=>{
            item.isShow = false;
        })
        this.setData({
            imgList:arr
        })
    }
})