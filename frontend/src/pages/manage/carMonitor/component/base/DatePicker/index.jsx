import LabelInput from "../LabelInput";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/2-上午10:38
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import $ from 'jquery'
window.jQuery = $
require('../../../../../../../other_modules/bootstrap-datetimepicker')
require('../../../../../../../other_modules/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN')
require('../../../../../../../other_modules/bootstrap-datetimepicker/build/build_standalone.less')

export default class DatePicker extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        $(this.refs.picker).datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose:true,
            endDate: new Date(),
            language:'zh-CN'
        }).on('change', function(e){
            this.props.onChange(e.target.value)
        }.bind(this));
    }

    show(){
        $(this.refs.picker).datetimepicker('show')
    }

    componentWillUnmount(){
        $(this.refs.picker).datetimepicker('remove')
    }

    render() {
        return <div className={"DatePicker "+this.props.className} >
            <input type="text" readOnly={true} ref="picker" defaultValue={this.props.value} placeholder={this.props.placeholder} className="timePicker" />
            <span className="icon date_icon" onClick={this.show.bind(this)}/>
        </div>
    }
}

DatePicker.defaultProps = {
    value:'',
    className:'',
    placeholder:'点击输入时间',
    onChange:function(e){
        console.log('timePicker change:',e.target.value)
    }
};


 