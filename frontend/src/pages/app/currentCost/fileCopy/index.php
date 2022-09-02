<?php
if(isset($_REQUEST['car_price_text'])){
    $_REQUEST['car_price_text'] = urlencode ($_REQUEST['car_price_text']);
}

$arg = '';
    foreach ($_REQUEST as $key => $val) {

        $arg = $arg . $key . '=' . $val . '&';
    }
    $arg = substr($arg, 0, strlen($arg) - 1);

        if(preg_match('#ios_#', $_REQUEST['user_version'])){
            $arg = $arg . '&footerColor=f2f2f2';
        }

    header('Location:/app/currentCost/index.html?' . $arg);
