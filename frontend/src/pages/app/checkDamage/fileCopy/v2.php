<?php
$arg = '';
foreach ($_REQUEST as $key => $val) {
    $arg = $arg . $key . '=' . $val . '&';
}
$arg = substr($arg, 0, strlen($arg) - 1);
header('Location:/app/checkDamage/v2.html?' . $arg);
