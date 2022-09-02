/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Umeng
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-20-18:22
 * Description:
 *
 *
 *************************************************/
export default class Umeng {
  constructor (id) {
    if (!id)throw new Error('Umeng 中id为空')

    this._czc = window._czc = [["_setAccount", id]]

    this._loadUmengScript(id)
  }

  _loadUmengScript(id){
    let script = document.createElement('script')
    script.type = "text/javascript"
    script.src = "https://s22.cnzz.com/z_stat.php?id=" + id + "&web_id=" + id

    script.onload=function(){
      this._czc = window._czc
    }.bind(this)

    let div = document.createElement('div')
    div.style.display = 'none'
    div.appendChild(script)
    document.body.appendChild(div)
  }

  addEvent(value){
    return new Promise(resolve => {
      this._czc.push(["_trackEvent"].concat(value))
      setTimeout(resolve,200)
    })
  }
}