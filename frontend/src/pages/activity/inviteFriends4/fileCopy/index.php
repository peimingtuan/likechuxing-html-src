<?php
$arg = '';

if(isset($_REQUEST['user_version'])){

    foreach ($_REQUEST as $key => $val) {
        $arg = $arg . $key . '=' . $val . '&';
    }
    $arg = substr($arg, 0, strlen($arg) - 1);

    // 如果有user_version，app直接开的，去首页
    header('Location:/activity/inviteFriends4/index.html?'.$arg.'#/main');

}else if($_REQUEST['channel'] === '0_9106'){
    foreach ($_REQUEST as $key => $val) {
            $arg = $arg . $key . '=' . $val . '&';
        }
        $arg = substr($arg, 0, strlen($arg) - 1);

        // 如果channel=9106，红包活动过来的
        header('Location:/activity/inviteFriends4/index.html?'.$arg.'#/main');
}else{

    if(!isset($_REQUEST['channel'])){
        $_REQUEST['channel'] = '0_8994';
    }

    foreach ($_REQUEST as $key => $val) {
        $arg = $arg . $key . '=' . $val . '&';
    }
    $arg = substr($arg, 0, strlen($arg) - 1);

    // 其它的去登录页面
    if(isset($_REQUEST['inviter_uuid'])){
        // 微信分享进来的
        $arg = $arg . '&from=wx';

        // 如果是提前派发出去的地推码，增加扫描二维码计数给友盟
        $user_dt = array(
        '1498631750756369',
        '1499926785562494',
        '1508331922953519',
        '1513242825966244',
        '1514166480484258',
        '1533170549151785'
        );
        if(in_array($_REQUEST['inviter_uuid'], $user_dt)){
            $arg = $arg . '&scan=1';
        }
    }else{
        // 当成扫地推码进来的
        $arg = $arg . '&from=dt';
    }

    // 随机50%返回A/B注册页
    if(rand(0,1)){
        //$arg = $arg . '&type=a';
        $arg = $arg . '&type=b';
    }else{
        $channel_arr = explode('_',$_REQUEST['channel']);
        $new_channel = intval($channel_arr[1]) + 12;
        $arg = str_replace("_".$channel_arr[0],"_".strval($new_channel),$arg);
        $arg = $arg . '&type=b';
    }
    
    header('Location:/activity/inviteFriends4/index.html?'.$arg.'#/register');

}
