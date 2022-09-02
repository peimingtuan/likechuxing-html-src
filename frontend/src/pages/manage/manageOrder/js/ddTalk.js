/**
 * Created by Administrator on 2018/2/2.
 */
import {Confirm,Toast} from '../common/LikeAlert/index'
import FoundationTools from './functionAjax'
var ddTalk = {
    verify:function(navigator){
        if (navigator.indexOf("DingTalk") > 0) {
            if(sessionStorage.getItem("mobile")){
                return true;
            }else{
                let url2=window.location.href;
                if(url2.indexOf("index") > 0){
                    return true;
                }else{
                    sessionStorage.setItem("mobile",FoundationTools.getCookie("mobile"));//存储用户手机号
                    return true;
                }
            }
        } else {
            alert("请在钉钉内打开网页")
            // 以下代码是用javascript强行关闭当前页面
                let opened = window.open('about:blank', '_self');
                opened.opener = null;
                opened.close();
            return false;
        }
        return
    }
}
export default ddTalk