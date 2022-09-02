/**
 * Created by garvey on 2017/9/21.
 */
import $ from 'jquery'
//require('../../js/polyfills')
require('./index.less')
//require('../../css/buttons/button-animate-feedback')
const template = {
  mask: require('./mask.pug'),
  alert: require('./alert.pug'),
  confirm: require('./confirm.pug')
}

class LikeAlert {
  constructor() {
    this.likeAlert = $('<div class="LikeAlert"></div>')
  }

  show() {
    $("body").append(this.likeAlert)
  }

  destroy() {
    this.likeAlert.remove()
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
    this.likeAlert.append('<div class="Toast"><span class="msg">' + msg + '</span></div>')
    this.show()

    setTimeout(this.destroy.bind(this), 2000)
  }
}

class Alert extends LikeAlert {
  defaultOpt = {
    confirmButtonText: '确定',
    confirmButtonCallback: function () {
    }
  }

  constructor(opt) {
    super()
    this.opt = Object.assign({}, this.defaultOpt, opt)
    this.likeAlert.append(template.mask())
    this.likeAlert.append(template.alert(this.opt))
    this.bindAction()
    this.show()
  }

  bindAction() {
    this.likeAlert.find('.confirm_btn').on('click', function () {
      if (typeof this.opt.confirmButtonCallback === 'function') {
        this.opt.confirmButtonCallback()
      }
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
    this.likeAlert.append(template.mask())
    this.likeAlert.append(template.confirm(this.opt))
    this.bindAction()
    this.show()
  }

  bindAction() {
    this.likeAlert.find('.confirm_btn').on('click', function () {
      if (typeof this.opt.confirmButtonCallback === 'function') {
        this.opt.confirmButtonCallback()
      }
      this.destroy()
    }.bind(this))

    this.likeAlert.find('.cancel_btn').on('click', function () {
      if (typeof this.opt.cancelButtonCallback === 'function') {
        this.opt.cancelButtonCallback()
      }
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