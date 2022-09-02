import onShareAppMessage from '../../common/shareAppMessage';
Page({
    onShareAppMessage,
    data:{
        animationInfo: {}
    },
    onLoad() {

    },
    report() {
        my.navigateTo({
            url:'/page/incidentReport/incidentReport'
        });
    }
})
