/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getUser
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午5:41
 Description:
 Param:
 Return:
 *************************************************/
import getAppArguments from '../../../../js/getAppArguments'

function getUser(){
    let appArgument  = getAppArguments()
    if(appArgument.isLogin){
        window.sessionStorage.setItem('like_user', JSON.stringify(appArgument))
        return appArgument
    }

    let user_str = window.sessionStorage.getItem('like_user')
    if(user_str){
        return JSON.parse(user_str)
    }

    return false
}

export default getUser