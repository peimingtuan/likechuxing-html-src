<?php
if(isset($_REQUEST['uuid']) && isset($_REQUEST['sign'])){
    $uuid = $_REQUEST['uuid'];
    $sign = $_REQUEST['sign'];
    $expire = time() + 3600 * 24 * 3;
    setcookie('uuid', $uuid, $expire);
    setcookie('sign', $sign, $expire);
}

header('Location:/manage/tableBi/index.html');
