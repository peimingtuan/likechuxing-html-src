/**
 * Created by garvey on 2017/8/28.
 */
import md5 from 'md5'
const KEY = 'v6myhf62g18lnv9zq0w2oy9ljdy7zbre'

// 过滤数据，value=''的和key='sign'的不参与签名
function filterKey (array) {
  return array.filter(item => {
    let keys = item.split('=')
    return keys[0] !== 'sign' && keys[1] !== ''
  })
}

// 计算签名
function calculateKey (data) {
  let array = filterKey(data).sort()
  let _str = array.join('K') + 'Kkey=' + KEY
  return md5(_str).toUpperCase()
}

function getVerification (data) {
  let array = []
  if (typeof data === 'string') {
    array = data.split('&')
    return data + '&verification=' + calculateKey(array)
  } else {
    for (let key in data) {
      array.push(key + '=' + data[key])
    }
    return calculateKey(array)
  }
}

export default getVerification
