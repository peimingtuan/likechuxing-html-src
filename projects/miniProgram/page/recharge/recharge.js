import api from '../../common/api';
import http from '../../common/http';
import htmlParser from '../../common/htmlParser';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    data:{
        list:[],
        info:{},
        pageIsShow:false,
        charge_remain_day:''
    },
    onLoad(query){
        this.getDesc()
    },
    onShareAppMessage,
    getDesc(){
        let self = this;
        let { uuid, sign } = app.globalData;
        let data = {
            uuid,
            sign
        }
        http.post({
            url:api.apiGetChargeInfo(),
            data
        }).then(res=>{
            if(res.status==0){
                let arr = self.filterData(res.data.charge)
                console.log(arr)
                let selectItem = {}
                arr.map(item=>{
                    if(item.selected){
                        selectItem = item
                    }
                })
                self.setData({
                    list:arr,
                    info:selectItem,
                    charge_remain_day:res.data.charge_remain_day,
                    pageIsShow:true
                })
            }
        })
    },
    selectType(e){
        let index = e.target.dataset.index;
        let list = this.data.list.slice();
        list.map(item=>{
            item.selected = 0;
        })
        list[index].selected = 1
        this.setData({
            list,
            info:list[index]
        })
    },
    recharge(){
        let num = this.data.info.money;
        let _this = this;
        this.getPayStr().then((str)=>{
            if(str!='') {
                my.tradePay({
                    orderStr:str,
                    success: (res) => {
                        if(res.resultCode==9000) {
                            app.event.emitEvent('rechargeSuccess') 
                            my.redirectTo({
                                url: '/page/rechargeSuccess/rechargeSuccess?num='+num
                            });
                        }
                    }
                });
            }
        }).catch((err)=>{
            console.log(err);
        })
    },
    getPayStr() { //获取支付字符串;
        let num = this.data.info.money;
        let { city_id, uuid, sign } = app.globalData;
        var self = this ;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetAlipayStr(),
                data:{
                    type:2,
                    methond:1,
                    money:num,
                    city_id:city_id,
                    sign:sign,
                    uuid:uuid
                }
            }).then((res)=>{
                if(res.status===0) {
                    resolve(res.data.alipay_str)
                }else{
                    reject(res.msg)
                }
            }).catch((err)=>{
                console.log(err)
            })
        })
        return p;
    },
    getDesStr(str){
        const desReg = />(\S*)</;
        let color = str.substr(str.indexOf('#'),7)
        let des = str.match(desReg)[1]||''
        return {
            color,
            des
        }
    },
    filterData(arr){
        let res = arr.map(item=>{
            let list = item.info.list.split('<br/>')
            let listRes = []
            let itemList  = []
            list.map(i=>{
                listRes.push(this.htmlToJson(i))
            })
            itemList.push(listRes)
            item.color = this.getDesStr(item.des).color;
            item.desc = this.getDesStr(item.des).des;
            item.list = itemList;
            return item
        })
        return res
    },
    htmlToJson(str){
        // let str = "那些<font color='#ED3800 '>首送100礼包</font>a<font color='#ED3800 '>首充送100礼包</font>年轻"
        let chars = []
        let charsRes = []
        let color = []
        let colorRes = []
        let res = []
        htmlParser(str,{
            start:function(tag,attrs,unary){
                color.push(attrs[0].value)
            },
            chars:function(text){
                chars.push(text)
            }
        })
        chars.map(i=>{
            let item = {};
            item.type = 'chars'
            item.des = i
            if(charsRes.length){
                item.index = str.indexOf(i,charsRes[charsRes.length-1].index+1)
            }else{
                item.index = str.indexOf(i)
            }
            charsRes.push(item)
        })
        color.map(i=>{
            let item = {};
            item.type = 'color'
            item.des = i
            if(colorRes.length){
                item.index = str.indexOf(i,colorRes[colorRes.length-1].index+1)
            }else{
                item.index = str.indexOf(i)
            }
            colorRes.push(item)
        })
        res = colorRes.concat(charsRes)
        res.sort(function(m,n){
            return m.index - n.index
        })
        res.map((item,index)=>{
            if(item.type=='color'){
                res[index+1].color = item.des
                res.splice(index,1)
            }
        })
        return res
    }
})