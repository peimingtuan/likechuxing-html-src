/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: openApp
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/15-下午2:52
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

export default class OpenApp {
    constructor(){
        this.baseScheme = 'lkcx://'
        this.iframe = createIframe()()
    }

    mainIndex(){
        //this.iframe.src = this.baseScheme + 'app/main/index'
        window.location.href = this.baseScheme + 'app/main/index'
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