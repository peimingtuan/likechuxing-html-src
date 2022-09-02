export default class levent{
    constructor(){
        this.events = {}//事件对象
    }
    onEvent(event,fn){//监听事件
        this.events[event] = this.events[event] || [];
        this.events[event].push(fn)
    }
    emitEvent(event){//触发事件
        let fns = this.events[event];
        if(fns){
            let arr = fns.slice();
            let args = [].slice.call(arguments,1)
            for(let i = 0;i<fns.length;i++){
                fns[i].apply(null,args)
            }
        }
        
    }
    offEvent(event,fn){//注销事件监听
        if(!arguments.length){
            this.events = {}
            return
        }
        if(!this.events[event]){
            return;
        }
        if(arguments.length===1){
            delete this.events[event]
        }
        let arr = this.events[event];
        if(!arr) return
        for(let i = 0;i < arr.length; i++){
            if(arr[i]===fn){
                arr.splice(i,1);
                break;
            }
        }
    }
}