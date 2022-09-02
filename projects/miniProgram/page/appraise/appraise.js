import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        list1:[],
        list2:[],
        current:1,
        rental_no:''
    },
    onLoad(query) {
        this.setData({
            rental_no:query.rental_no
        })
        this.getList(query)
    },
    tabBtn(e) {
        let index = parseInt(e.target.dataset.index);
        this.setData({
            current:index
        })
        if(index==1) {
            let list = this.data.list2.slice();
            list.forEach((item)=>{
                item.checked = false;
            })
            this.setData({
                list2:list
            })
        }else{
            let list = this.data.list1.slice();
            list.forEach((item)=>{
                item.checked = false;
            })
            this.setData({
                list1:list
            })
        }
    },
    getList(query) {
        let data = JSON.parse(query.data)
        let list1 = this.initList(data.positive_list)
        let list2 = this.initList(data.negative_list)
        this.setData({
            list1,
            list2
        })
    },
    initList(json){
        let arr = Object.keys(json).map(key=>{
            let item = {}
            item.id = key;
            item.des = json[key];
            item.checked = false;
            return item
        })
        return arr
    },
    select(e) {
        let index = e.target.dataset.index;
        let { current } = this.data;
        if(current==1) {
            let list = this.data.list1.slice();
            list[index].checked = !list[index].checked;
            this.setData({
                list1:list
            })
        }else{
            let list = this.data.list2.slice();
            list[index].checked = !list[index].checked;
            this.setData({
                list2:list
            })
        }
    },
    postData() {
        let arr = [];
        let type;
        let str;
        let { current } = this.data;
        if(current==1) {
            type = 0;
            this.data.list1.forEach((item)=>{
                if(item.checked) {
                    arr.push(item.id)
                }
            })
        }else{
            type = 1;
            this.data.list2.forEach((item)=>{
                if(item.checked) {
                    arr.push(item.id)
                }
            })
        }
        if(arr.length) {
            str = '^'+arr.toString().split(',').join('^')+'^';
        }else{
            str = '';
        }
        my.showToast({
            content:'提交中...'
        })
        let { uuid,sign } = app.globalData;
        http.post({
            url:api.apiComment(),
            data:{
                uuid:uuid,
                sign:sign,
                type:type,
                ids:str,
                rental_no:this.data.rental_no
            }
        }).then((res)=>{
            my.hideLoading()
            if(res.status==0) {
                my.reLaunch({
                    url: '/page/index/index',
                    complete:()=>{
                        app._getBaseInfo()
                    }
                });
            }
        }).catch((err)=>{
            my.hideLoading()
            console.log(err)
        })
    }
})