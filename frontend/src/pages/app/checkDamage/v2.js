/**
 * Created by garvey on 2017/9/6.
 */
require('./style.less')
import $ from 'jquery'
import {appMutual} from '../../../../other_modules/app-mutual'
import {Toast} from '../../../../other_modules/vue-plugins/like-base/index'
import appArguments from '../../../../other_modules/app-arguments'

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
let sending = false
let selected = []
if(appArguments.hasOwnProperty('parts')){
  appArguments.parts.split('^').forEach(item=>{
    if(/\d+/.test(item))selected.push(Number(item))
  })
}

const container = $('.car_container')
const btn = $('.submit')

init()

function submit () {
  let ids = selected.join('^')
  appMutual.send.damageFinish(ids)
}

function init () {

  // 贴底图
  $('#bg').attr('src', require('./images/bg.png'))

  parts.forEach(part => {
    container.append('<img src="' + part.src + '" class="img part" data-id="' + part.id + '" />')

    container.append('<div class="area" data-areaid="'+part.id+'" data-area="' + part.id + '"></div>')
  })

	if(selected.length>0){
		selected.forEach(item=>{
			$('[data-id="'+item+'"]').show()
		})

		btn.css('visibility','visible')
	}

  $('.area').on('click', function () {
    if(sending)return

    if(selected.length === 10){
      Toast({
        msg:'最多可拍摄10张'
      })
      return
    }
    let id = Number(this.dataset.areaid)
    let part = parts.find(item=>item.id===id)

    $('[data-id="'+part.id+'"]').show()

    sending = true

    setTimeout(function(){
      appMutual.send.damagePart({
        id:id,
        name:part ? part.name : ''
      })
    },300)

  })

  btn.on('click', submit)

  //$('.car_container').css('marginTop', (window.innerHeight - $('.footer').height() - window.innerWidth * 423 / 375 - $('.header').height()) / 2 - 20 + 'px')
}
