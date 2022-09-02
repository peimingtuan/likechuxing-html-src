/**
 * Created by garvey on 2017/9/6.
 */
import appArguments from '../../../../other_modules/app-arguments'
import {appMutual} from '../../../../other_modules/app-mutual'
import myAjax from '../../../../other_modules/like-request/withAxiosV2'
import {getApiUrl} from "../../../../other_modules/url-constructor";

require('./css/common.less')

if(!appArguments.uuid){
  appMutual.jump.loginAndCloseThisWebview({
    destroy_current:1
  })
}else{
  myAjax.post(getApiUrl('/user/basic-info'), {
    uuid:appArguments.uuid,
    sign:appArguments.sign
  }).then(res=>{
    if(res.status === 0){

      if(Number(res.data.license_status) === 3){
        // 未认证
        appMutual.jump.license({
          destroy_current: 1,
          license_status: 3,
          count_channel:'mainPageTopBar'
        })
      }else if(Number(res.data.license_status) === 2){
        // 未通过
        appMutual.jump.license({
          destroy_current: 1,
          license_status: 0,
          count_channel:'mainPageTopBar'
        })
      }else if(Number(res.data.deposit_status) === 2){

        appMutual.jump.deposit({
          destroy_current: 1,
          callback_url: '',
          count_channel:'mainPageTopBar'
        })
      }else{
        appMutual.jump.deposit({
          destroy_current: 1,
          callback_url: '',
          count_channel:'mainPageTopBar'
        })
      }

    }else{
      appMutual.jump.loginAndCloseThisWebview({
        destroy_current:1
      })
    }
  })
}





