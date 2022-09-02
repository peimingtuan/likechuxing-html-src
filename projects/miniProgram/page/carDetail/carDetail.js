import api from '../../common/api';

import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        info:{}
    },
    onLoad(options){
        let info = JSON.parse(options.info)||{};
        this.setData({
            info:info
        })
    }
})