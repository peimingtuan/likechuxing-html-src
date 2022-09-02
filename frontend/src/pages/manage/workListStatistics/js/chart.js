const F2 = require('@antv/f2/lib/index');
// 引入所有的交互行为
require('@antv/f2/lib/interaction/');

const ScrollBar = require('@antv/f2/lib/plugin/scroll-bar');
F2.Chart.plugins.register(ScrollBar);

F2.Global.setTheme({
    colors:['#e34444','#f5a623','#e3f81c','#83e715','#44a8ec']
})

class Chart {
    initChart(op){
        this.chart = new F2.Chart({
            id:op.el,
            pixelRatio: window.devicePixelRatio,
        })
        this.chart.source(op.data,{
            'date':{
                // min:0,
                // max:7,
                tickCount:7
            }
        });
        this.chart.filter('type',val=>{
            return val=== op.filterType
        })
        // this.chart.legend({
        //     position:'bottom',
        //     align:'center',
        //     selectedMode: 'single'
        // })
        this.chart.legend(false)
        this.chart.tooltip(false)
        // this.chart.tooltip({
        //     showTitle: true,
        //     showCrosshairs: true,
        //     showItemMarker: false,
        //     offsetY:15,
        //     background: {
        //       radius: 2,
        //     //   fill: '#d0021b',
        //       padding: [3, 5]
        //     },
        //     nameStyle: {
        //       fill: '#fff'
        //     },
        //     onShow: function onShow(ev) {
        //       var items = ev.items;
        //     //   console.log(items)
        //     items[0].title = '日期:'+items[0].title
        //     //   items[0].name = items[0].title;
        //     }
        //   });
        this.chart.line().size(1.3).position(op.position).color('type').shape('smooth');
        // this.chart.point().position(op.position).color('type').shape('smooth').style({
        //     stroke: '#fff',
        //     lineWidth: '1'
        // });
        this.chart.axis('value',{
            line: {
                lineWidth: 1,
                stroke: '#ccc',
                top: true,
            }, 
        })
        // this.chart.interaction('pan');
        // // // 定义进度条
        // this.chart.scrollBar({
        //   mode: 'x',
        //   xStyle: {
        //     offsetY: -28,
        //     fillerColor:'#d0021b'
        //   }
        // });
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
        // this.chart.point().position(op.position).color('type').shape('smooth').style({
        //     stroke: '#fff',
        //     lineWidth: '1'
        // });
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
    initScrollChart(op){
        this.chart = new F2.Chart({
            id:op.el,
            pixelRatio: window.devicePixelRatio,

        })
        this.chart.source(op.data,{
            hour:{
                min:0,
                max:7
            }
        });
        this.chart.filter('type',val=>{
            return val==='单车时长'
        })
        // this.chart.legend({
        //     position:'bottom',
        //     align:'center',
        //     selectedMode: 'single'
        // })
        this.chart.legend(false)
        this.chart.tooltip({
            showTitle: true,
            showCrosshairs: true,
            showItemMarker: false,
            offsetY:15,
            background: {
              radius: 2,
              fill: '#d0021b',
              padding: [3, 5]
            },
            nameStyle: {
              fill: '#fff'
            },
            onShow: function onShow(ev) {
              var items = ev.items;
            //   console.log(items)
            items[0].title = items[0].title +'点'
            //   items[0].name = items[0].title;
            }
          });
        this.chart.line().position(op.position).color('type').shape('smooth');
        this.chart.point().position(op.position).color('type').shape('smooth').style({
            stroke: '#fff',
            lineWidth: '1'
        });
        this.chart.interaction('pan');
        // // 定义进度条
        this.chart.scrollBar({
          mode: 'x',
          xStyle: {
            offsetY: -28,
            fillerColor:'#d0021b'
          }
        });
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