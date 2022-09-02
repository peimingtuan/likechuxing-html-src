Component({
    methods:{
        click(e){
            this.props.onClick(e.target.dataset.key)
        }
    }
})
