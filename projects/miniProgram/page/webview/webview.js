import api from '../../common/api';
Page({
    data:{
        url:''
    },
    onLoad(query) {
        this.setData({
            url:api.apiWebviewUrl()+query.id
        })
    }
})