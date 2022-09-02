/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: goodsDetail
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午5:53
 Description:
 Param:
 Return:
 *************************************************/

require('./css/goodsDetail.less')
require('./js/common')
import $ from 'jquery'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from "./js/getApiUrl";
import parseUrl from '../../../js/parseURL'
import Swiper from 'swiper'

require('swiper/dist/css/swiper.css')
const explainBox = require('./template/explainBox.pug')
const addressBox = require('./template/addressBox.pug')
const alert3001 = require('./template/alert3001.pug')
import {Toast, Alert, Confirm} from "../../../component/LikeAlert/index";

import Reflux from 'reflux'
import {IsIos} from "../../../js/UserAgent";

const ios_footer = require('./template/ios_footer.pug')
import Loading from '../../../component/loading'

import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData()

const Actions = Reflux.createActions([
  'init',
  'submit',
  'purchase'
])

class Store extends Reflux.Store {
  constructor() {
    super()
    this.listenables = Actions;
    this.state = {
      user: memberMallData.getUser(),
      query: null,
      goods: {},
      name: '',
      phone: '',
      address: '',
      // 记录发送购买的ajax状态，防止多次发送
      is_purchasing: false
    }
  }

  onInit() {
    let query = parseUrl(window.location.href).query

    let loading = new Loading()
    myAjax.post(getApiUrl('point/detail'), {
      uuid: this.state.user.uuid,
      sign: this.state.user.sign,
      id: query.id
    }, function (res) {
      loading.destroy()

      // todo 待更新
      res.data.type = res.data.cate_id-1
      // todo

      this.setState({
        query,
        goods: res.data
      })
      this.loadData()
      this.bindAction()
    }.bind(this))

  }

  loadData() {
    $('.swiper-wrapper').append(this.state.goods.banner_image.map(item => (
      '<div class="swiper-slide" style="background-image: url(' + item + ')"></div>'
    )).join(''))

    new Swiper('.swiper-container', {
      pagination: this.state.goods.banner_image.length === 1 ? false :'.swiper-pagination',
      paginationClickable: false,
      spaceBetween: 30,
    });

    let str = '<div class="name">' + this.state.goods.name
    if (this.state.goods.is_hot) {
      str += '<div class="hot"></div>'
    }
    str += '</div><div class="cost fs14"><span class="score fs20">' + this.state.goods.point + '</span> 里程积分</div>'
    $('.desc').append(str)

    if (this.state.goods.type === 1) {
      if(memberMallData.state.name && memberMallData.state.phone && memberMallData.state.address){
        this.setState({
          name: memberMallData.state.name,
          phone: memberMallData.state.phone,
          address: memberMallData.state.area + ' ' +memberMallData.state.address
        })
        str = addressBox({name_phone_add: this.state.name + ' ' + this.state.phone + ' ' + this.state.address})
      }else{
        str = addressBox({name_phone_add:''})
      }

      $('.Address').append(str).click(function () {
        window.location.href = window.location.href.replace('goodsDetail.html', 'editAddress.html')
      })
    }

    str = this.state.goods.good_desc.map(item => explainBox(item)).join('')
    $('.DetailExplain').append(str)

    if (IsIos()) {
      $('.DetailExplain').css('margin-bottom', "0.2rem")
      $('body').append(ios_footer())
      $('.ios_footer').css('margin-bottom', "0.76rem")
    }
  }

  bindAction() {
    $('#exchange').click(Actions.submit)
  }

  onSubmit() {
    if (String(this.state.goods.type) === '1') {
      if (this.state.name === '' || this.state.phone === '' || this.state.address === '') {
        new Toast('请填写收货地址')
        return
      }
    }

    new Confirm({
      title: "将会扣除您<span class='red fs17'> " + this.state.goods.point + " </span>里程积分",
      msg: '确定兑换？',
      confirmButtonCallback: Actions.purchase
    })
  }

  onPurchase() {
    if (this.state.is_purchasing) {
      return false
    }

    this.setState({
      is_purchasing: true
    })

    let data = {
      uuid: this.state.user.uuid,
      sign: this.state.user.sign,
      id: this.state.goods.id
    }

    if (String(this.state.goods.type) === '1') {
      data.logistic_user_name = this.state.name
      data.logistic_user_phone = this.state.phone
      data.logistic_address = this.state.address
    }

    let loading = new Loading()
    myAjax.post(getApiUrl('point/buy-good'), data, function (res) {
      loading.destroy()
      this.setState({is_purchasing: false})

      if (res.status === 0) {
        memberMallData.save({
          goodsExchange: Object.assign({}, this.state.goods, {
            coupon_val: res.data.coupon_val
          })
        })
        window.location.href = 'exchangeSuccess.html'
      } else if (res.status === 9) {
        new Confirm({
          title: '您的里程积分不足',
          cancelButtonText: '提高里程积分',
          cancelButtonCallback: function () {
            window.location.href = '/static/likeScore/increase.html'
          }
        })
      } else if ([10, 11, 12].indexOf(res.status) > -1) {
        new Confirm({
          title: '您暂时未能满足兑换规则',
          cancelButtonText: "里程积分说明",
          cancelButtonCallback: function () {
            window.location.href = '/static/likeScore/mainPoint.html'
          }
        })
      } else if (res.status === 3001){
        $('body').append(alert3001({
          reason:res.data.reason
        }))
        $('.alert3001').find('.btn').click(function(){
          $('.alert3001').remove()
        })
      }else {
        new Alert({
          title: res.msg
        })
      }
    }.bind(this))
  }
}

new Store()
Actions.init()





