/**
 * Created by garvey on 2017/9/26.
 */
import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
import $ from 'jquery'
import myAjax from '../../../../component/myAjax'
import getApiUrl from '../../../../js/getApiUrl'
import Umeng from '../../../../component/umeng'
new Umeng(1273420001)
const host = env() === 'production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"
export default function () {
    return new WxShare({
        title: '是时候展现真正的共享奔驰了！', // 分享标题
        desc: '专属你的奔驰，点击免费领取', // 分享描述文案待定
        link: 'https://' + host + '/activity/freeGla/index.html', // 分享链接
        imgUrl: 'https://' + host + '/images/activity_freeGla/infoimage.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            myAjax.post(getApiUrl('activity/click-share-btn'), {
                phone_no: $("#phone").val(),
                source:'0'
            }, function (data) {

            })
            window._czc.push(["_trackEvent", 'activity', 'share', 'wx', 'success']);
        },
        cancel: function () {
            window._czc.push(["_trackEvent", 'activity', 'share', 'wx', 'cancel']);
        }
    })
}
