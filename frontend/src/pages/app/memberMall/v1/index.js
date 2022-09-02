/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午12:15
 Description:
 Param:
 Return:
 *************************************************/

require('./css/index.less')
require('./js/common')
import $ from 'jquery'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from "./js/getApiUrl";
import getAppArguments from '../../../js/getAppArguments'
import AppMutual from '../../../component/AppMutual'

const appMutual = new AppMutual()
import {Toast, Alert, Confirm} from "../../../component/LikeAlert/index";

const goodsBox = require('./template/goodsBox.pug')
const footer_desc = require('./template/footer_desc.pug')
import Reflux from 'reflux'
import {IsIos} from "../../../js/UserAgent";

const ios_footer = require('./template/ios_footer.pug')
import Loading from '../../../component/loading'
import MemberMallData from './js/MemberMallData'
let memberMallData

const Actions = Reflux.createActions([
  'init',
  'submit',
  'purchase'
])

class Store extends Reflux.Store {
  constructor() {
    super()
    this.listenables = Actions;
    this.comingSoon = {
      id: -1,
      type: -1,
      name: '敬请期待',
      cost: '',
      img: require('./images/goods_more.png')
    }
    this.state = {
      user: null,
      detail: {}
    }
  }

  onInit() {
    let user = getAppArguments()

    if (!user.isLogin) {
      new Alert({
        title: '请先登录App',
        confirmButtonCallback: function () {
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
    } else {
      this.setState({user})
      //window.sessionStorage.setItem("memberMall_user", JSON.stringify(user))
      memberMallData = new MemberMallData({
        uuid:user.uuid,
        sign:user.sign
      })
      this.bindAction()
      let loading = new Loading()
      myAjax.post(getApiUrl('/point/point-goods'), {
        uuid: user.uuid,
        sign: user.sign,
        city_id: user.city_id || 0
      }, function (res) {
        loading.destroy()
        if (res.status === 0) {
          this.setState({detail: res.data})
          this.loadData()
        }
      }.bind(this))
    }
  }

  loadData() {
    $('.score').text(this.state.detail.point)
    // 加载GLA使用权
    let car = this.state.detail.goods.find(item => item.type === '0')
    if (car) {
      $('.hotGoods').append(goodsBox(formatGoodsData(car)))
    }

    // 加载普通商品
    let goods = this.state.detail.goods.filter(item => item.type !== '0').map(item => formatGoodsData(item))
    if (goods.length % 2 === 1) {
      goods.push(this.comingSoon)
    }
    $('.normalGoods').append(goods.map((item, index) => {
      item.delay = index*100
      return goodsBox(item)
    }).join(''))
    $('.goods').click(function () {
      let id = Number($(this).attr("data-id"))
      if (id >= 0) {
        let loading = new Loading()
        window.location.href = 'goodsDetail.html?id=' + id
      }
    })

    // 加载footer
    const body = $("body")
    body.append(footer_desc())
    if (IsIos()) {
      body.append(ios_footer())
    }
    let windowHeight = window.innerHeight
    let contentHeight = body.height()
    if (windowHeight > contentHeight) {
      $('.app_explain').css('marginTop', windowHeight - contentHeight - 1)
    }
  }

  bindAction() {
    $('.ques').click(function () {
      window.location.href = "scoreExplain.html"
    })

    $('.scoreDetail').click(function () {
      window.location.href = 'scoreDetail.html'
    })

    $('.exchangeHistory').click(function () {
      window.location.href = 'exchangeHistory.html'
    })

    $('.how').click(function () {
      window.location.href = '/static/likeScore/increase.html'
    })
  }
}

new Store()
Actions.init()

function formatGoodsData(data) {
  return {
    id: data.id,
    type: data.type,
    name: data.name,
    cost: data.point,
    isHot: data.is_hot === '1',
    img: data.small_image,
    soldOut: false
    //soldOut: Math.random()>0.5
  }
}



