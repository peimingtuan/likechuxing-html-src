import api from '../../common/api';
import uploadFile from '../../common/uploadFile';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        driverLicense:'/image/driverLicense.png',//驾驶证照片
        IDcardImage:'/image/shenfen.png',//身份证正面照
        handelIDcardImage:'',//手持身份证照片
        isChoose1:false,//驾驶证是否已拍
        isChoose2:false,//身份证是否已拍
        isChoose3:false,//手持身份证是否已拍,
        pass:false//是否全部拍摄完毕
    },
    chooseDriverLicense() {
        let self = this;
        my.chooseImage({
            count:1,
            success:(res)=>{
            console.log(res.apFilePaths[0])

                self.setData({
                    driverLicense:res.apFilePaths[0],
                    isChoose1:true
                })
                self.verifyIsChooseImage();
            }
        })
    },
    chooseIDcardImg() {
        let self = this;
        my.chooseImage({
            count:1,
            success:(res)=>{
                self.setData({
                    IDcardImage:res.apFilePaths[0],
                    isChoose2:true
                })
                self.verifyIsChooseImage();
            }
        })
    },
    chooseHandleIDcardImg() {
        let self = this;
       my.chooseImage({
            count:1,
            success:(res)=>{
                self.setData({
                   handelIDcardImage:res.apFilePaths[0],
                   isChoose3:true
                })
                self.verifyIsChooseImage();
            }
        }) 
    },
    verifyIsChooseImage(){
        if(this.data.isChoose1&&this.data.isChoose2&&this.data.isChoose3) {
            this.setData({
                pass:true
            })
        }else{
            this.setData({
                pass:false
            })
        }
    },
    postImage(filename) {
        let self = this;
        let { isChoose1, isChoose2, isChoose3, driverLicense ,IDcardImage ,handelIDcardImage } = this.data;
        if(isChoose1&&isChoose2&&isChoose3){
            this.uploadImg(driverLicense,'file1',()=>{
                this.uploadImg(IDcardImage,'file2',()=>{
                    this.uploadImg(handelIDcardImage,'file3',(res)=>{  
                        console.log(JSON.stringify(res))
                        if(res.status===0) {
                            // self.updateProfile();
                            my.reLaunch({
                                url: '/page/index/index',
                                complete:()=>{
                                    app._getBaseInfo()
                                }
                            });
                        }
                    })
                })
            })
        }
            
    },
    uploadImg(file,filename,callback) {
    
        uploadFile.post(
            api.apiUploadLicenseImage(),
            file,
            filename,
            'image',
            {
                uuid:app.globalData.uuid,
                sign:app.globalData.sign,
                from:3
            },
            (res)=>{
                console.log(res);
                if(res.status===0) {
                    callback(res);
                }else{
                    my.showToast({
                      content:res.msg
                    });
                }
                
            }
        )
    },
    updateProfile() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length-2];
        if(prevPage.data.profilePage) {
            prevPage.getProfile(()=>{
                my.redirectTo({
                    url: '/page/certification/certification?status=1'
                });
            })
        }else{
            my.redirectTo({
                url: '/page/certification/certification?status=1'
            });
        }
    }
})