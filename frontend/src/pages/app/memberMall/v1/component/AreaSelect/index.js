/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/12-下午6:51
 Description:
 Param:
 Return:
 *************************************************/
import $ from 'jquery'
import animateCss from '../../../../../css/animates/animateCss'

const areaData = require('./data/china-area-code')
const areaBox = require('./index.pug')

function getAreaList(key) {
  let _key = String(key)
  let _list = []
  let _data = areaData[_key]
  for (let k in _data) {
    _list.push({
      key: k,
      name: areaData[key][k]
    })
  }
  return _list
}

function padR(str, n, fill) {
  return (str+Array(n+1).join(fill)).substr(0,n);
}
/*
带初始值的用法
new AreaSelect('北京市 市辖区 东城区', function(str){
   // 使用str
})
不带初始值的用法
new AreaSelect(function(str){
   // 使用str
})
 */
export default class AreaSelect {
  constructor() {
    this.switch_text = ['请选择', '城市', '区/县']
    this.switch_show = ['请选择', '城市', '区/县']
    this.select_list = [
      getAreaList('86'), [], []
    ]
    this.active_lv = 0
    this.areaCode = '000000'

    // 如果需要带初始数据
    if (typeof arguments[0] === 'string') {
      let add = arguments[0].split(' ')
      for (let i = 0; i < 3; i++) {
        let area = this.select_list[i].find(item => item.name === add[i])

        if (!area) break;
        this.areaCode = String(area.key)
        this.select_list[i+1] = getAreaList(this.areaCode)
        this.switch_show[i] = area.name
      }
    }

    this.callback = typeof arguments[0] === 'function' ? arguments[0] : arguments[1]

    // 控件添加进DOM
    $('body').append(areaBox())
    this.areaSelect = $('.AreaSelect')
    this.updateDOM()
    this.bindAction()
  }

  // lv:0全国，1省，2市，3区（全部）
  getFullCode(lv) {
    let code = padR(this.areaCode.substr(0, 2*lv), 6, '0')
    return code === '000000' ? '86' : code
  }

  updateDOM() {
    // switch
    this.areaSelect.find('.item').each((index, item) => {
      let el = $(item)
      el.text(this.switch_show[index])

      // active
      if(index === this.active_lv){
        el.addClass('active')
      }else{
        el.removeClass('active')
      }

      // chosen
      if(this.switch_show[index] === this.switch_text[index]){
        el.removeClass('chosen')
      }else{
        el.addClass('chosen')
      }
    })

    // select
    this.areaSelect.find('.select').each((index, item) => {
      let el = $(item)

      // active
      if(index < this.active_lv){
        el.removeClass('right').addClass('left')
      }else if(index > this.active_lv){
        el.removeClass('left').addClass('right')
      }else{
        el.removeClass('left right')
      }

      // chosen
      if(this.switch_show[index] === this.switch_text[index]){
        el.removeClass('chosen')
      }else{
        el.addClass('chosen')
      }

      el.empty().append(this.select_list[index].map(item => {
        let className = 'option'
        if (item.key === this.getFullCode(index + 1))
          className += ' chosen';
        return '<li class="' + className + '" data-lv="'+index+'" data-key="' + item.key + '">' + item.name + '</li>'
      }).join(''))
    })
  }

  bindAction(){
    let that = this
    // 关闭
    this.areaSelect.on('click', '.close,.mask', this.destroy.bind(this))

    // option
    this.areaSelect.on('click', '.option', function () {
      that.areaCode =$(this).attr('data-key')
      let area = that.select_list[that.active_lv].find(item => item.key === that.areaCode)
      that.switch_show = that.switch_show.map((item, index) => {
        if(index === that.active_lv){
          item = area.name
        }else if(index > that.active_lv){
          item = that.switch_text[index]
        }
        return item
      })
      // 当前指针向下移动一位
      that.active_lv++;

      let next_list = getAreaList(that.getFullCode(that.active_lv))
      that.select_list[that.active_lv] = next_list
      // 没有下一级或下一级和本级相同（港澳）则选完了
      if (next_list.length === 0 || that.getFullCode(that.active_lv) === that.getFullCode(that.active_lv -1)) {
        that.finish()
      }
      that.updateDOM()
    })

    // 选中过的switch-item
    this.areaSelect.on('click', '.item.chosen', function () {
      that.active_lv = Number($(this).attr('data-lv'))
      that.updateDOM()
    })
  }

  // 关闭控件
  destroy() {
    animateCss.add(this.areaSelect[0], 'fadeOut')
    animateCss.add(this.areaSelect.find('.selectBox')[0], 'slideOutDown', function () {
      this.areaSelect.remove()
    }.bind(this))
  }

  // 选完了
  finish() {
    let area = this.switch_show.filter((item, index) => item !==this.switch_text[index])
    this.callback(area.join(' '))
    this.destroy()
  }
}