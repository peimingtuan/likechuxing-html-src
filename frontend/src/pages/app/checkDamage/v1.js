/**
 * Created by garvey on 2017/9/6.
 */
require('./style.less')
import toast from '../../../component/toast'
import $ from 'jquery'
import {appMutual} from '../../../../other_modules/app-mutual'

let parts = [
  {id:1,name:'前保险杠',chosen:false,src:require('./images/part1.png')},
  {id:2,name:'右后视镜',chosen:false,src:require('./images/part2.png')},
  {id:3,name:'右前叶子板',chosen:false,src:require('./images/part3.png')},
  {id:4,name:'右前轮',chosen:false,src:require('./images/part4.png')},
  {id:5,name:'右前门',chosen:false,src:require('./images/part5.png')},
  {id:6,name:'右后门',chosen:false,src:require('./images/part6.png')},
  {id:7,name:'右后轮',chosen:false,src:require('./images/part7.png')},
  {id:8,name:'右后叶子板',chosen:false,src:require('./images/part8.png')},
  {id:9,name:'后保险杠',chosen:false,src:require('./images/part9.png')},
  {id:10,name:'左后叶子板',chosen:false,src:require('./images/part10.png')},
  {id:11,name:'左后轮',chosen:false,src:require('./images/part11.png')},
  {id:12,name:'左后门',chosen:false,src:require('./images/part12.png')},
  {id:13,name:'左前门',chosen:false,src:require('./images/part13.png')},
  {id:14,name:'左前轮',chosen:false,src:require('./images/part14.png')},
  {id:15,name:'左前叶子板',chosen:false,src:require('./images/part15.png')},
  {id:16,name:'左后视镜',chosen:false,src:require('./images/part16.png')},
  {id:17,name:'前机器盖',chosen:false,src:require('./images/part17.png')},
  {id:18,name:'车顶',chosen:false,src:require('./images/part18.png')},
  {id:19,name:'后备箱盖',chosen:false,src:require('./images/part19.png')}
]
const container = $('.car_container')
const btn = $('.submit')
let chosen = false

init()

function checkParts (part) {
  let element = document.querySelector('[data-id="' + part.id + '"]')
  if (part.chosen) {
    element.style.display = 'block'
  } else {
    element.style.display = 'none'
  }

  if (parts.some(part => part.chosen)) {
    changeStatus(true)
  } else {
    changeStatus(false)
  }
}

function changeStatus (flag) {
  if (chosen == !!flag) {
    return
  }

  chosen = !!flag

  if (chosen) {
    btn.text('外观有伤，上传照片')
  } else {
    btn.text('外观无伤，跳过')
  }
}

function submit () {

  if ($('.agree_icon').hasClass('disable')) {
    toast('请同意《立刻出行验车服务条款》')
    return
  }

  let ids = chosen ? '^' + parts.filter(item => item.chosen).map(item => item.id).join('^') + '^' : ''
  appMutual.send.damage(ids)

}

function init () {

  // 贴底图
  $('#bg').attr('src', require('./images/bg.png'))

  parts.forEach(part => {
    container.append('<img src="' + part.src + '" class="img part" data-id="' + part.id + '" />')

    container.append('<div class="area" data-area="' + part.id + '"></div>')
  })

  $('.area').on('click', function () {
    let area_id = Number(this.dataset.area)>19?Number(this.dataset.areaid):Number(this.dataset.area)
    let part = parts.find(item => item.id === area_id)
    if (part) {
      part.chosen = !part.chosen
      checkParts(part)
    }
  })

  btn.on('click', submit)

  // 服务条款按钮
  $('.agree_icon').on('click', function () {
    let this_j = $(this)
    if (this_j.hasClass('disable')) {
      this_j.removeClass('disable')
      btn.removeClass('disabled')
    } else {
      this_j.addClass('disable')
      btn.addClass('disabled')
    }
  })

  //$('.car_container').css('marginTop', (window.innerHeight - $('.footer').height() - window.innerWidth * 423 / 375 - $('.header').height()) / 2 - 20 + 'px')
}
