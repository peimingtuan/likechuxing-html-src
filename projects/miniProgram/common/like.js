class like {

    init() {
        this.page = getCurrentPages()[getCurrentPages().length - 1]
        const setData = this.page.setData.bind(this.page)
        this.setData = setData;
    }
    showPicker() {
        this.setData({
            visible:true,
            class:['lui-animation-fade-in','lui-animation-slide-up']
        })
    }
    hidePicker() {
        this.setData({
            class:['lui-animation-fade-out','lui-animation-slide-down']
        })
        let _this = this;
        setTimeout(()=>{
            _this.setData({
                visible:false
            })
        },300)
    }
    
}

export default new like()