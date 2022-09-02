/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/22-上午10:57
 Description:
 Demo:
 Others:
 *************************************************/
import getVer from '../../../../other_modules/like-request/getVerification'

let data = {
  "logistic_address":"广东省 广州市 增城区 广州市增城区永宁街翟洞村新屋六街8号榄元工业区A3栋后5格后铁皮",
  "client_time":"1536914349"
}

let data2 = {

  "uuid":"1528642458573768",
  "sign":"V4HC3KEMD75GTEWWB7Y9FC54Y9UUFPTD",
  "id":28,
  "logistic_user_name":"吴佳杰",
  "logistic_user_phone":"18078825851",
  "logistic_address":"广东省 广州市 增城区 广州市增城区永宁街翟洞村新屋六街8号榄元工业区A3栋后5格后铁皮",
  "user_version":"h5_2106",
  "user_sys_version":"Mozilla/5.0(Linux;Android8.0;SM-G9350Build/R16NW;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/57.0.2987.132MQQBrowser/6.2TBS/044207MobileSafari/537.36likechuxing/2201",
  "device_name":"h5",
  "client_time":"1536914349",
  "verification":"C041C3C949150FD4568FA1E0011784F6"
}

console.log(getVer(data2))