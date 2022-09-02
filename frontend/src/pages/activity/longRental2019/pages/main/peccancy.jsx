/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: peccancy
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/12-下午3:32
 Description:
 Param:
 Return:
 *************************************************/

require('./peccancy.less')
import React from 'react'
import Reflux from 'reflux'
// import {RentalStore, RentalActions} from '../../js/RentalStore'
import {CarActions, CarStore} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
// import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
// import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import AutoHeight from '../../js/AutoHeight'
// import parseURL from '../../../../../js/parseURL'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import Time from '../../../../../js/function/Time'

export default class peccancy extends Reflux.Component {
    constructor() {
        super()
        this.store = CarStore
        this.storeKeys = [
            'p_create_time',
            'p_happen_time',
            'p_handle_des',
            'p_happen_addr',
            'p_happen_behavior',
            'p_score',
            'p_fee',
            'p_plate_no',
            'p_engine_no'
        ]
    }

    componentDidMount() {
        const setCss = new AutoHeight()
        appMutual.send.updateTitle('违章详情')
        setCss.auto('.box_footer')
    }

    componentDidUpdate() {
    }

    render() {
        return <div className="Peccancy">
                    <div className="peccancy">
                        <div className="item fs14">
                            <div className="label">车牌号</div>
                            {this.state.p_plate_no}
                        </div>
                        <div className="item">
                            <div className="label">违章时间</div>
                            {new Time(this.state.p_happen_time).getTime('YYYY年MM月DD日  星期W hh:mm')}
                        </div>
                        <div className="item">
                            <div className="label">违章地点</div>
                            {this.state.p_happen_addr}
                        </div>
                        <div className="item">
                            <div className="label">违章行为</div>
                            {this.state.p_happen_behavior}
                        </div>
                        <div className="item">
                            <div className="label">处罚措施</div>
                            扣分 {this.state.p_score} 罚款 {this.state.p_fee}
                        </div>
                        <div className="item">
                            <div className="label">状态</div>
                            {this.state.p_handle_des}
                        </div>
                        <div className="item">
                            <div className="label">发动机号</div>
                            {this.state.p_engine_no}
                        </div>
                    </div>
                    <div className="hint">以上信息来自当地交管局</div>
                </div>
    }
}


 