import React from 'react'
import ReactDOM from 'react-dom'
import ActionSheet from './index.jsx'

class Like {
    constructor(){
        this.aClass = ['as-fadeIn','as-slideUp']
    }
    showActionSheet(option){
        this.cWrap  = document.createElement('div')
        this.cWrap.setAttribute('id','asId')
        document.body.appendChild(this.cWrap)
        ReactDOM.render(<ActionSheet aClass={this.aClass} list={option.list} select={option.select}/>,document.getElementById('asId'))
    }
    hideActionSheet(){
        this.aClass = ['as-fadeOut','as-slideDown']
        ReactDOM.render(<ActionSheet aClass={this.aClass}/>,document.getElementById('asId'))
        const _this = this
        setTimeout(() => {
            if(_this.cWrap){
                document.body.removeChild(_this.cWrap)
                ReactDOM.unmountComponentAtNode(_this.cWrap)
            } 
            this.aClass = ['as-fadeIn','as-slideUp']
        }, 350);
        
    }
}
export default new Like()