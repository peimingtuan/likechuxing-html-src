/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: MutualOld
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/23-上午11:53
 Description:
 Demo:
 Others:
 *************************************************/
import appArguments from '../../app-arguments'

const MUTUAL_ADDRESS = {
  JUMP_TO_USE_CAR_PICTURE_BEFORE_RENTAL : 'like://type=1&rental_id=',
  JUMP_TO_ACCIDENT_PICTURE : 'like://type=2&rental_id=',
  JUMP_TO_APP_MAIN_PAGE : 'like://type=3',
  CHECK_DAMAGE : 'like://type=4&ids=',
  CHOOSE_COUPON : 'like://type=5&coupon_id='
}

export default class AppMutualOld {
    constructor (){
        let ua = navigator.userAgent.toLowerCase().replace(/\s/g, '')
        this.isLowerIos = /iphoneos[78]_/.test(ua)
        this.appArguments = appArguments
    }

    loadUrl(url){
        if(this.isLowerIos){
            let a = document.createElement('a')
            a.href = url
            a.click()
        }else{
            window.location.href=url
        }
    }

    alertBox(msg){
        if(this.appArguments.isInApp){
            alert(msg)
        }
    }

    chooseCoupon(id,value){
        this.loadUrl(MUTUAL_ADDRESS.CHOOSE_COUPON + id + '&coupon_value=' + Number(value).toFixed(0))
    }

    sendDamage(ids){
        this.loadUrl(MUTUAL_ADDRESS.CHECK_DAMAGE + ids)
    }

    jumpBeforeRentalPhoto(rental_id){
        this.loadUrl(MUTUAL_ADDRESS.JUMP_TO_USE_CAR_PICTURE_BEFORE_RENTAL + rental_id)
    }

    jumpAccidentPhoto(rental_id){
        this.loadUrl(MUTUAL_ADDRESS.JUMP_TO_ACCIDENT_PICTURE + rental_id)
    }

    jumpIndexAndCloseThisWebview(){
        this.loadUrl(MUTUAL_ADDRESS.JUMP_TO_APP_MAIN_PAGE)
    }

    shareWx(opt){
        this.alertBox(JSON.stringify({
            like:{
                type:opt.share_type,
                destination:opt.destination
            }
        }))
    }
}