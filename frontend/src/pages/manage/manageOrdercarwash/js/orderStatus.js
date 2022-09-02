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
        {status:1, name:'洗车中'},
        {status:2, name:'已完成'}
   ]
var distype = [
    {status:1, name:'无法开门'},
    {status:3, name:'找不到车'},
    {status:2, name:'车内存在呕吐物'},
]

exports.bizfun = biztype;
exports.disfun = distype;
