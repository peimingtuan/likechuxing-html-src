<template>
    <div class="container" >
        <SelectBox type="userChart" @upDateData="upDateData" :cityList="cityList" :channelList="channelList"/>
        <div class="chart-wrap">
            <div class="chart" ref="chart"></div>
            <div class="loading" v-show="showLoading">加载中···</div>
        </div>
    </div>
</template>

<script>
    import like from '../js/chart.js'
    import tool from '../js/tools.js'
    import SelectBox from '../components/selectBox.vue'
    import { getAdminUrl } from "../../../../../other_modules/url-constructor/index";
    import http from "../../../../../other_modules/like-request/withAxiosV2";
    export default{
        name:'channelChart',
        components:{
            SelectBox
        },
        data(){
            return{
                uuid:'',
                sign:'',
                startDate:'',
                endDate:'',
                cityName:'',
                legendData:[],
                yData:[],
                cityList:[],
                channelList:[],
                showLoading:true
            }
        },
        created(){
            //let res = tool.getUrlQuery(window.location.href);
            let res = tool.getCookieQuery()
            this.uuid = res.query.uuid;
            this.sign = res.query.sign;
            const selectDataList = JSON.parse(localStorage.getItem('selectDataList'));
            this.cityList = selectDataList.city;
            this.channelList = selectDataList.channel;
        },
        async mounted(){
            await this.getChartData()
            let { legendData, yData } = this;
            let el = this.$refs.chart;
            this.chart = like.initFunnel({
                el,
                legendData,
                yData
            });
        },
        methods:{
            getChartData(){
                let { uuid, sign, startDate, endDate, cityName } = this;
                let data = {
                    cityName,
                    startDate,
                    endDate,
                    uuid,
                    sign
                }
                const _this = this;
                return http.post(getAdminUrl('bi/day-transfer'),tool.filterJson(data)).then((res)=>{
                    if(res.status==0){
                        _this.legendData = tool.fliterFunnelData(res.data)
                        _this.yData = res.data
                        _this.showLoading = false;
                    }else{
                        Toast(res.msg)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            upDateData(param){
                let { uuid, sign, startDate, endDate, cityName } = this;
                let data = {
                    uuid,
                    sign
                }
                let _data = Object.assign(data,param)
                const _this = this;
                return http.post(getAdminUrl('bi/day-transfer'),tool.filterJson(_data)).then((res)=>{
                    if(res.status==0){
                        _this.legendData = tool.fliterFunnelData(res.data)
                        _this.yData = res.data
                        _this.chart.setOption({
                            legend: {
                                data: _this.legendData
                            },
                            series:[
                                {
                                    data:_this.yData
                                }
                            ]
                        })
                    }else{
                       _this.$toast(res.msg)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .container{
        .chart-wrap{    
            display: flex;
            justify-content: center;
            align-items: center;
            margin:15px auto;
            position: relative;
            .chart{
                width:100%;
                height: 400px;
                background: #fff;
            }
            .loading{
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                position: absolute;
                left: 50%;
                top:50%;
                margin-left: -50px;
                margin-top: -15px;
            }
        }
    }
</style>