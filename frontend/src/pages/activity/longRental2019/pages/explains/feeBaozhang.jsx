/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: feeBaozhang
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/11/12-11:23 AM
 Description:
 Param:
 Return:
 *************************************************/
require('./explain.less')
import React from 'react'
import Reflux from 'reflux'
import AutoHeight from '../../js/AutoHeight'


export default class process extends Reflux.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const setCss = new AutoHeight()
    setCss.auto('.box_footer')
  }

  render() {
    return <div className="Explain process">
      <div className='explain'>
        <p>1.保障服务费包括车辆意外事故损失、呼叫中心服务及人工服务等服务内容的费用。</p>
        <p>2.车辆意外事故损失范围包括：车辆损失（2000元以内的损失由客户方承担）；第三者责任险和车上人员责任险。</p>
        <p>3.本项目为必购项目，按天计算，不足一天按一天计算。</p>
      </div>
    </div>
  }
}


 