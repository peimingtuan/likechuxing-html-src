/**
 * Created by Administrator on 2018/2/11.
 */
require('../../../component/vconsole')
import env from '../../../../other_modules/like-env'
import resize from './js/resize'
resize();
window.onresize = function () {
    resize();
};
require('./css/public.css')
require('./css/invitationFriends.css')
import $ from 'jquery'
import getAppArguments from '../../../js/getAppArguments'
import toast from '../../../component/toast'
import myAjax from '../../../component/myAjax'
import getApiUrl from '../../../js/getApiUrl'
import AppMutual from '../../../component/AppMutual'
const appMutual = new AppMutual()
if(env.isAliPay){
    $('.bottom').remove()
}
//初始化加载图片
$(".banner img").attr("src",require("./images/info.png"));
$(".info-left img").attr("src",require("./images/wx.png"));
$(".info-right img").attr("src",require("./images/friend.png"));
//跳转邀请规则页面
$(".five").on("click",function(){
    window.location.href="./invitationRules.html"
});
let argument = getAppArguments()
if(argument.uuid !== '' && argument.sign !== ''){
    myAjax.post(getApiUrl('user/share-code'),{
        uuid:argument.uuid,
        sign:argument.sign
    },function (data){
        if(data.status !==0){
            toast(data.msg)
        }else{
            $('.four .span1').text(data.data.code)
        }
    })
}else{
    toast('请先登录App')
}

//分享微信好友
$(".info-left").on("click",function(){
    share('2')
});
//分享微信朋友圈
$(".info-right").on("click",function(){
    share('1')
});

function share(destination){
    let data = {
        share_type: '4',
        destination: destination
    }
    appMutual.shareWx(data)
}