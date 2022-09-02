import React from 'react'
import './index.less'
import like from './index.js'
export default class ActionSheet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            aClass:[],
            list:[]
        }
    }
    componentWillMount(){
        this.setState({
            aClass:this.props.aClass,
            list:this.props.list
        })
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            aClass:nextProps.aClass
        })
    }
    selectItem(index){
        this.props.select(index)
        like.hideActionSheet()
    }
    hide(){
        like.hideActionSheet()
    }
    renderList(){
        return this.state.list.map((item,index)=>{
            return(
                <div className="as-item" onClick={()=>this.selectItem(index)} key={index}>{item}</div>
            )
        })
    }
    render(){
        let { aClass } = this.state;
        return(
            <div className="as-wrap">
                <div className={["as-mask",aClass[0]].join(' ')} ></div>
                <div className={["as-box",aClass[1]].join(' ')}>
                    {this.renderList()}
                    <div className="as-item cancel-item" onClick={this.hide}>取消</div>
                </div>
            </div>
        )
    }
}