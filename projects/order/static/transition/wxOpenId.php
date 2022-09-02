<?php
/**
 * Created by PhpStorm.
 * User: garvey
 * Date: 2017/9/12
 * Time: 上午10:37
 */
$path = '';
$open_id = '';
if (isset($_GET['path'])) {
    $path = $_GET['path'];
}
if (isset($_GET['open_id'])) {
    $open_id = $_GET['open_id'];
}
// 在host后直接拼上？,让微信忽略掉hash部分的url，这样jsapi支付接口指向根即可
header('Location:https://' . $_SERVER['HTTP_HOST'] . '/?#' . $path.'?open_id='.$open_id);
