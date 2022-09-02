/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/4-上午11:08
 Description:
 Param:
 Return:
 *************************************************/
import Toast from '../../vue-popMessage/Toast.js'
import Alert from '../../vue-popMessage/Alert.js'
import Confirm from '../../vue-popMessage/Confirm.js'
import Loading from '../../vue-loading/Loading.js'

const install = function(Vue){
  Vue.prototype.$_LIKE_toast = Toast
  Vue.prototype.$_LIKE_alert = Alert
  Vue.prototype.$_LIKE_confirm = Confirm
  Vue.prototype.$_LIKE_loading = Loading
}

export default{
  install
}
export {
  Toast,
  Alert,
  Confirm,
  Loading
}
