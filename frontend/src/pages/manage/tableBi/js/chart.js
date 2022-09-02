import echarts from 'echarts'
class Chart {
    constructor(){
        this.chart = null
    }
    init(options){
       this.chart = echarts.init(options.el,'macarons')
       this.chart.setOption({
            legend:{
                show:true,
                top:10,
            },
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
                }
            },
            grid: {
                containLabel: true,
                show:true,
                y: 60,
                x2: 20,
                y2: 20,
                x: 10,
                borderColor:'#f4f4f4',
            },
            yAxis:[
                {
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
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f4f4f4'
                        }
                    },
                    axisLabel:{
                        color:'#5e5e5e',
                        formatter:'{value} %'
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
    initFunnel(options){
        this.chart = echarts.init(options.el,'macarons')
        this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}%"
                },
                legend: {
                    data: options.legendData
                },
                series: [
                    {
                        type: 'funnel',
                        label:{
                            position:'right',
                            formatter:function(v){
                                var str = '人数：'+v.data.count+'\n\n'+'占比：'+v.data.value+'%'
                                return str
                            }
                        },
                        emphasis:{
                            position:'inside',
                            label:{
                                formatter:"{b}"
                            }
                        },
                        data:options.yData
                    }
                ]
        })
        return this.chart
    }
}
export default new Chart()