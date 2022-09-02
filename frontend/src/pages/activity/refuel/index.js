import './css/index.less'

const IMGS = [
  require('./images/step_01.jpg'),
  require('./images/step_02.jpg'),
  require('./images/step_03.jpg'),
  require('./images/step_04.jpg'),
  '*发票抬头不限，加油发票您可自行处理',
  require('./images/step_05.jpg'),
  require('./images/step_06.jpg'),
  require('./images/step_07_2.jpg'),
  '*自主加油费用无法开发票'
]

let container = document.querySelector('#imgs')

const loadImg = function(index){
  if(/^\*/.test(IMGS[index])){
    // 文字
    let p = document.createElement('p')
    p.className = 'pr'
    p.appendChild(document.createTextNode(IMGS[index]))
    container.appendChild(p)
    if(index < IMGS.length-1){
      loadImg(index+1)
    }
  }else{
    // 图片
    let img = document.createElement('img')
    img.src= IMGS[index]
    if(index < IMGS.length-1){
      img.onload = function(){
        loadImg(index+1)
      }
    }
    container.appendChild(img)
  }

}

loadImg(0)