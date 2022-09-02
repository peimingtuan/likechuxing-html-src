<template>
    <div class="page">
        <div class="header">
            <div class="select-box">
                <SelectItem :label="city"  @click="openCityFliterBox" :mr="true"/>
                <SelectItem :label="status"  @click="openStatusFliterBox"/>
            </div>
            <div class="tab-box">
                <div class="item" :class="show?'on':''" @click="tab(1)">日线</div>
                <div class="item" :class="show?'':'on'" @click="tab(2)">月线</div>
            </div>
        </div>
        <div v-show="show">
            <DayChart :cityId="cityId" :statusId="statusId"/>
        </div>
        <div v-show="!show">
            <MonthChart :cityId="cityId" :statusId="statusId"/>
        </div>
        <FliterBox :list="cityList" defaultValue="0" :show="cityFliterBoxShow" title="城市"  @hideFliterBox="hideCityFliterBox" @selectValue="getCity"/>
        <FliterBox :list="statusList" defaultValue="0" :show="statusFliterBoxShow" title="状态"  @hideFliterBox="hideStatusFliterBox" @selectValue="getStatus"/>
    </div>
</template>
<script>

import DayChart from '../components/dayChart'
import MonthChart from '../components/monthChart'
import SelectItem from '../components/checkItem'
import FliterBox from '../components/fliterBox'
import tools from '../js/tools'
import http from '../js/myAjax/withAxiosV2'
import getApiUrl from '../js/getApiUrl';
export default {
    name:'historyData',
    components:{
        DayChart,
        MonthChart,
        SelectItem,
        FliterBox
    },
    data(){
        return{
            mobile:'',
            show:true,
            cityFliterBoxShow:false,
            statusFliterBoxShow:false,
            city:'北京',
            cityId:'',
            status:'空闲',
            statusId:'',
            cityList:[],
            statusList:[]
        }
    },
    created(){
        this.mobile = sessionStorage.getItem('mobile')
        this.getSelectList()
    },
    mounted(){
    },
    methods:{
        tab(v){
            if(v==1){
                this.show = true
            }else{
                this.show = false
            }
        },
        openCityFliterBox(){
            this.cityFliterBoxShow = true
        },
        openStatusFliterBox(){
            this.statusFliterBoxShow = true
        },
        hideCityFliterBox(){
            this.cityFliterBoxShow = false
        },
        hideStatusFliterBox(){
            this.statusFliterBoxShow = false
        },
        getCity(index){
            this.city = this.cityList[index].name
            this.cityId = this.cityList[index].id
        },
        getStatus(index){
            this.status = this.statusList[index].name
            this.statusId = this.statusList[index].id
        },
        getSelectList(){
            let data = {
               mobile:this.mobile
            }
            const _this = this;
            return http.post(getApiUrl('/statistics/status-list'),data).then(res=>{
                if(res.status == 0 ){
                    _this.cityList = tools.sortCity(res.data.city_list,'id');
                    _this.city = _this.cityList[0].name;
                    _this.cityId = _this.cityList[0].id
                    _this.statusList = tools.sortStatus(res.data.status_list,'id');
                    _this.status = _this.statusList[0].name;
                    _this.statusId = _this.statusList[0].id
                }
            }).catch(err=>{
                console.log(err)
            })
        },
    }
}
</script>
<style lang="less" scoped>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    .page{
        .header{
            display:flex;
            align-items: center;
            font-size: .14rem;
            height: .32rem;
            margin: .2rem auto;
            color: #878787;
            padding: .1rem;
            .select-box{
                flex:1;
                display:flex;
                align-items: center;
            }
            .tab-box{
                display:flex;
                justify-content: center;
                align-items: center;
                width:1.45rem;
                .item{
                    flex:1;
                    text-align: center;
                    line-height: .3rem;
                    border: 1px solid #ccc;
                    &:first-child{
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                        border-right: none;
                    }
                    &:last-child{
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                        border-left: none;
                    }
                    &.on{
                        background: #44a8ec;
                        color: #fff;
                        border: 1px solid #44a8ec;
                    }
                }
            }
        }
    }
</style>


