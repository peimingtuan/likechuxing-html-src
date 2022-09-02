/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: jump
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/22-下午2:11
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.less')
require('../../../component/rem')
import loading from './component/loading'
loading.show()
import AppMutual from '../../../component/AppMutual'
const appMutual = new AppMutual()

setTimeout(jump,10)
function jump(){
    let url = window.location.href.replace('jump.html?','index.html?from=zhifubao&')
    console.log(url)

    window.location.href = url
    return

    if(appMutual.appArguments.user_sys === 'ios'){
        if(appMutual.appArguments.app_version < 2103){
            window.location.href = url
        }else{
            appMutual.sendUrl(url)
        }
    }else{
        appMutual.sendUrl(url)
    }
    window.location.assign(window.location.href.replace('jump.html','index.html'))
}