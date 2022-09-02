/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/27-下午2:01
 Description:
 Demo:
 Others:
 *************************************************/
require('./css/index.less')
require('./js/amapControl')
import Confirm from './component/base/confirm'
import React from 'react'
import ReactDOM from 'react-dom'
import MainPage from './component/common/MainPage/index.jsx'
import CommonFun from './js/commonFunction'

if(CommonFun.login()){
    ReactDOM.render(<MainPage />, document.getElementById('reactRoot'))
}else{
    new Confirm({
        type: 'alert',
        title: '提示',
        msg:'身份信息验证失败，请从管理后台重新进入'
    })
}


 