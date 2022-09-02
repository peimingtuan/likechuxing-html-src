<?php
$arg = '';
    foreach ($_REQUEST as $key => $val) {
        $arg = $arg . $key . '=' . $val . '&';
    }
    $arg = substr($arg, 0, strlen($arg) - 1);

        if(preg_match('#ios_#', $_REQUEST['user_version'])){
            $arg = $arg . '&footerColor=f2f2f2';
        }

    header('Location:/app/helpCenterAnswers/index.html?' . $arg);
