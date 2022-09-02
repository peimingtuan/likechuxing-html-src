/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: createRects
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/15-11:44 AM
 Description:
 Param:
 Return:
 *************************************************/
var fs = require('fs');
var babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelConfig);
require('./create.js');
