<template>
    <div class="container">
        <TipListItem 
            :id="info.id"
            :plate_no="info.plate_no" 
            :vin="info.vin" 
            :status="info.car_status_name" 
            :model_name="info.model_name"
            :time="time"
            :branch="info.current_branch_name"
            :color="info.car_color"
            :parking_floor="info.current_parking_floor"
            :parking_no="info.current_parking_no"
        />
        <div class="cell" v-for="(item,index) in list" :key="index">
            <div>违章ID：{{item.id}}</div>
            <div>违章状态：{{item.peccancy_status_name}}</div>
        </div>
    </div>
</template>
<script>

import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'
import TipListItem from '../components/indexPageTipListItem.vue'

export default {
    name:'workList',
    components:{
        TipListItem
    },
    data(){
        return{
            id:'',
            car_id:'',
            time:'',
            info:{},
            list:[]
        }
    },
    created(){
        this.$showLoading('violation')
        this.id = this.$route.query.id
        this.car_id = this.$route.query.car_id
        this.time = this.$route.query.time
        Promise.all([this.getInfo(),this.getCarInfo()]).then(()=>{
            this.$hideLoading('violation')
        }).catch(err=>{
            console.log(err)
        })
    },
    methods:{
        getInfo(){
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                id:this.id
            }
            const _this = this;
            return http.post(api('/vehicle-examine/peccancy-list'),param)
            .then(res=>{
                if(res.status==0){
                    _this.list = res.data
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        getCarInfo(){
            let car_id = this.car_id
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                car_id
            }
            const _this = this;
            return http.post(api('/car/info'),param)
            .then(res=>{
                if(res.status==0){
                    _this.info = res.data
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        .cell{
            padding: .1rem .15rem;
            background: #fff;
            .fco(.12rem,#333);
            margin-bottom: .1rem;
            div{
                &:first-child{
                    margin-bottom: .05rem;
                }
            }
        }
    }
</style>


