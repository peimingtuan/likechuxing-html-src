<template>
    <div class="page">
        <div class="title-box">
            <div class="title">
                <span>车辆数月走势图</span>
                <div class="h-btn" @click="preview">横屏</div>
            </div>
            <div class="time-box">
                <div class="btn reduce-btn" :class="reduceBtnClass?'disable':''" @click="delDay"></div>
                <div class="select-group">
                    <div class="select-item" v-for="(item,index) in selectHourArray" :key="index">
                         <SelectItem :label="item" :hideIcon="true" />
                    </div>
                </div>
                <div class="btn add-btn"   @click="addDay"></div>
                
            </div>
        </div>
        <div class="chart-wrap" >
            <div class="chart" ref="monthChart" id="monthChart"></div>
            <Legend :list="legendList" @changeLegend="changeLegend"/>
        </div>
        <DataPreview :tableData="tableData" />
        <DatePicker :show="datePickerIsShow" @hidePicker="hidePicker" @getData="getData"/>
    </div>
</template>
<script>
import chart from '../js/chart'
import Icon from '../js/icon'
import tools from '../js/tools'
import DatePicker from '../components/hourPicker';
import Legend from '../components/legend'
import SelectItem from '../components/selectItem'
import DataPreview from '../components/dataPreview'
import http from '../js/myAjax/withAxiosV2'
import getApiUrl from '../js/getApiUrl';
import authSingObj from '../js/signature'
export default {
    props:['cityId','statusId'],
    components:{
        DatePicker,
        SelectItem,
        DataPreview,
        Legend
    },
    data(){
        return{
            //月线
            mobile:'',
            datePickerIsShow:false,
            tableData:{
                titleLabel:[],
                day:[],
                res:{
                    count1:[],
                    count2:[],
                    count3:[],
                    count4:[],
                    percent1:[],
                    percent2:[],
                    percent3:[],
                    percent4:[]
                }
            },
            legendList:[],
        }
    },
    computed:{
        selectHourArray(){
            let date = []
            let { hourData ,selectHourArray } = this.$store.state
            selectHourArray.map(item=>{
                hourData.map(i=>{
                    if(i.id==item){
                        date.push(i.name)
                    }
                })
            })
            return date
        },
        reduceBtnClass(){
            let { selectHourArray  } = this.$store.state
            if(selectHourArray.length==1){
                return true
            }else{
                return false
            }
        }
    },
    watch:{
        cityId(v1,v2){
            if(v1!=v2){
                this.getChartData()
            } 
        },
        statusId(v1,v2){
            if(v1!=v2){
                this.getChartData()
            } 
        },
    },
    created(){
        this.mobile = sessionStorage.getItem('mobile')
    },
    mounted(){
        this.chart = chart.init({
            el:this.$refs.monthChart,
            xData:[],
            yData:[],
            legendData:[]
        })
        const _this = this;
        this.chart.getZr().on('click',function(params){
             const pointInPixel= [params.offsetX, params.offsetY];
             if(pointInPixel[1]<320){
                 _this. preview();
             }  
        })
        const deviceW = document.body.offsetWidth
        document.getElementById('monthChart').style.width = deviceW+'px';
        this.chart.resize();
    },
    methods:{
        hidePicker(){
            this.datePickerIsShow = false
        },
        getData(){
            this.getChartData()
        },
        getSelectList(arr,obj){
            arr.map(item=>{
                item.checked = true
                if(Object.keys(obj).indexOf(item.name)!=-1){
                    item.checked = obj[item.name]
                }
            })
           
            this.legendList = arr.slice()
            let selected = {}
            arr.map(item=>{
                selected[item.name] = item.checked
            })
            this.chart.setOption({
                legend:{
                    selected:selected
                }
            })
        },
        changeLegend(index){
            let arr = this.legendList.slice();
            arr[index].checked = !arr[index].checked
            this.legendList = arr
            let obj = {}
            arr.map(item=>{
                obj[item.name] = item.checked
            })
            this.chart.setOption({
                legend:{
                    selected:obj
                }
            })
        },
        preview(){
            this.$showChartPeview({
                chartOption:this.chart.getOption()
            })
        },
        getChartData(){         
            let city_id = this.cityId;
            let { selectHourArray } = this.$store.state
            let status = this.statusId;
            let data = {
                hour:selectHourArray.toString(),
                date:tools.initDate(),
                city_id,
                status,
                mobile:this.mobile
            }
            const _this = this;
            http.post(getApiUrl('/statistics/month-stats'),data).then(res=>{
                if(res.status == 0 ){
                    _this.tableData = tools.filterTableData(res.data,'date')
    
                    let xData = tools.filterXData(res.data,_this.selectHourArray[0])
                    let countArray = tools.filterYData(res.data,'percent')
                    let percentArray = tools.filterYData(res.data,'count')
                    let yData = tools.mergeArr(percentArray,countArray)
                    let option = this.chart.getOption();
                    option.series = yData
                    option.xAxis[0].data = xData
                   
                    let oldSelected = Object.assign(option.legend[0].selected,tools.initSelect(yData))
                    
                    _this.chart.setOption(option,true)
                    _this.chart.setOption({
                        legend:{
                            data:tools.filterLegendData(yData,oldSelected),
                        }
                    })
                    let chartOption = this.chart.getOption();
                    _this.getSelectList(chartOption.legend[0].data.slice(),chartOption.legend[0].selected)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        addDay(){
            this.datePickerIsShow = true
        },
        delDay(){
            let {  selectHourArray } = this.$store.state
            let arr = selectHourArray.slice()
            if(arr.length==1){
                return
            }
            arr.pop()
            this.$store.commit('setSelectHourArray',arr)
            this.getChartData()
        }
    },
    filters:{
        filterDay(v){
            if(v==0){
                return '日'
            }else if(v==6){
                return '六'
            }else{
                return ''
            }
        }
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
        padding-bottom: .4rem;
        .header{
            display:flex;
            justify-content: center;
            align-items: center;
            font-size: .14rem;
            width: 1.95rem;
            height: .32rem;
            margin: .2rem auto;
            color: #878787;
            .item{
                flex:1;
                text-align: center;
                line-height: .3rem;
                border: 1px solid #ccc;
                &:first-child{
                    border-top-left-radius: .18rem;
                    border-bottom-left-radius: .18rem;
                    border-right: none;
                }
                &:last-child{
                    border-top-right-radius: .18rem;
                    border-bottom-right-radius: .18rem;
                     border-left: none;
                }
                &.on{
                    background: #44a8ec;
                    color: #fff;
                    border: 1px solid #44a8ec;
                }
            }
        }
        .select-box{
            font-size: .14rem;
            color: #9e9e9e;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: .25rem;
            .item{
                display: flex;
                justify-content: center;
                align-items: center;
                &:first-child{
                    margin-right: .25rem;
                }
            }
        }
        .title-box{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .13rem;
            margin-bottom: .15rem;
            .title{
                display: flex;
                justify-content: center;
                align-items: center; 
                font-size: .15rem;
                .h-btn{
                  font-size: .12rem;
                  width: 0.46rem;
                  height: .2rem;
                  background: #f2f2f2;
                  border-radius: 2px;
                  color: #5e5e5e;
                  margin-left: .05rem;
                  display: flex;
                  justify-content: center;
                  align-items: center; 
                }
            }
            .time-box{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: .6rem;
                .select-group{
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    max-width: 1.2rem;
                    .select-item{ 
                        width: .6rem;
                    }
                }
                .btn{
                    width:.19rem;
                    height: .19rem;
                    &.add-btn{
                        background: url('../image/icon_add.png') no-repeat;
                        background-size: 100% 100%;
                        &.disable{
                            background: url('../image/icon_add_d.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                    &.reduce-btn{
                        background: url('../image/icon_reduce.jpg') no-repeat;
                        background-size: 100% 100%;
                        &.disable{
                            background: url('../image/icon_reduce_d.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
 
                }
            }
        }
        .chart-wrap{
            width:auto;
            background: #fff;
            .chart{
                width:100%;
                height: 340px;
            }
        }
    }
</style>


