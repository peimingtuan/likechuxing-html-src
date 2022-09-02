/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/4-下午2:58
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import toast from '../../../../../../component/toast'

export default class Pagination extends React.Component {
    constructor(props) {
        super()
        this.state = {
            page_index: Number(props.page_index) || 1,
            page_total: Number(props.page_total)
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            page_index: Number(nextProps.page_index) || this.state.page_index,
            page_total: Number(nextProps.page_total)
        })
    }

    changeInput(e){
        this.setState({
            page_index: Number(e.currentTarget.value)
        })
    }

    previousPage(){
        if(this.state.page_index > 1){
            let newPage = this.state.page_index - 1
            this.setState({
                page_index:newPage
            })
            this.props.changePage(newPage)
        }
    }

    nextPage(){
        if(this.state.page_index < this.state.page_total){
            let newPage = this.state.page_index + 1
            this.setState({
                page_index:newPage
            })
            this.props.changePage(newPage)
        }
    }

    jumpPage(){
        if(this.state.page_index <= this.state.page_total && this.state.page_index > 0){
            this.props.changePage(this.state.page_index)
        }else{
            toast('输入页码有误')
        }
    }

    render() {
        return <div className="Pagination">
            <button className={'changeBtn' + (this.state.page_index == 1?' disabled': '')} onClick={this.previousPage.bind(this)}>上一页</button>
            <input type="text" value={this.state.page_index} onChange={this.changeInput.bind(this)}/>
            <span>/{this.state.page_total}页</span>
            <button onClick={this.jumpPage.bind(this)}>GO</button>
            <button className={'changeBtn' + (this.state.page_index == this.state.page_total?' disabled': '')} onClick={this.nextPage.bind(this)}>下一页</button>
        </div>
    }
}
 