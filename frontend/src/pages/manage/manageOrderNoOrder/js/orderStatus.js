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
	   {status:1, name:'预警'},
	   {status:2, name:'故障'},
   ]
var disWarn = [
   {status:0, name:'全部'},
   {status:2, name:'待追车'},
   {status:3, name:'追车中'},
]
exports.bizfun = biztype;
exports.warnfun = disWarn;
