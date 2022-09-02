/**
 * Created by garvey on 2017/9/7.
 */

require('../css/explain216.less')
require('./index.less')
require('../../../component/rem')
require('../../../css/buttons/button-v2.less')

setCss()
/*document.querySelectorAll('.tel').forEach(item => item.addEventListener('click', function () {
  let link = document.createElement('a')
  link.href = 'tel://4006662333'
  link.click()
}))*/

function setCss() {
  let btn = document.querySelector('.btn-con')
  let height = window.innerHeight
  btn.style.marginTop = height - document.body.offsetHeight - 0.1 * REM + 'px'
}