/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getRandStr
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/29-下午6:38
 Description:
 Param:
 Return:
 *************************************************/
const STRING = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'
]

function getRandLetter(){
  return STRING[Math.floor(Math.random()*STRING.length)]
}

 export default function getRandStr (int){
  let str = ''
   while (str.length < int){
    str+=getRandLetter()
   }
   return str
}