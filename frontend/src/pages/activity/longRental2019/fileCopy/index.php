<?php

    $arg = '';
    foreach ($_REQUEST as $key => $val) {
        $arg = $arg . $key . '=' . $val . '&';
    }
    $arg = substr($arg, 0, strlen($arg) - 1);

    header('Location:/activity/longRental2019/index.html?' . $arg);