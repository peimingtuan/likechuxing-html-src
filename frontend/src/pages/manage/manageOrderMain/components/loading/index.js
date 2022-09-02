import Index from './index.vue'
const Loading = {}
Loading.install = function(Vue){
    
    let indexClass = Vue.extend(Index)
    let instance = new indexClass();
    let component = instance.$mount().$el

    Vue.prototype.$showLoading = function(id){
        component.setAttribute('id',id)
        document.body.appendChild(component)
    }
    Vue.prototype.$hideLoading = function(id){
        let box = document.getElementById(id)
        box && document.body.removeChild(box)
    }
}

export default Loading