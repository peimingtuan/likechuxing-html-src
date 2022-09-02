import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        list:[],
        rental_no:'',
        type:''
    },
    onLoad(query) {
        this.getList(query)
    },
    getList(query) {
        let data = JSON.parse(query.data)
        if(data.type==0){
            let  list = this.initList(data.positive_list,data.commented_list)
            let arr = this.select(data.commented_list,list)
            this.setData({
                list:arr,
                type:data.type
            })
        }else{
            let  list = this.initList(data.negative_list,data.commented_list)
            let arr = this.select(data.commented_list,list)
            this.setData({
                list:arr,
                type:data.type
            })
        }
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
    select(arr1,arr2){
        let arr = arr1.map(item=>{
            return item.id
        })
        for(let i = 0;i<arr2.length;i++){
            let index = arr.indexOf(arr2[i].id)
            if(index!=-1){
                arr2[i].checked = true
            }
        }
        return arr2
    }
})