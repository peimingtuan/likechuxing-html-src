<template>
    <div class="container" >
        <SelectBox type="cityChart" @upDateData="upDateData" :cityList="cityList"/>
        <div class="chart-wrap">
            <div class="chart" ref="chart"></div>
            <div class="loading" v-show="showLoading">加载中···</div>
        </div>
        <PreviewData :list="previewList" :label="labelList"/> 
    </div>
</template>

<script>
    import like from '../js/chart.js'
    import tool from '../js/tools.js'
    import SelectBox from '../components/selectBox.vue'
    import PreviewData from '../components/previewData.vue'
    import { getAdminUrl } from "../../../../../other_modules/url-constructor/index";
    import http from "../../../../../other_modules/like-request/withAxiosV2";
    export default{
        name:'userChart',
        components:{
            SelectBox,
            PreviewData
        },
        data(){
            return{
                uuid:'',
                sign:'',
                startDate:'',
                endDate:'',
                cityName:'',
                xData:[],
                yData:[],
                cityList:[],
                showLoading:true,
                previewList:[],
                labelList:[]
            }
        },
        created(){
            //let res = tool.getUrlQuery(window.location.href);
            let res = tool.getCookieQuery()
            this.uuid = res.query.uuid;
            this.sign = res.query.sign;
            const selectDataList = JSON.parse(localStorage.getItem('selectDataList'));
            this.cityList = selectDataList.city
        },
        async mounted(){
            await this.getChartData()
            let { xData, yData } = this;
            let el = this.$refs.chart;
            this.chart = like.init({
                el,
                xData,
                yData
            });
            const _this = this;
            this.chart.on('click',(params)=>{
                if(params.componentType=="series"){
                    let arr = _this.chart.getOption().series;
                    if(arr[params.seriesIndex].label.show){
                        arr[params.seriesIndex].label.show = false
                    }else{
                        arr[params.seriesIndex].label.show = true;
                    }
                    _this.chart.setOption({
                        series:arr
                    })
                }
            })
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
                return http.post(getAdminUrl('bi/deposit'),tool.filterJson(data)).then((res)=>{
                    if(res.status==0){
                        _this.xData = tool.fliterXData(res.data.xData)
                        _this.yData = tool.filterYData(res.data.yData)
                        _this.previewList = tool.initPreviewData(res).arr
                        _this.labelList = tool.initPreviewData(res).label
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
                return http.post(getAdminUrl('bi/deposit'),tool.filterJson(_data)).then((res)=>{
                    if(res.status==0){
                        _this.xData = tool.fliterXData(res.data.xData)
                        _this.yData = tool.filterYData(res.data.yData)
                        _this.previewList = tool.initPreviewData(res).arr
                        _this.labelList = tool.initPreviewData(res).label
                        _this.chart.setOption({
                            xAxis: {
                                data: _this.xData
                            },
                            series: _this.yData
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