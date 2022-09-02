import api from '../../common/api';
import uploadFile from '../../common/uploadFile';
import onShareAppMessage from '../../common/shareAppMessage';
import utils from '../../common/utils';
import http from '../../common/http';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        list:[],
        rental_id:'',
        num:10,
        successNum:0,
        parts:[],
        maskShow:false
    },
    onLoad(query) {
        var arr = query.select.split(',');
        this.setData({
            rental_id:query.rental_id,
            parts:arr
        })
    },
    _getImgBtn() {
        let arr = this.data.list.slice()
        my.chooseImage({
            count:1,
            sourceType:['camera'],
            success:(res)=>{
                console.log(res);
                arr = arr.concat(res.apFilePaths);
                this.setData({
                    list:arr
                })
                console.log('选择完毕')
            },
            fail:(err)=>{
                if(err.error==2001) {
                    my.confirm({
                        content:'请在右上角中的“关于-设置”中开启相机权限',
                    });
                    my.showAuthGuide({ 
                        authType: 'CAMERA' 
                    });
                }
            }
        });
    },
    _uploadImg(file,filename,key) {
        let { uuid ,sign ,city_id } = app.globalData;
        let { rental_id,successNum } = this.data;
        let data = {
            uuid:uuid,
            sign:sign,
            city_id:city_id,
            rental_id:rental_id,
            behavior:'pre',
            key:key,
            from:2
        }
        let self = this;
        let p = new Promise((resolve,reject)=>{
                uploadFile.post(
                    api.apiUploadCarImg(),
                    file,
                    filename,
                    'image',
                    data,
                    (res)=>{
                        console.log(res);
                        if(res.status==0) {
                            console.log('第'+key+'张上传成功')
                            resolve(res)
                        }else{
                            reject(res.msg)
                        }
                        
                    }
                )
        })
        return p;
    },
    _sendImg(list) {
        let arr = list.slice();
        let item = arr[0]
        let successNum = this.data.successNum;
        let _this = this;
        if(arr.length) {
            _this._uploadImg(item,'file',successNum)
            .then((res)=>{
                if(res.status==0) {
                    successNum++;
                    _this.setData({
                        successNum
                    })
                    arr.splice(0,1);
                    _this._sendImg(arr);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }else{
            console.log('上传完了')
            _this.uploadParts(()=>{
                _this._openDoor()
            })
        }
    },
    _postImg(e) {
        let { list ,num } = this.data;
        let _this = this;
        let eventArr = [];
        if(list.length>0) {
            this.setData({
                maskShow:true
            })
            this._sendImg(list)

        }else{
            my.showToast({
              content:'请拍摄足够的照片'
            });
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
                my.showToast({
                    content:'上传成功，即将跳转···',
                    success:()=>{
                        my.reLaunch({
                            url:'/page/index/index',
                            complete:()=>{
                                app._getBaseInfo()
                            }
                        });  
                    }
                })
            }else{
                my.showToast({
                  content:res.msg
                });
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    _deleteImg(e) {
        console.log(e)
        let index = e.target.dataset.index;
        let arr = this.data.list.slice();
        arr.splice(index,1);
        this.setData({
            list:arr
        })
    },
    uploadParts(callback) {
        let { uuid,sign } = app.globalData;
        let { rental_id,parts } = this.data;
        let str = '^'+parts.toString().split(',').join('^')+'^'
        let data = {
            uuid:uuid,
            sign:sign,
            rental_id:rental_id,
            parts:str
        }
        http.post({
            url:api.apiUploadCarBeforeParts(),
            data
        }).then((res)=>{
            callback&&callback(res)
        }).catch((err)=>{
            console.log(err)
        })

    }
})