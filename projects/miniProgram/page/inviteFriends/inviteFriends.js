import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
let app = getApp();
Page({
    onShareAppMessage,
    data:{
        code:'',
        pageIsShow:false
    },
    onLoad() {
        this.getCode()
    },
    goInvitationRules(){
        my.navigateTo({
            url:'/page/invitationRules/invitationRules'
        });
    },
    getCode() {
        let { uuid,sign } = app.globalData;
        let _this = this;
        http.post({
            url:api.apiGetShareCode(),
            data:{
                uuid:uuid,
                sign:sign
            }
        }).then((res)=>{
            if(res.status==0) {
                _this.setData({
                    code:res.data.code,
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    copyCode() {
        my.setClipboard({
            text:this.data.code,
            success:()=>{
                my.alert({
                  content:'复制成功！'
                });
            }
        })
    },
    /*
    onShareAppMessage(ops) {
        if (ops.from === 'button') {
        // 来自页面内转发按钮
            console.log(ops.target)
        }
        return {
            title: 'XXX小程序',
            path: 'pages/index/index',
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function (res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }
    }
    */
})