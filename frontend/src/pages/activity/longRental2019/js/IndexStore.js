/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: IndexStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/4-下午3:24
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import myAjax from '../component/myAjax/withJq'
import getApiUrl from '../../../../js/getApiUrl'
import {Alert, Toast} from "../component/LikeAlert/index";
import loading from '../component/loading'
import createHistory from 'history/createHashHistory'
import {CommonActions} from "./CommonStore";

const history = createHistory()

const IndexActions = Reflux.createActions([
  'changeState',
  'initIndex',
  'updateModelList',
  'initEditRental',
  'getCost',
  'createRental',
  'initBranch',
  'pay',
  "isShowTime",
  "setDuration",
  'toggleInsuranceService'
])

class IndexStore extends Reflux.Store {
  constructor () {
    super()
    this.listenables = IndexActions
    this.state = {
      empty: '',

      cityList: [],
      currentCityId: 0,
      modelList: [],
      currentModelId: -1,
      discount: 0,

      duration: [[1517875200, 1518480000], [1519394400, 1519826400]],
      startTime: 1548950400,
      endTime: 1549814400,// 结束时间是下一天的0点0分0秒
      total_days:10,
      // 特殊价格开始时间
      rig_startTime:0,
      // 特殊价格结束时间
      rig_endTime:0,
      // 特殊价格开始时间前的价格
      bef_price: 0,
      // 特殊价格
      rig_price: 0,
      // 特殊价格结束时间后的价格
      aft_price: 0,

      startPoint: null,
      endPoint: null,

      // 租金
      rent_fee: 0,
      // 押金
      deposit: 0,
      // 折扣
      save_fee: 0,
      // 实际支付
      actual_fee: 0,
      // 保险（服务费）
      rent_insurance: 0,
      // 是否购买不计免赔
      insurance_service: 1,
      // 不计免赔总金额
      fee_total_insurance: 0,
      // 不计免赔单价
      price_insurance: 0,
      // 基本价格（租金+保险+不计免赔）
      baseActual:0,

      // 网点列表
      branchList: [],
      branchList_end:[],
      // 网点列表由近及远
      branchListSort: [],
      search_lat: 0,
      search_lng: 0,
      isShowTime: 0,
      noChangeCity: true,
      coupon: {
      },
      serverTime: 0,
      timeHour: 0,
      canCheckout: true,
      price_service:0

    }
  }

  onToggleInsuranceService(){
    if(this.state.insurance_service === 1){
      this.setState({
        insurance_service:0
      })
    }else{
      this.setState({
        insurance_service:1
      })
    }

    this.getCostLocal()

  }

  // 根据不计免赔的购买情况本地重新计算
  getCostLocal(){
    let baseActual = this.state.rent_fee+this.state.rent_insurance
    if(this.state.insurance_service)baseActual+=this.state.fee_total_insurance

    if(this.state.coupon.free_money)baseActual-=this.state.coupon.free_money

    this.setState({
      baseActual,
      actual_fee: baseActual + this.state.deposit
    })
  }

  onSetDuration (data) {
    this.setState({
      startTime:data.startTime,
      endTime:data.endTime,
      total_days:Math.round((data.endTime-data.startTime)/86400)
    })
  }

  onChangeState (state) {
    this.setState(state)
  }

  // index page
  onInitIndex () {
    let that = this
    let user = Reflux.GlobalState.common
    myAjax.post(getApiUrl('long-rental/model-list'), {
      uuid: user.uuid,
      sign: user.sign,
      city_id: this.state.currentCityId || user.city_id,
      activity_id: 1
    }, function (res) {
      // console.log(res);

      if (res.status === 0) {
        let cityArray = []
        for (let k in res.data.cityArray) {
          cityArray.push({
            id: k,
            city: res.data.cityArray[k]
          })
        }
        let current_city_id = res.data.selected_city_id
        if ((user.user_lat == 0 || user.user_lng == 0) && that.state.noChangeCity) {
          current_city_id = 197
        }
        let listOver = []
        let list = []
        res.data.model_info.forEach(item=>{
          if(item.left_num==0){
            listOver.push(item)
          } else{
            list.push(item)
          }
        })
        that.setState({
          cityList: cityArray,
          currentCityId: current_city_id,
          modelList: list.concat(listOver),
          actual_fee: 0,
          isShowTime: 0,
          startPoint: null,
          endPoint: null,
        })
      } else {
        new Toast(res.msg)
      }
    })
  }

  onUpdateModelList () {
    let that = this
    loading.show()
    let user = Reflux.GlobalState.common
    myAjax.post(getApiUrl('long-rental/model-list'), {
      uuid: user.uuid,
      sign: user.sign,
      city_id: this.state.currentCityId,
      activity_id: 1
    }, function (res) {
      loading.hide()
      if (res.status === 0) {
        let listOver = []
        let list = []
        res.data.model_info.forEach(item=>{
          if(item.left_num==0){
            listOver.push(item)
          } else{
            list.push(item)
          }
        })
        that.setState({
          modelList: list.concat(listOver),
        })
      } else {
        new Toast(res.msg)
      }
    })
  }

