/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/3-上午10:05
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.less')
require('../../../component/rem')
//require('../../../component/vconsole')
import Umeng from '../../../component/umeng'
new Umeng(1272836877)
import React from 'react'
import Reflux from 'reflux'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import getAppArguments from '../../../js/getAppArguments'
import AppMutual from '../../../component/AppMutual'
import {CommonActions, CommonStore} from "./js/CommonStore";
import {RentalActions, RentalStore} from "./js/RentalStore";
import {CarActions, CarStore} from "./js/CarStore";
import {IndexActions, IndexStore} from "./js/IndexStore";

const appMutual = new AppMutual()
import loading from './component/loading'
import myAjax from './component/myAjax/withJq'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";

import Index from "./pages/main/index";
import EditRental from './pages/main/editRental';
import Pay from './pages/main/pay';
import ChooseBranch from './pages/chooseBranch/index'
import SearchAddress from './pages/chooseBranch/searchAddress'
import PickBranch from './pages/chooseBranch/pickBranch'
import ChooseDamage from './pages/carDamage/chooseDamage'
import TakePhoto from './pages/carDamage/takePhoto'
import RealName from './pages/rental/realName'
import ChooseCar from './pages/rental/chooseCar'
import CarDetail from './pages/rental/carDetail'
import UseCar from './pages/rental/useCar'
import WillFinish from './pages/rental/willFinish'
import CarLocation from './pages/car/location'
import Iframe from './pages/main/iframe'
import Finish from './pages/main/finish'
import Review from './pages/carDamage/review'
import Navigation from './pages/main/navigation'
import Explains from "./pages/explains/index";
import ExplainCharge from './pages/explains/charge'
import ExplainDeposit from './pages/explains/deposit'
import ExplainFee from './pages/explains/fee'
import ExplainGetCar from './pages/explains/getCar'
import ExplainOthers from './pages/explains/others'
import ExplainProblem from './pages/explains/problem'
import ExplainProcess from './pages/explains/process'
import ExplainRealname from './pages/explains/realname'
import Peccancy from './pages/main/peccancy'

loading.show()
history.replace('/')
const appArguments = getAppArguments()

// 路由
class BasicRouter extends Reflux.Component{
    constructor(){
        super()
        this.state = {
            ready:false,
            rental_status: 0
        }
        this.stores = [CommonStore, RentalStore, CarStore, IndexStore]
        this.storeKeys = ['empty']
    }

