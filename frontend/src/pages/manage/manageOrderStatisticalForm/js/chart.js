import echarts from 'echarts'
import iEcharts from 'echarts-better'
import chartTheme from './theme'
class Chart {
    constructor(){
        this.chart = null
    }
    init(options){
       this.chart = echarts.init(options.el,'customed')
       this.chart.setOption({
            legend:{
                show:false,
                bottom:10,
                itemHeight:14,
                itemWidth:14,
                padding:8,
                textStyle:{
                    fontSize:13
                },
                data:options.legendData
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: options.xData,
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:'#f4f4f4'
                    }
                },
                axisLabel:{
                    color:'#5e5e5e'
                },
                axisLine:{
                    lineStyle:{
                        color:'#767A8A'
                    }
                },
                axisTick:{
                    alignWithLabel: true
                }
            },
            grid: {
                containLabel: true,
                show:true,
                y: 40,
                x2: 10,
                y2: 10,
                x: 10,
                borderColor:'#f4f4f4',
            },
            yAxis: [
                {
                    type : 'value',
                    name:'数量',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f4f4f4'
                        }
                    },
                    axisLabel:{
                        color:'#5e5e5e'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#767A8A'
                        }
                    }
                },
                {
                    type : 'value',
                    name:'占比',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f4f4f4'
                        }
                    },
                    axisLabel:{
                        color:'#5e5e5e'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#767A8A'
                        }
                    }
                }
            ],
            series: options.yData
       })
       return this.chart
    }
    initVertical(options){
        this.chart = iEcharts.init(options.el)
        this.chart.setOption({
                legend:{
                    show:true,
                    bottom:0,
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: options.xData,
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f4f4f4'
                        }
                    },
                    axisLabel:{
                        color:'#5e5e5e',
                        rotate: 90
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#767A8A'
                        }
                    }
                },
                grid: {
                    containLabel: true,
                    show:true,
                    y: 20,
                    x2: 10,
                    y2: 60,
                    x: 10,
                    borderColor:'#f4f4f4',
                },
                yAxis: {
                    type : 'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f4f4f4'
                        }
                    },
                    axisLabel:{
                        color:'#5e5e5e',
                        rotate: 90
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#767A8A'
                        }
                    },
                    // inverse:true
                },
                series: options.yData
        })
        return this.chart
    }
    initPreview(options){
        
        this.chart = iEcharts.init(options.el,chartTheme)
        let legendData =  options.legendData || {}
        legendData.left = 10
        legendData.right = 0
        legendData.bottom = 0
        legendData.top = 'center'
        this.chart.setOption({
             legend:{
                ...legendData,
                 algin:'center',
                 show:false,
                 itemHeight:14,
                 itemWidth:14,
                 padding:0,
                 itemGap:12,
                 textStyle:{
                     fontSize:13,
                 },
                 orient:'vertical',
                 rotation:-90,
             },
             yAxis: {
                 type: 'category',
                 position:'left',
                 splitLine:{
                     show:true,
                     lineStyle:{
                         color:'#f4f4f4'
                     }
                 },
                 axisLabel:{
                     color:'#5e5e5e',
                     rotate:-90
                 },
                 axisLine:{
                     lineStyle:{
                         color:'#767A8A'
                     }
                 },
                 inverse:true,
                 axisTick:{
                     alignWithLabel: true
                 },
                 data:options.yData||[]
             },
             grid: {
                 containLabel: true,
                 show:true,
                 right: 40,
                 top: 10,
                 left: 70,
                 bottom: 10,
                 borderColor:'#f4f4f4',
             },
             xAxis: [
                 {
                     type:'value',
                     splitLine:{
                         show:true,
                         lineStyle:{
                             color:'#f4f4f4'
                         }
                     },
                     axisLabel:{
                         color:'#5e5e5e',
                         rotate:90
                     },
                     axisLine:{
                         lineStyle:{
                             color:'#767A8A'
                         }
                     },
                     position:'top'
                 },
                 {
                    type:'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f4f4f4'
                        }
                    },
                    axisLabel:{
                        color:'#5e5e5e',
                        rotate:-90
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#767A8A'
                        }
                    },
                    position:'bottom'
                }
             ],
             series:options.series
        })
        return this.chart
    }
}
export default new Chart()