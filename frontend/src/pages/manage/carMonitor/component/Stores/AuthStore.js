/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: AuthStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/5-上午10:41
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import AuthActions from './AuthActions'
import getApiUrl from "../../js/getApiUrl";
import commonFun from "../../js/commonFunction";

class AuthStore extends Reflux.Store {
  constructor() {
    super()
    this.listenables = AuthActions
    this.state = {
      phone_show:false,
      phone_link:false,
      rental_link:false,
      auth_edit_fence:false,
      auth_option_fence:false,
      auth_edit_fenceCar:false
    }
  }

  onGetPermission(){
    let that = this
    commonFun.post(getApiUrl('/tbox/get-is-allow'), {}).then(function(res){
      if(res.status === 0){
        that.setState({
          phone_show: !!res.data.see_phone,
          phone_link: !!res.data.link_phone,
          rental_link: !!res.data.link_order,
          auth_edit_fence: !!res.data.edit_fence,
          auth_option_fence: !!res.data.option_fence,
          auth_edit_fenceCar: !!res.data.edit_car
        })
      }
    })
  }
}

AuthStore.id = 'auth'

export default AuthStore