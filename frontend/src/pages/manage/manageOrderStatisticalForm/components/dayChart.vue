<template>
    <div class="page">
        <div class="title-box">
            <div class="title">
                <span>车辆数日走势图</span>
                <div class="h-btn" @click="preview">横屏</div>
            </div>
            <div class="time-box">
                <div class="btn reduce-btn" :class="reduceBtnClass?'disable':''" @click="delDay"></div>
                <div class="select-group">
                    <div class="select-item" v-for="(item,index) in selectArray" :key="index">
                         <SelectItem :label="item" :hideIcon="true" />
                    </div>
                </div>
                <div class="btn add-btn"   @click="addDay"></div>
                
            </div>
        </div>
        <div class="chart-wrap">
            <div class="chart" ref="chart" id="dayChart">
            </div>
            <Legend :list="legendList" @changeLegend="changeLegend"/>
        </div>
        <DataPreview :tableData="tableData" type="1" />
        <DatePicker :show="datePickerIsShow" @hidePicker="hidePicker" @getData="getData"/>
    </div>
</template>
<script>
import chart from '../js/chart'
import Icon from '../js/icon'
import tools from '../js/tools'
import DatePicker from '../components/datePicker'; 
import Legend from '../components/legend'
import SelectItem from '../components/selectItem'
import DataPreview from '../components/dataPreview'
import http from '../js/myAjax/withAxiosV2'
import getApiUrl from '../js/getApiUrl';
import authSingObj from '../js/signature'

export default {
    props:['cityId','statusId'],
    components:{
        SelectItem,
        DataPreview,
        Legend,
        DatePicker
    },
    data(){
        return{
            //日线
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
            legendList:[]
        }
    },
    computed:{
        selectArray(){
            let date = []
            let { datePickerData ,selectArray } = this.$store.state
            selectArray.map(item=>{
                for(let key in datePickerData){
                    if(datePickerData.hasOwnProperty(key)){
                        let itemArr = datePickerData[key]
                        itemArr.map(i=>{
                            if(i.id==item){
                                date.push(i.md)
                            }
                        })
                    }
                }
            })
            return date
        },
        reduceBtnClass(){
            let { selectArray  } = this.$store.state
            if(selectArray.length==1){
                return true
            }else{
                return false
            }
        }
    },
    watch:{
        cityId(v1,v2) {
            if(v1!=v2){
                this.getChartData()
            } 
        },
        statusId(v1,v2){
            if(v1!=v2){
                this.getChartData()
            } 
        }
    },
    created(){
        this.mobile = sessionStorage.getItem('mobile')   
    },
    mounted(){
        this.chart = chart.init({
            el:this.$refs.chart,
            xData:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            yData:[]
        })
        const _this = this;
        this.chart.getZr().on('click',function(params){
             const pointInPixel= [params.offsetX, params.offsetY];
             if(pointInPixel[1]<320){
                 _this. preview();
             }  
        })   
        const deviceW = document.body.offsetWidth
        document.getElementById('dayChart').style.width = deviceW+'px';
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
            this.legendList = arr
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
            let status = this.statusId;
            let date = []
            let { datePickerData ,selectArray } = this.$store.state
            selectArray.map(item=>{
                for(let key in datePickerData){
                    if(datePickerData.hasOwnProperty(key)){
                        let itemArr = datePickerData[key]
                        itemArr.map(i=>{
                            if(i.id==item){
                                date.push(i.ymd)
                            }
                        })
                    }
                }
            })
        
            let data = {
                date:date.toString(),
                city_id,
                status,
                mobile:this.mobile
            }
            const _this = this;
            http.post(getApiUrl('/statistics/day-stats'),data).then(res=>{
                if(res.status == 0 ){
                    _this.tableData = tools.filterTableData(res.data,'hour')
    
                    let countArray = tools.filterYData(res.data,'percent')
                    let percentArray = tools.filterYData(res.data,'count')
                    let yData = tools.mergeArr(percentArray,countArray)
                    let option = this.chart.getOption();
                    option.series = yData
                    let oldSelected = Object.assign(option.legend[0].selected,tools.initSelect(yData))
                    this.chart.setOption(option,true)
                    _this.chart.setOption({
                        legend:{
                            data:tools.filterLegendData(yData,oldSelected)
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
            let {  selectArray } = this.$store.state
            let arr = selectArray.slice()
            if(arr.length==1){
                return
            }
            arr.pop()
            this.$store.commit('setSelectArray',arr)
            this.getChartData()
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
            #dayChart{
                width: 3.75rem;
                height: 340px;
            }
        }
    }
</style>


