/**
 * Created by garvey on 2017/9/21.
 */
require('../../../js/polyfills')
require('./index.less')
import animateCss from '../../../css/animates/animateCss'

const template = {
  mask: '<div class="Mask animated fast fadeIn"></div>',
  alert: require('./alert.pug'),
  confirm: require('./confirm.pug')
}

class LikeAlert {
  constructor() {
    this.container = document.body
    this.likeAlert = document.createElement('div')
    this.likeAlert.className = 'LikeAlert'
  }

  show() {
    this.container.appendChild(this.likeAlert)
  }

  destroy() {
    this.container.removeChild(this.likeAlert)
    this.likeAlert = null
  }
}

class Toast extends LikeAlert {
  /**
   * 提示框，2秒自动消失
   *
   * @param {string} msg 要显示的文字
   */
  constructor(msg) {
    super()
    this.likeAlert.innerHTML = '<div class="Toast animated faster fadeIn"><span class="msg">' + msg + '</span></div>'
    this.show()

    setTimeout(this.close.bind(this), 2000)
  }

  close(){
    animateCss.add(this.likeAlert.querySelector('.Toast'), 'fadeOut', this.destroy.bind(this))
  }
}

class Alert extends LikeAlert {
  defaultOpt = {
    confirmButtonText: '确定'
  }

  constructor(opt) {
    super()
    this.opt = Object.assign({}, this.defaultOpt, opt)
    this.likeAlert.innerHTML = template.mask + template.alert(this.opt)
    this.bindAction()
    this.show()
  }

  bindAction() {
    this.likeAlert.querySelector('.confirm_btn').addEventListener('click', function(){
      if (typeof this.opt.confirmButtonCallback === 'function') {
        this.opt.confirmButtonCallback()
      }
      this.close()
    }.bind(this))
  }

  close(){
    animateCss.add(this.likeAlert.querySelector('.Mask'), 'fadeOut')
    animateCss.add(this.likeAlert.querySelector('.dialogBox'), 'zoomOut', function(){
      this.destroy()
    }.bind(this))
  }
}

class Confirm extends LikeAlert {
  defaultOpt = {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }

  constructor(opt) {
    super()
    this.opt = Object.assign({}, this.defaultOpt, opt)
    this.likeAlert.innerHTML = template.mask + template.confirm(this.opt)
    this.bindAction()
    this.show()
  }

  bindAction() {
    this.likeAlert.querySelector('.confirm_btn').addEventListener('click', function () {
      if (typeof this.opt.confirmButtonCallback === 'function') {
        this.opt.confirmButtonCallback()
      }
      this.close()
    }.bind(this))

    this.likeAlert.querySelector('.cancel_btn').addEventListener('click', function () {
      if (typeof this.opt.cancelButtonCallback === 'function') {
        this.opt.cancelButtonCallback()
      }
      this.close()
    }.bind(this))
  }

  close(){
    animateCss.add(this.likeAlert.querySelector('.Mask'), 'fadeOut')
    animateCss.add(this.likeAlert.querySelector('.dialogBox'), 'zoomOut', function(){
      this.destroy()
    }.bind(this))
  }
}

export {Toast, Alert, Confirm}

/*
new Toast('toast消息')

new Alert({
	title:'标题',
	msg:'msg',
	confirmButtonText:'确定',默认确定
	confirmButtonCallback: function(){}
})

new Confirm({
    title:'标题',
    msg:'msg',
    confirmButtonText:'确定',默认确定
    confirmButtonCallback: function(){},
    cancelButtonText:'取消',默认取消
    cancelButtonCallback: function(){}
})
*/