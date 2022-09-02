<?php
$host = $_SERVER['HTTP_HOST'];
if(strpos($host,'test') !== false)
{
    $url = "https://apitest.likechuxing.com/wechat/auth?cb_url=https%3A%2F%2Fh5test.likechuxing.com%2Factivity%2Fcoupon_cash%3FshareKey%3D";
}
else
{
    $url ="https://api.likechuxing.com/wechat/auth?cb_url=https%3A%2F%2Factivity.likechuxing.com%2Factivity%2Fcoupon_cash%3FshareKey%3D";
}

header("Location:".$url.$_REQUEST['shareKey']);

?>