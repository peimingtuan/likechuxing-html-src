/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午9:11
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'

export default class LabelInput extends React.Component {
  constructor(props) {
    super()
    this.state = {
      value: props.opt.value || '',
      displayClearBtn: false
    }
  }

  componentWillReceiveProps(props) {
    if (props.opt.value !== undefined && props.opt.value !== null) {
      this.setState({
        value: props.opt.value
      })
    }
  }

  change(e) {
    let value = e.currentTarget.value
    this.setState({
      value,
      displayClearBtn: value.length > 0,
      displayMaybe: true
    })
    this.props.opt.changeCallback(value)
  }

  clear() {
    this.setState({
      value: '',
      displayClearBtn: false
    })
    this.props.opt.changeCallback('')
  }

  hideClearBtnAsync() {
    setTimeout(function () {
      this.setState({
        displayClearBtn: false
      })
    }.bind(this), 200)
  }

  showClearBtn() {
    if(this.state.value.length > 0){
      this.setState({
        displayClearBtn: true
      })
    }
  }

  render() {
    let opt = this.props.opt
    return (
      <div className={'LabelInput ' + (opt.labelClassName || '')}>
        <label>{opt.labelText}
          <input
            type={opt.inputType || "text"}
            placeholder={opt.inputPlaceholder || ""}
            value={this.state.value}
            readOnly={Boolean(this.props.opt.readonly)}
            onChange={this.change.bind(this)}
            onBlur={this.hideClearBtnAsync.bind(this)}
            onFocus={this.showClearBtn.bind(this)}
          />
          <span className={"inputClearBtn " + (this.state.displayClearBtn ? '' : 'hidden')}
                onClick={this.clear.bind(this)}/>
        </label>
      </div>
    )
  }
}

LabelInput.defaultProps = {
  maybeList: [],
  getSelectKey: item => item
};


 