import WxShare from '../../../../../other_modules/like-wxShare'
import env from '../../../../../other_modules/like-env'

let host = env.isProduction ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
  return new WxShare({
    title: '立刻出行优惠码，共享汽车免费开', // 分享标题
    desc: '立刻出行（LIKE）注册免费体验3小时30公里，喜欢你就立刻出发', // 分享描述
    link: window.location.href, // 分享链接
    imgUrl: 'https://' + host + '/app/inviteCode/share.png', // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      //window._czc.push(["_trackEvent",'activity','share','wx','success']);
    },
    cancel: function () {
      //window._czc.push(["_trackEvent",'activity','share','wx','cancel']);
    }
  })
}