    componentDidMount(){
        if(/from=zhifubao/.test(window.location.search)){
            // 从支付宝回来的
            CommonActions.load()
        }else{
            // app中进入
            CommonActions.changeState(appArguments)
        }

        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/current-info'),{
            uuid:user.uuid,
            sign:user.sign
        },function(res){
            console.log(res);
            
            loading.hide()
            history.listen((location,action)=>{
                window._czc.push([ "_trackPageview",location.pathname])
                loading.hide()
            })
            if(res.status === 6001){
                new Alert({
                    title: '您还没登录哦',
                    msg: '请前往登录',
                    confirmButtonCallback: function(){
                        appMutual.jumpIndexAndCloseThisWebview()
                    }
                })
                return
            }

            // 没有长租订单
            if(res.status === 0){
                if(!res.data.hasOwnProperty('rental_status')){
                    //没有订单状态=没有长租单
                    history.replace('/main/index')
                }else{
                    //有或者有过长租单
                    IndexActions.changeState({
                        currentCityId: res.data.current_city_id
                    })
                    CarActions.changeState({
                        car_id: res.data.car_id
                    })
                    let _peccancy = []
                    let _self_pay = 0
                    if(res.data.reason){
                        _peccancy = res.data.reason.peccancy || []
                        _self_pay = res.data.reason.self_pay || 0
                    }
                    RentalActions.changeState({
                        rental_city_id:res.data.current_city_id,
                        rental_id: res.data.rental_id,
                        end_branch_name: res.data.end_branch_name,
                        end_branch_lat: res.data.end_branch_lat,
                        end_branch_lng: res.data.end_branch_lng,
                        has_change_car: res.data.has_change_car,
                        peccancy: _peccancy,
                        self_pay: _self_pay
                    })

                    let rental = res.data.rental_status,
                        fee = res.data.fee_status,
                        real_name = res.data.realname_status
                    if([100,101,103].indexOf(rental) !== -1){
                        // 订单取消，去首页
                        history.replace('/main/index')
                    }else if(rental > 100 ){
                        // 完成订单
                        if(fee >= 3){
                            // 已退押金
                            history.replace({
                                pathname:'/main/finish',
                                search:'?type=1'
                            })
                        }else{
                            // 没退押金
                            if(res.data.reason){
                                //有没退的原因，显示出来
                                history.replace({
                                    pathname:'/main/finish',
                                    search:'?type=2'
                                })
                            }else{
                                //没有原因，是15天未到，请等待
                                history.replace({
                                    pathname:'/main/finish',
                                    search:'?type=0'
                                })
                            }
                        }
                    }else if(rental >= 10){
                        // 订单开始了
                        history.replace('/rental/useCar')
                    }else{
                        // 1<=rental<10,创建订单
                        if(fee<1){
                            // 未付款
                            IndexActions.changeState({
                                actual_fee:res.data.actual_fee
                            })
                            history.replace('/main/pay')
                        }else if(real_name === 0){
                            // 支付了，未实名
                            history.replace('/rental/realName')
                        }else{
                            // 支付了，已实名
                            history.replace('/rental/chooseCar')
                        }
                    }
                }

            }else{
                new Toast(res.msg)
            }
        })
    }

    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={() => <div/>}/>

                    <Route path="/main/index" component={Index}/>
                    <Route path="/main/editRental" component={EditRental}/>
                    <Route path="/main/pay" component={Pay}/>
                    <Route path="/main/iframe" component={Iframe}/>
                    <Route path="/main/finish" component={Finish}/>
                    <Route path="/main/navigation" component={Navigation}/>
                    <Route path="/main/peccancy" component={Peccancy}/>

                    <Route exact path="/explains" component={Explains}/>
                    <Route path="/explains/charge" component={ExplainCharge}/>
                    <Route path="/explains/deposit" component={ExplainDeposit}/>
                    <Route path="/explains/fee" component={ExplainFee}/>
                    <Route path="/explains/getCar" component={ExplainGetCar}/>
                    <Route path="/explains/others" component={ExplainOthers}/>
                    <Route path="/explains/problem" component={ExplainProblem}/>
                    <Route path="/explains/process" component={ExplainProcess}/>
                    <Route path="/explains/realname" component={ExplainRealname}/>

                    <Route path="/chooseBranch/index" component={ChooseBranch}/>
                    <Route path="/chooseBranch/searchAddress" component={SearchAddress}/>
                    <Route path="/chooseBranch/pickBranch" component={PickBranch}/>

                    <Route path="/carDamage/chooseDamage" component={ChooseDamage}/>
                    <Route path="/carDamage/takePhoto" component={TakePhoto}/>
                    <Route path="/carDamage/review" component={Review}/>

                    <Route path="/rental/realName" component={RealName}/>
                    <Route path="/rental/chooseCar" component={ChooseCar}/>
                    <Route path="/rental/carDetail" component={CarDetail}/>
                    <Route path="/rental/useCar" component={UseCar}/>
                    <Route path="/rental/willFinish" component={WillFinish}/>

                    <Route path="/car/location" component={CarLocation}/>

                    <Route render={() => <div>404</div>}/>
                </Switch>
            </Router>
        )
    }
}

if(appArguments.app_version < 2102 && appArguments.user_sys === 'android'){
    new Alert({
        title: '请升级APP',
        msg: '请升级至最新版app参与活动',
        confirmButtonCallback: function(){
            appMutual.jumpIndexAndCloseThisWebview()
        }
    })
}else{
    if(/from=zhifubao/.test(window.location.search)){
        appArguments.isLogin = true
    }
    if(appArguments.isLogin){
        ReactDOM.render(<BasicRouter />, document.getElementById('reactRoot'))
    }else{
        new Alert({
            title: '您还没登录哦',
            msg: '请前往登录',
            confirmButtonCallback: function(){
                appMutual.jumpIndexAndCloseThisWebview()
            }
        })
    }
}








