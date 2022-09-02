import WxShare from '../../../../../other_modules/like-wxShare'

export default function (data) {
  console.log(data)

  return new WxShare({
    title: data.title, // 分享标题
    desc: data.des, // 分享描述
    link: data.share_url, // 分享链接
    imgUrl: data.logo, // 分享图标
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
