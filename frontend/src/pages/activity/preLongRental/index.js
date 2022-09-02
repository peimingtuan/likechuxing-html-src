/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/11-下午6:23
 Description:
 Param:
 Return:
 *************************************************/

require('./index.less')
import $ from 'jquery'
import Umeng from '../../../component/umeng'
new Umeng(1272197132)
require('../../../component/rem')

$('.bg').height(window.innerHeight)
