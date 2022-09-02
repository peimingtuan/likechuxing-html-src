/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Desensitized
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/13-下午12:37
 Description:数据脱敏工具
 Demo:
 Others:
 *************************************************/
export default class Desensitized {
  //中文名字：姓+*
  static chineseName(_fullName) {
    let fullName = _fullName || ''
    return fullName.charAt(0) + getMask(fullName.length - 1)
  }

  //中文名字：*+名字
  static chineseName2(_fullName) {
    let fullName = _fullName || ''
    return '*' + fullName.substr(1)
  }

  //大陆11位手机号：138****1234
  static mobilePhone(_phone) {
    let phone = String(_phone || '')
    return phone.substr(0, 3) + getMask(phone.substr(3, 4).length) + phone.substr(7)
  }

  //大陆身份证号：110***********1234
  static idCardNum(_id) {
    let id = String(_id || '')
    let length = id.length
    return id.substr(0, 3) + getMask(id.substr(3, 11).length) + id.substr(length - 4, 4)
  }

  //email:a******@163.com
  static email(_email) {
    let email = _email || ''
    let email_array = email.split('@')
    let first = email_array[0].charAt(0)
    return first + getMask(email_array[0].length - 1) + '@' + email_array[1]
  }

  //密码：*******
  static password(_password) {
    let password = _password || ''
    return getMask(password.length)
  }

  static bankAccount(_account){
    let account = String(_account || '')
    let length = account.length
    return account.substr(0, 4) + getMask(account.substr(4, length-4).length) + account.substr(length - 4, 4)
  }
}

function getMask(int) {
  let mask = ''
  for (let i = 0; i < int; i++) {
    mask += '*';
  }
  return mask
}
