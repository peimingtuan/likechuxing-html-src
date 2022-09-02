/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: unicode
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/11-下午2:33
 Description:
 Param:
 Return:
 *************************************************/
//console.log(decodeUnicode(toUnicode('天安门')))

function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

function encodeUnicode(s){
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,function(newStr){
        return "\\u" + newStr.charCodeAt(0).toString(16);
    });
}

export {decodeUnicode, encodeUnicode}