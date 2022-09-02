<?php
$arg = '';
foreach ($_REQUEST as $key => $val) {
    $arg = $arg . $key . '=' . $val . '&';
}
$arg = substr($arg, 0, strlen($arg) - 1);
header('Location:/app/inviteCode/index.html?' . $arg);

// location to new invite page since app version 2.1.4
//header('Location:/app/userInvite/index.html?' . $arg);