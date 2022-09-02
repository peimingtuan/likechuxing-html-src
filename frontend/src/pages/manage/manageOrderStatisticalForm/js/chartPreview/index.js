import pluginHtml from './index.vue'
const plugin = {}
plugin.install = (Vue)=>{
    let tpl = Vue.extend(pluginHtml);
    let instance = new tpl();
    Vue.prototype.$showChartPeview = (options={})=>{
        instance.show = true;
        instance.chartOption = options.chartOption
        document.querySelector('body').appendChild(instance.$mount().$el)
    }
}
export default plugin