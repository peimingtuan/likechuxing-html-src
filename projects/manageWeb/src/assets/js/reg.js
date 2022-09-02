/**
 * Created by garvey on 2017/6/26.
 */
const myREG = {
  phone: /^1[34578]\d{9}$/,
  verCode: /^([0-9]{4})$/,
  chinese: /^[\u4e00-\u9fa5]+$/,
  eMail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
}

export default myREG