  // editRental page
  onInitEditRental () {
    let that = this
    let user = Reflux.GlobalState.common
    myAjax.post(getApiUrl('long-rental/model-detail'), {
      uuid: user.uuid,
      sign: user.sign,
      model_id: this.state.currentModelId,
      city_id: this.state.currentCityId,
      discount: this.state.discount,
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {
        // console.log(res.data.coupon);

        that.setState({
          //deposit: res.data.model_info.deposit,
          duration: res.data.duration,
          coupon: res.data.coupon,
          serverTime: res.data.server_time,
          rig_startTime: res.data.price.begin_time,
          rig_endTime: res.data.price.end_time,
          bef_price: res.data.price.bef_price,
          rig_price: res.data.price.rig_price,
          aft_price: res.data.price.aft_price
        })
      }
    })
  }

  onGetCost () {
    // 未加载前先清空旧金额
    this.setState({
      // 租金
      rent_fee: '-',
      // 押金
      deposit: '-',
      // 折扣
      save_fee: '-',
      // 实际支付
      actual_fee: '-',
      baseActual:'-',
      // 保险（服务费）
      rent_insurance: '-',
      // 不计免赔总金额
      fee_total_insurance: '-'
    })

    let that = this
    let user = Reflux.GlobalState.common

    myAjax.post(getApiUrl('long-rental/fee'), {
      uuid: user.uuid,
      sign: user.sign,
      model_id: this.state.currentModelId,
      city_id: this.state.currentCityId,
      begin_time: this.state.startTime,
      end_time: this.state.endTime,
      discount: this.state.discount,
      insurance_service: this.state.insurance_service,
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {

        that.setState({
          fee_total_insurance: res.data.price_insurance * that.state.total_days,

          rent_fee: res.data.rent_fee,

          rent_insurance: res.data.rent_insurance,


          deposit: res.data.deposit,

          save_fee: res.data.save_fee,
          price_insurance: res.data.price_insurance,
          price_service:res.data.price_service
        })
      }

      that.getCostLocal()
    })
  }

  onCreateRental () {
    loading.show()
    let that = this
    let user = Reflux.GlobalState.common
    myAjax.post(getApiUrl('long-rental/create'), {
      uuid: user.uuid,
      sign: user.sign,
      model_id: this.state.currentModelId,
      city_id: this.state.currentCityId,
      begin_time: this.state.startTime,
      end_time: this.state.endTime,
      begin_branch_id: this.state.startPoint.branch_id,
      end_branch_id: this.state.endPoint.branch_id,
      discount: Number(this.state.discount),
      coupon_id: this.state.coupon.id,
      activity_id: 1,
      insurance_service: this.state.insurance_service?1:0,
      client_total_money:this.state.actual_fee
    }, function (res) {
      // console.log(res);

      loading.hide()
      if (res.status === 0) {
        that.setState({
          actual_fee: res.data.total_money
        })
        history.replace('/main/pay')
      } else if (/该车型已被抢光/.test(res.msg)) {
        new Toast(res.msg)
        history.replace('/main/index')
      } else if (/已有未支付订单/.test(res.msg)) {
        new Alert({
          title: '已有未支付订单',
          msg: '点击确定支付该订单',
          confirmButtonCallback: function () {
            that.setState({
              actual_fee: res.data.total_money
            })
            history.replace('/main/pay')
          }
        })
      } else {
        new Toast(res.msg)
      }
    })
  }

  // chooseBranch Index page
  onInitBranch (type) {
    let that = this
    let user = Reflux.GlobalState.common
    myAjax.post(getApiUrl('long-rental/branch-list'), {
      uuid: user.uuid,
      sign: user.sign,
      city_id: this.state.currentCityId,
      type:Number(type)===0?'start':'end',
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {
        if(Number(type)===0){
          that.setState({
            branchList: res.data.branch
          })
        }else{
          that.setState({
            branchList_end: res.data.branch
          })
        }

      }
    })
  }

  // pay page
  onPay () {
    loading.show()
    let user = Reflux.GlobalState.common
    myAjax.post(getApiUrl('long-rental/pre-pay'), {
      uuid: user.uuid,
      sign: user.sign,
      activity_id:1
    }, function (res) {
      if (res.status === 0) {
        CommonActions.save()
        myAjax.postJump(getApiUrl('long-rental/pay'), {
          uuid: user.uuid,
          sign: user.sign
        })
      } else {
        loading.hide()
        new Toast(res.msg)
      }
    })
  }

}

export {IndexActions, IndexStore}