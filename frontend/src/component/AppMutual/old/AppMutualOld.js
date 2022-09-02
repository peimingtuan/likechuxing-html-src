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
import mutualAddress from './mutualAddress'
import getAppArguments from '../../../js/getAppArguments'

export default class AppMutualOld {
    constructor (){
        let ua = navigator.userAgent.toLowerCase().replace(/\s/g, '')
        this.isLowerIos = /iphoneos[78]_/.test(ua)
        this.appArguments = getAppArguments()
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
        this.loadUrl(mutualAddress.CHOOSE_COUPON + id + '&coupon_value=' + Number(value).toFixed(0))
    }

    sendDamage(ids){
        this.loadUrl(mutualAddress.CHECK_DAMAGE + ids)
    }

    jumpBeforeRentalPhoto(rental_id){
        this.loadUrl(mutualAddress.JUMP_TO_USE_CAR_PICTURE_BEFORE_RENTAL + rental_id)
    }

    jumpAccidentPhoto(rental_id){
        this.loadUrl(mutualAddress.JUMP_TO_ACCIDENT_PICTURE + rental_id)
    }

    jumpIndexAndCloseThisWebview(){
        this.loadUrl(mutualAddress.JUMP_TO_APP_MAIN_PAGE)
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