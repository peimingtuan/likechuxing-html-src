/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/30-上午11:57
 Description:
 Others:
 *************************************************/
import getEnv from '../../js/env'
const VConsole = require('vconsole')
require('./index.less')

if (getEnv() === 'development') {
  new VConsole()
}
