<template>
    <div class="container">
        <div class="header">
            <div class="header-item">
                <SelectItem :label="city" @click="showCityFilter"/>
            </div>
            <div class="header-item">
                <SelectItem :label="status" @click="showStatusFilter"/>
            </div>
        </div>
        <div class="title-wrap">
            <div class="title">
                <div class="title-txt">{{status}}月走势图</div>
                <div class="btn-wrap" @click="showMaxChart">
                    <div class="btn-txt">横屏</div>
                </div>
            </div>
            <div class="desc" @click="showDesc">
                <div>统计说明</div>
                <div class="icon"></div>
            </div>
        </div>
        <div class="chart-wrap" >
            <canvas id="chart"></canvas>
            <div class="numDesc" v-show="chartData.length">数量</div> 
        </div>
        <div>
            <Legend :list="legendItems" @changeLegend="changeLegend"/>
        </div>
        <div class="data-view">
            <DataView :list="dateList"/>
        </div>
        <ChartPreview :chartData="chartData" :legendIndex="legendIndex" :show="isShowMaxChart" @hideMaxChart="hideMaxChart" @maxChartChangeLegend="maxChartChangeLegend"/>
        <FilterBox :list="cityList" :show='isShowCityFilter' title="城市筛选" defaultValue="0" @hideFliterBox="hideCityFilter" @selectValue="getCity"/>
        <FilterBox :list="statusList" :show='isShowStatusFilter' title="类型筛选" defaultValue="0" @hideFliterBox="hideStatusFilter" @selectValue="getStatus"/>
        <StatisticsDesc :show="isShowDesc" @hideDesc="hideDesc"/>
    </div>
</template>
<script>
import Loading from './../../../component/loading'
import SelectItem from './components/selectItem.vue';
import StatisticsDesc from './components/desc.vue';
import FilterBox from './components/filterBox.vue';
import Legend from './components/legendGroup.vue'
import ChartPreview from './components/chartPreview.vue'
import DataView from './components/dataPreview.vue'
import http from './js/http'
import api from './js/api'
import F2 from './js/chart'
import tool from './js/tools'
export default {
    name:'appRoot',
    components:{
        SelectItem,
        Legend,
        ChartPreview,
        FilterBox,
        StatisticsDesc,
        DataView
    },
    data(){
        return {
            mobile:'',
            filterType:'',
            city:'',
            cityId:'',
            status:'',
            statusId:'',
            cityList:[],
            statusList:[],
            isShowCityFilter:false,
            isShowStatusFilter:false,
            legendItems:[],
            chartData:[],
            isShowMaxChart:false,
            isShowDesc:false,
            dateList:[],
            legendIndex:0
        }
    },
    created(){
        this.mobile = sessionStorage.getItem('mobile')
        this.initData();
        this.loaded= new Loading()
    },
    mounted(){
        const chartEl = document.getElementById('chart')
        chartEl.addEventListener('click',()=>{
            this.showMaxChart()
        })
    },
    methods:{
        drawChart(){
            let { chartData, filterType } = this;
            this.chart = F2.initChart({
                el:'chart',
                data:chartData,
                position:'date*value',
                filterType:filterType
            })
        },
        async initData(){
            await this.getCityList();
            
            this.getChartData()
        },
        getCityList(){
            
            const _this = this;
            return http.post(api('/work-order-count/acl-list'),{
                mobile:this.mobile
            })
            .then(res=>{
                if(res.status==0){
                    _this.cityList = tool.sortCity(res.data.cityList,'id');
                    _this.city = _this.cityList[0].name;
                    _this.cityId = _this.cityList[0].id
                    _this.statusList = tool.sortArrById(res.data.filterList,'id');
                    _this.status = _this.statusList[0].name;
                    _this.statusId = _this.statusList[0].id
                }
                
            }).catch(err=>{
                console.log(err)
            })
        },
        getChartData(){
            let { cityId, statusId, mobile } = this;
            let data = {
                mobile,
                city_id:cityId,
                type:statusId
            }
            const _this = this
            http.post(api('/work-order-count/index'),data)
            .then(res=>{
                console.log(res)
                if(res.status==0){
                    _this.chartData = tool.filterChartData(res.data.list,res.data.date)
                    _this.filterType = res.data.list[0].type
                    _this.dateList = tool.filterData(res.data.list,res.data.date)
                    if(_this.chart){
                        this.chart.filter('type',val=>{
                            return val=== _this.filterType
                        })
                        _this.chart.changeData( _this.chartData)
                    }else{
                         _this.drawChart()
                    }
                     _this.legendItems = tool.initLegendData(this.chart.getLegendItems().type)
                     this.loaded && this.loaded.destroy()
                }else{
                    console.log(res)
                }
                
            })
            .catch(err=>{
                console.log(err)
            })
        },
        showCityFilter(){
            this.isShowCityFilter = true
        },
        hideCityFilter(){
            this.isShowCityFilter = false
        },
        showStatusFilter(){
            this.isShowStatusFilter = true
        },
        hideStatusFilter(){
            this.isShowStatusFilter = false
        },
        getCity(index){
            this.city = this.cityList[index].name
            this.cityId = this.cityList[index].id
            this.getChartData()
        },
        getStatus(index){
            this.status = this.statusList[index].name
            this.statusId = this.statusList[index].id
            this.getChartData()
        },
        changeLegend(v){
            this.legendIndex = v
            let arr = this.legendItems.slice()
            arr = this.switchIcon(arr)
            arr[v].checked = true
            let item = arr[v]
            F2.initLegend(this.chart,item)
            
        },
        switchIcon(arr){
            return arr.map(item=>{
                item.checked = false
                return item
            })
        },
        maxChartChangeLegend(v){
            this.changeLegend(v)
        },
        showMaxChart(){
            this.isShowMaxChart = true;
        },
        hideMaxChart(){
            this.isShowMaxChart = false;
        },
        hideDesc(){
            this.isShowDesc = false
        },
        showDesc(){
            this.isShowDesc = true
        },
        destroyed(){
			this.loaded.destroy()//清除loading
		},
    }
}
</script>
<style lang="less">
    @import './css/common.less';
    .container{
        width:100%;
        min-height: 100vh;
        .header{
            height: .44rem;
            border-bottom: 1px solid #eaeaea;
            .fc();
            .header-item{
                flex:1;
                height: .44rem;
                .fc();
                &:first-child{
                    position: relative;
                    &::after{
                        content:'';
                        position: absolute;
                        right: 0;
                        top:.14rem;
                        width: 1px;
                        height: .16rem;
                        background: #eaeaea;
                    }
                }
            }
        }
        .title-wrap{
            padding: .13rem .15rem .14rem;
            .fb();
            .title{
                .fd();
                .title-txt{
                    .fco(.15rem,#333);
                    margin-right: .1rem;
                }
                .btn-wrap{
                   .wh(.38rem,.2rem);
                   background: #d8d8d8;
                   border-radius: 2px;
                   .fc();
                   .fco(.12rem,#5e5e5e)
                }
            }
            .desc{
                .fc();
                .fco(.14rem,#5e5e5e);
                .icon{
                    .wh(.15rem,.15rem);
                    background: url('./images/icon_desc.png') no-repeat;
                    background-size: 100% 100%;
                    margin-left: .09rem;
                }
            }
        }
        .chart-wrap{
            position: relative;
            #chart{
                width: 100%;
                height: 360px;
            }
            .numDesc{
                position: absolute;
                top:0;
                left: .22rem;
                .fco(.12rem,#333)
            }
        }
        
    }
    .loading_fe4e{
        background-color: hsla(0,0%,100%,.9)
    }
</style>


