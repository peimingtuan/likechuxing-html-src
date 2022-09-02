/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: process
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/24-下午4:01
 Description:
 Param:
 Return:
 *************************************************/
require('./explain.less')
import React from 'react'
import Reflux from 'reflux'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import parseURL from '../../../../../../other_modules/app-arguments/parseURL'


export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        appMutual.send.updateTitle('费用说明')
    }
    render() {
        let type = parseURL(this.props.location.search).query.type;
        let content = <div className='explain'>
                <p>1.车辆租金<br />
                    春节长租的车辆租金因车型及订单时长不同而收费不同，请根据自身用车需求选择。</p>
                <p>2.保障服务费<br/>
                    保障服务费包括车辆意外事故损失、呼叫中心服务及人工服务等服务内容的费用。其中，车辆意外事故损失范围包括：车辆损失（1500元以内的损失由客户方承担）；第三者责任险和车上人员责任险。<br/>
                    本项目为必购项目，按天计算，20元/天，不足一天按一天计算。</p>
                <p>3.不计免赔服务<br/>
                    不计免赔服务是“立刻出行”针对基本保险升华的一项服务。选择购买不计免赔服务后，在理赔额度范围内，且保险公司没有拒赔或免赔的情况下，会员不需要承担本车保险责任范围以内的1500元(含1500元)以下的车辆维修费、保险溢价费、停运损失费。<br/>
                    本项目为选购项目，按天计算，20元/天，不足一天按一天计算。</p>
            </div>   
                  
            if(type=== 'insurance'){
                content = <div className='explain'>
                <p>
                    不计免赔服务是“立刻出行”针对基本保险升华的一项服务。选择购买不计免赔服务后，在理赔额度范围内，且保险公司没有拒赔或免赔的情况下，会员不需要承担本车保险责任范围以内的1500元(含1500元)以下的车辆维修费、保险溢价费、停运损失费。<br/>
                    本项目为选购项目，按天计算，20元/天，不足一天按一天计算。</p>
                </div>  
            }
            if(type=== 'feeInsurance'){
                content = <div className='explain'>
                <p>
                    保障服务费包括车辆意外事故损失、呼叫中心服务及人工服务等服务内容的费用。其中，车辆意外事故损失范围包括：车辆损失（1500元以内的损失由客户方承担）；第三者责任险和车上人员责任险。<br/>
                    本项目为必购项目，按天计算，20元/天，不足一天按一天计算。</p>
                </div>  
            }
            
        
        return <div className="Explain process">
                    {content}
                </div>
    }
}
