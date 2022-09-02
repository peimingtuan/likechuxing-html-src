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


export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        appMutual.send.updateTitle('取还车说明')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>1.用户在预定取车时间前往预约网点取车。取车前按照APP提示检查车辆外观、机械功能及车内物品。物品包括钥匙、行驶证、三脚架、灭火器、托车钩和保单复印件等物品。</p>
                    <p>2.用户在还车时应将车停放在预选还车网点，并按照APP提示验车，保证车辆外观、机械功能及车内物品与取车时一致，如有破损或遗失，用户需承担相应费用。</p>
                </div>
            </div>
    }
}
