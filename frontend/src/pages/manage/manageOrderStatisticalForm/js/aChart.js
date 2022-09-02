const F2 = require('@antv/f2/lib/index');
// 引入所有的交互行为
require('@antv/f2/lib/interaction/');

const ScrollBar = require('@antv/f2/lib/plugin/scroll-bar');
F2.Chart.plugins.register(ScrollBar);

F2.Global.setTheme({
    colors:["#e34444","#ffb3b3","#60ab0e","#d7ed99","#38bbdf","#b3eeff","#ed7e22","#ffddb3", "#6e7074","#546570","#c4ccd3"]
})

class Chart {
    initChart(op){
        this.chart = new F2.Chart({
            id:op.el,
            pixelRatio: window.devicePixelRatio
        })
        this.chart.source(op.data,{
            'x':{
                tickCount:7
            }
        });
        // this.chart.legend(false)
        this.chart.tooltip(false)
        this.chart.line().size(1.3).position('x*count').color('type').shape('smooth')
        this.chart.line().size(1.3).position('x*percent').color('type').shape('smooth')

        // this.chart.axis('count',{
        //     line: {
        //         lineWidth: 1,
        //         stroke: '#ccc',
        //         top: true,
        //     }, 
        // })
        this.chart.render();
        return this.chart
    }
    initMaxChart(op){
        console.log(op)
        this.chart = new F2.Chart({
            id:op.el,
            pixelRatio: window.devicePixelRatio,
            width:op.width,
            height:op.height
        })
        this.chart.source(op.data,{
            'date':{
                tickCount:30
            }
        });
        this.chart.filter('type',val=>{
            return val=== op.filterType
        })
        this.chart.legend(false)
        this.chart.tooltip(false);
        this.chart.line().size(1.3).position(op.position).color('type').shape('smooth');

        this.chart.axis('value',{
            line: {
                lineWidth: 1,
                stroke: '#ccc',
                top: true,
            }, 
        })
        this.chart.axis('date',{
            label: {
                rotate: -Math.PI / 4,
                textAlign: 'end',
                textBaseline: 'middle'
            }
        })
        this.chart.render();
        return this.chart
    }
    initLegend(chart,item){
        chart.filter('type',val=>{
            return val=== item.name
        })
        chart.repaint();
    }
}
export default new Chart()