Component({
    data:{
        value:[0],
    },
    didMount() {
        this.setData({
            value:this.props.defaultValue
        })
    },
    methods:{
        hide() {
            this.props.onHidePicker()
        },
        onChange(e) {
            this.setData({
                value:e.detail.value
            })
        },
        onConfirm() {
            console.log('确定')
            this.props.onChange(this.data.value)
            this.hide();
        },
        onCancel() {
            this.hide();
        }
    }
})
