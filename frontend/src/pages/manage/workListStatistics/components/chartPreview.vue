<template>
    <div class="wrap" v-show="show">
        <div class="chart" :style="'width:'+screenHeight+'px;height:'+screenWidth+'px'">
            <canvas id="chartPreview"></canvas>
            <div class="numDesc" v-show="chartData.length">数量</div> 
            <div class="legend-row">
                <Legend :list="legendItems" @changeLegend="changeLegend" />
            </div>
            <div class="chart-close-btn" @click="hideMaxChart"></div>
        </div>
    </div>
</template>
<script>
import F2 from '../js/chart'
import tool from '../js/tools'
import Legend from '../components/legendGroup.vue'
export default {
    name:'chartPreview',
    props:['chartData','show','legendIndex'],
    components:{
        Legend
    },
    data(){
        return {
            screenHeight:'',
            screenWidth:'',
            legendItems:[]
        }
    },
    watch:{
        chartData(v){
            if(v.length){
                let data = v
                let filterType = data[0].type
                this.chart = F2.initMaxChart({
                    el:'chartPreview',
                    data:data,
                    position:'date*value',
                    width:this.screenHeight,
                    height:this.screenWidth-40,
                    filterType
                })
                this.legendItems = tool.initLegendData(this.chart.getLegendItems().type)
            } 
        },
        legendIndex(v,v2){
            this.switchIcon(this.legendItems)
            this.legendItems[v].checked = true
            if(this.chart){
                F2.initLegend(this.chart,this.legendItems[v])
            } 
        },
        switchIcon(arr){
            arr.map(item=>{
                item.checked = false
                return item
            })
        },
    },
    created(){
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight
    },
    mounted(){
        
    },
    methods:{
       changeLegend(v){
            this.switchIcon(this.legendItems)
            this.legendItems[v].checked = true
            let item = this.legendItems[v]
            F2.initLegend(this.chart,item)
            this.$emit('maxChartChangeLegend',v)
        }, 
        switchIcon(arr){
            arr.map(item=>{
                item.checked = false
            })
        },
        hideMaxChart(){
            this.$emit('hideMaxChart')
        }
    }
}
</script>
<style lang="less" scoped>
    @import '../css/common.less';
    .wrap{
        width:100%;
        position: fixed;
        left: 0;
        top: 0;
        background: #fff; 
        transform: rotate(90deg);
        .chart{
            background: #fff; 
            padding-bottom: 40px; 
            position: relative;   
            canvas{
                width:100%;
                height: 100%;
            }
            .legend-row{
                height: 40px;
                .fc();
                margin-top: -5px;
            }
        }
        .chart-close-btn{
            .wh(.24rem,.24rem);
            background: url('../images/close-btn.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: .16rem;
            bottom: .12rem;
        }
        .numDesc{
            position: absolute;
            top:.05rem;
            left: .22rem;
            .fco(.12rem,#333)
        }
    }
</style>


