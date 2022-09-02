import onShareAppMessage from '../../common/shareAppMessage';
Page({
    onShareAppMessage,
    data:{},
    callPhone() {
        my.makePhoneCall({
            number: '400-666-2333'
        });
    }
})