Component({
    data:{
        visible:false,
        className:['lui-animation-fade-in','lui-animation-slide-up']
    },
    methods:{
        hide() {
            this.setData({
               className:['lui-animation-fade-out','lui-animation-slide-down']
            })
            const _this = this;
            setTimeout(()=>{
                _this.setData({
                    visible:false
                })
            },350)
            
        },
        show(){
            this.setData({
                className:['lui-animation-fade-in','lui-animation-slide-up'],
                visible:true 
            })
        }
    }
})
