/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: orderStatus
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/4-下午12:01
 Description:
 Param:
 Return:
 *************************************************/
var biztype = 
	[
	   {status:0, name:'全部'},
	   {status:1, name:'B类网点'},
	   {status:2, name:'B+类网点'},
   ]
var distype = [
   {status:1, name:'缺油/电'},
   {status:2, name:'低油/电'},
   {status:3, name:'正常'},
]

exports.bizfun = biztype;
exports.disfun = distype;
// module.exports = [
// {status:0, name:'全部'},
// {status:1, name:'B类网点'},
// {status:2, name:'B+类网点'},
// 
// ]
