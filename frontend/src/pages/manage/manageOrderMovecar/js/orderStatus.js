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
	   {status:'', name:'全部'},
	   {status:1, name:'现场挪车'},
	   {status:2, name:'远程开门挪车'},
	   {status:3, name:'现场临时开门'},
   ]
var distype = [
   {status:1, name:'缺油/电'},
   {status:2, name:'低油/电'},
   {status:3, name:'正常'},
]
var disWarn = [
// {status:-1, name:'全部'},
   {status:1, name:'挪车中'},
   {status:2, name:'已完成'},
]

exports.bizfun = biztype;
exports.disfun = distype;
exports.warnfun = disWarn;
// module.exports = [
// {status:0, name:'全部'},
// {status:1, name:'B类网点'},
// {status:2, name:'B+类网点'},
// 
// ]
