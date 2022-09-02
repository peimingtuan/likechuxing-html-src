<template>
    <div class="wrap" v-show="show" >
        <div class="chart" ref="chart" id="previewChart" :style="'width:'+screenWidth+'px;height:'+screenHeight+'px'">
        </div>
        <div class="icon" @click="hide"></div>
        <LegendGroup :list="legendList" @changeLegend="changeLegend"/>
    </div>
</template>
<script>
import chart from '../chart'
import Icon from '../icon'
import tools from '../tools'
import LegendGroup from '../../components/legendGroup.vue'
export default {
    components:{
        LegendGroup
    },
    data(){
        return{
            show:true,
            chartOption:{},
            screenHeight:'',
            screenWidth:'',
            legendList:[]
        }
    },
    created(){
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight
    },
    mounted(){
        let option = this.chartOption;
        // console.log(option.legend[0])
        let series = option.series;
        let arr = []
        series.map(item=>{
            let obj = {}
            obj.name = item.name
            obj.type = 'line'
            obj.data = item.data
            obj.xAxisIndex = item.yAxisIndex
            arr.push(obj)
        })
        this.chart && this.chart.clear()
        this.chart = chart.initPreview({
            el:this.$refs.chart,
            series:arr,
            yData:option.xAxis[0].data,
        })
        this.getSelectList(option.legend[0].data.slice(),option.legend[0].selected)
    },
    methods:{
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
        hide(){
            this.show = false
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        position: fixed;
        left: 0;
        top: 0;
        background: #fff;
        width:100%;
        height: 100%;
        .icon{
            width: .3rem;
            height: .3rem;
            background: url('../../image/close-btn.png') no-repeat;
            background-size: 100% 100%;
            position: fixed;
            bottom: .10rem;
            left:.10rem;
        }
    }
</style>


