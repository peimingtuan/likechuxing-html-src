<?php
$arg = '';
foreach ($_REQUEST as $key => $val) {
    $arg = $arg . $key . '=' . $val . '&';
}
$arg = substr($arg, 0, strlen($arg) - 1);
header('Location:/app/rentalDetail/index.html?' . $arg.'#/photos?from=rental&rental_id='.$_REQUEST['rental_id']);
