<?php
$arg = '';
foreach ($_REQUEST as $key => $val) {
    $arg = $arg . $key . '=' . $val . '&';
}
$arg = substr($arg, 0, strlen($arg) - 1);
header('Location:/static/ivr/index.html?footerColor=f7f7f7&' . $arg);