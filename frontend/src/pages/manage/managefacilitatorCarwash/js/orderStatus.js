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
	   {status:1, name:'合格'},
	   {status:2, name:'不合格'},
   ]
var distype = [
    //{status:0, name:'全部'},
    {status:1, name:'洗车中'},
    {status:2, name:'待检查'},
    {status:3, name:'已完成'},
    {status:4, name:'已取消'}
]

exports.bizfun = biztype;
exports.disfun = distype;
