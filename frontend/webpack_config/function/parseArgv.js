/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: parseArgv
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-22-14:16
 * Description:
 *
 *************************************************/
module.exports = (function(){

  let argv = {}

  process.argv.slice(2).forEach(item => {

    // 检测cp字段
    if (/cp/i.test(item)) argv.copy = true

    // 检测是否要启用打包分析
    if(/analyze/.test(item)) argv.analyze = true

    // 过滤项目id
    if (/^\d{1,4}$/.test(item)) argv.project_id = Number(item)

    // 废弃方式提示
    if (/^\d{1,4}cp/.test(item)) throw new Error('您正在使用已经停用方式拼接cp参数，请尝试npm run build XXXX cp')

  })

  return argv

})()