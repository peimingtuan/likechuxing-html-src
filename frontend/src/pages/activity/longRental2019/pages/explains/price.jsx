require('./explain.less')
import React from 'react'
import Reflux from 'reflux'
import {appMutual} from '../../../../../../other_modules/app-mutual'


export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        appMutual.send.updateTitle('违约金说明')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>1.距离取车时间≥3天取消订单，可退还全额长租费用及保证金；取车时间＜3天取消订单，将收取10%的长租费用，保证金可正常退还。</p>
                    <p>2.订单时间到期未还车的，将收取违约金，违约金按日租金300%收取。违约金按日计算，不足一日，按一日计算。并且立刻出行有权强行收回车辆。</p>
                </div>
            </div>
    }
}
