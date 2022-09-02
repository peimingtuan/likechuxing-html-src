/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: open-app
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-上午11:48
 Description:
 Param:
 Return:
 *************************************************/
function createIframe(){
  let iframe;
  return function(){
    if(iframe){
      return iframe;
    }else{
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      return iframe;
    }
  }
}

export default new class OpenApp {
  constructor(){
    this.baseScheme = 'lkcx://'
    this.iframe = createIframe()()
  }

  mainIndex(){
    //this.iframe.src = this.baseScheme + 'app/main/index'
    window.location.href = this.baseScheme + 'app/main/index'
  }

  userLicense(){
    window.location.href = this.baseScheme + 'app/user/license?needAuth=1'
  }

  userDeposit(){
    window.location.href = this.baseScheme + 'app/user/deposit?needAuth=1'
  }

  userRecharge(){
    window.location.href = this.baseScheme + 'app/user/recharge?needAuth=1'
  }

  rentalPeccancy(){
    window.location.href = this.baseScheme + 'app/rental/peccancy?needAuth=1'
  }

  paySelfService(){
    window.location.href = this.baseScheme + 'app/pay/selfService?needAuth=1'
  }

  userMessage(type){
    window.location.href = this.baseScheme + 'app/user/message?needAuth=1&message_type='+type
  }

  rentalRefuelDetail(rental_no){
    window.location.href = this.baseScheme + 'app/rental/refuelDetail?needAuth=1&rental_no='+rental_no
  }

  openUrl(url,_method){
    let method = _method || 'post'
    //this.iframe.src = this.baseScheme + 'webview?method='+method+'&url='+encodeURIComponent(url)
    window.location.href = this.baseScheme + 'webview?method='+method+'&url='+encodeURIComponent(url)
  }

  openUrlWithShare(url,_method){
    let method = _method || 'post'
    //this.iframe.src = this.baseScheme + 'webview?method='+method+'&url='+encodeURIComponent(url)
    window.location.href = this.baseScheme + 'webview?share=1&method='+method+'&url='+encodeURIComponent(url)
  }
}