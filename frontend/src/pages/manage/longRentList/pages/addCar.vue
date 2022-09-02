<template>
    <div class="container">
        <div class="header">
            <div>输入车牌号：</div>
            <div class="input-wrap">
                <input type="text" v-model="kw" @input="search">
            </div>
            <div class="clear-btn" v-show="isShowClearBtn" @click="clearInput"></div>
        </div>
        <div class="list" v-show="list.length">
            <div class="item" v-for="(item,index) in list" :key="index" @click="press(item)">{{item.plate_no}}</div>
        </div>
    </div>
</template>
<script>
import http from '../js/http'
import api from '../js/api'
import { Toast, MessageBox } from 'mint-ui'
import { mapMutations } from 'vuex'

export default {
    name:'addCar',
    data(){
        return  {
            kw:'',
            list:[]
        }
    },
    computed:{
        isShowClearBtn(){
            if(this.kw){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        ...mapMutations('workList',[
            'setTipListData'
        ]),
        search(){
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.postRequest()
            },200)
        },
        postRequest(){

            let mobile = sessionStorage.getItem('mobile')
            let kw = this.kw
            if(!kw){
                return
            }
            let data = {
                mobile,
                search_name:kw
            }
            const _this = this;
            http.post(api('/long-rental-car-prepare/search-car'),data).then(res=>{
                if(res.status===0){
                    _this.list = res.data
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        press(item){
            const  _this = this
            let str = '是否将 '+item.plate_no+' 添加到整备列表中？'
            MessageBox.confirm(str).then(res => {
               _this.add(item.plate_no)
            }).catch(err=>{
                console.log(err)
            })
        },
        add(plate_no){
            let mobile = sessionStorage.getItem('mobile')
            let data = {
                mobile,
                plate_no
            }
            const _this = this;
            http.post(api('/long-rental-car-prepare/add'),data).then(res=>{
                if(res.status===0){
                    _this.setTipListData({tipPage:0,tipListData:[],isNoMoreTipData:false})
                    _this.$router.go(-1)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        clearInput(){
            this.kw = ''
        }
    },
    destroyed(){
        this.timer && clearTimeout(this.timer)
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .12rem;
        .header{
            height: .54rem;
            background: #fff;
            padding: .1rem .15rem;
            .fd();
            .fco(.14rem,#333);
            .input-wrap{
                height: 100%;
                flex:1;
                input{
                    width: 100%;
                    height: 100%;
                    border: none;
                    .fco(.14rem,#333);
                }
            }
            .clear-btn{
                .wh(.3rem,.3rem);
                background: url('../images/icon_delete.png') no-repeat center center;
                background-size: 80% 80%;
            }
        }
        .list{
            padding: .15rem;
            background: #fff;
            .item{
                height: .3rem;
                .fd();
                .fco(.13rem,#333);
            }
        }
    }
</style>


