<?php
$arg = '';
foreach ($_REQUEST as $key => $val) {
    $arg = $arg . $key . '=' . $val . '&';
}
$arg = substr($arg, 0, strlen($arg) - 1);
if(preg_match('#ios_#', $_REQUEST['user_version'])){
    $arg = $arg . '&footerColor=f7f7f7';
}
header('Location:/app/couponExchangeList/index.html?' . $arg);
