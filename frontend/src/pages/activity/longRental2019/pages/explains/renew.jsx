require('./explain.less')
import React from 'react'
import Reflux from 'reflux'
import {appMutual} from '../../../../../../other_modules/app-mutual'


export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        appMutual.send.updateTitle('续租说明')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>1、可续租时间：2月11日—2月19日。</p>
                    <p>2、如用户无法在原租期内按时还车，则需在APP上提前续租，并根据提示缴纳费用后，方可继续用车;如到期未归还车辆且未续租的，将按照日租金的300%收取违约金。</p>
                    <p>3、每个用户仅可续租一次。</p>
                </div>
            </div>
    }
}
