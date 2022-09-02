/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/27-下午5:28
 Description:
 Param:
 Return:
 *************************************************/
require('./css/old.css')
import $ from 'jquery'
import getAppArguments from '../../../../js/getAppArguments'
import toast from '../../../../component/toast/index'
import myAjax from '../../../../component/myAjax/index'
import getApiUrl from '../../../../js/getApiUrl'
import AppMutual from '../../../../component/AppMutual/index'
const appMutual = new AppMutual()

$('#logo').attr('src',require('./images/invite-logo.png'))
$('#wechat1').attr('src',require('./images/invite-wechat1.png'))
$('#wechat2').attr('src',require('./images/invite-wechat2.png'))

let argument = getAppArguments()
if(argument.uuid !== '' && argument.sign !== ''){
    myAjax.post(getApiUrl('user/share-code'),{
        uuid:argument.uuid,
        sign:argument.sign
    },function (data){
        if(data.status !==0){
            toast(data.msg)
        }else{
            $('#contents').val(data.data.code)
        }
        console.log(data)
    })
}else{
    toast('请先登录App')
}

$('#toPerson').click(function(){
    share('2')
})

$('#toPublic').click(function(){
    share('1')
})

function share(destination){
    let data = {
        share_type: '4',
        destination: destination
    }
    appMutual.shareWx(data)
}
