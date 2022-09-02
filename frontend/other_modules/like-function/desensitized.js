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

const getMask = function(int){
  let mask = ''
  while(int>0){
    mask+='*'
    int--
  }
  return mask
}

//中文名字：张三 = 张*  王老五=王**
const maskChineseName = function(fullName) {
  return fullName.charAt(0) + getMask(fullName.length - 1)
}

//中文名字：*+名字
const maskChineseName2 = function(fullName) {
  return '*' + fullName.substr(1)
}

//大陆11位手机号：138****1234
const maskMobile = function(phone) {
  phone = String(phone)
  return phone.substr(0, 3) + getMask(phone.substr(3, 4).length) + phone.substr(7)
}

//大陆身份证号：110***********1234
const maskIdCardNum = function(id) {
  id = String(id)
  let length = id.length
  return id.substr(0, 3) + getMask(id.substr(3, 11).length) + id.substr(length - 4, 4)
}

//大陆身份证号：110*********123456
const maskIdCardNum2 = function(id) {
  id = String(id)
  let length = id.length
  return id.substr(0, 3) + getMask(id.substr(3, 9).length) + id.substr(length - 6, 6)
}

//email:a******@163.com
const maskEmail = function(email) {
  let email_array = email.split('@')
  let first = email_array[0].charAt(0)
  return first + getMask(email_array[0].length - 1) + '@' + email_array[1]
}

//密码：*******
const maskPassword = function(password) {
  return getMask(password.length)
}

// 银行卡号 6200********1234
const maskBankAccount = function(account){
  account = String(account)
  let length = account.length
  return account.substr(0, 4) + getMask(account.substr(4, length-4).length) + account.substr(length - 4, 4)
}

export {
  maskBankAccount,
  maskChineseName,
  maskChineseName2,
  maskEmail,
  maskIdCardNum,
  maskIdCardNum2,
  maskMobile,
  maskPassword
}

