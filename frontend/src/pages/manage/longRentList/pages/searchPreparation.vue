<template>
    <div class="container">
        <div class="header">
            <div class="input-wrap">
                <div class="icon_search"></div>
                <input type="text" v-model="kw" @input="search" placeholder="请输入车牌号">
                <div class="clear-btn" v-show="isShowClearBtn" @click="clearInput"></div>
            </div>
            <div class="cancel" @click="goback">取消</div>
        </div>
        <div class="list" v-show="list.length">
            <div class="item" v-for="(item,index) in list" :key="index" @click="press(item)">{{item}}</div>
        </div>
    </div>
</template>
<script>
import http from '../js/http'
import api from '../js/api'
import { Toast, MessageBox } from 'mint-ui'

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
        search(){
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.postRequest()
            },200)
        },
        postRequest(){

            let mobile = sessionStorage.getItem('mobile')
            let { kw }= this
            if(!kw){
                return
            }
            let data = {
                mobile,
                search_name:kw
            }
            const _this = this;
            http.post(api('/long-rental-car-prepare/search'),data).then(res=>{
                if(res.status===0){
                    _this.list = res.data
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        press(v){
            window.location.href = './../manageOrderCardetail/index.html?plate_no='+v
        },
        goback(){
            this.$router.go(-1);
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
                position: relative;
                input{
                    width: 100%;
                    height: 100%;
                    border: none;
                    .fco(.14rem,#333);
                    border-radius: 18px;
                    background: #f6f6f6;
                    padding-left: .375rem;
                }
                .icon_search{
                    width:.12rem;
                    height: .12rem;
                    position: absolute;
                    left: .12rem;
                    top:50%;
                    margin-top: -.06rem;
                    background: url('../images/icon_search.png') no-repeat;
                    background-size:100% 100%;
                }
            }
            .clear-btn{
                position: absolute;
                top:50%;
                right: .07rem;
                margin-top: -.15rem;
                .wh(.3rem,.3rem);
                background: url('../images/icon_delete.png') no-repeat center center;
                background-size: 80% 80%;
            }
            .cancel{
                margin-left: .09rem;
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


