/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-上午10:35
 Description:
 Param:
 Return:
 *************************************************/
//window.location.href = 'https://g.eqxiu.com/s/I5TJ8v2k?eqrcode=1'
import $ from 'jquery'
import jobBox from './template/jobBox.pug'
import {Toast,Alert} from '../../../component/LikeAlert/index'
import Loading from '../../../component/loading'
import myAjax from '../../../../other_modules/like-request/withJq'
import {getWebUrl} from '../../../../other_modules/url-constructor'
require('./index.less')
require('../../../component/rem')

const JOB_LIST = [
  {
    id: 1,
    name: '算法工程师',
    num: 5,
    duty: [
      '参与公司智能平台搭建，推动公司业务整体智能化；',
      '分析公司业务与数据，优化公司营运策略及指导业务推进；',
      '构建高效率算法平台，推动算法与业务的结合。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '熟悉常见大数据分析，机器学习平台，掌握常用机器学习模型；',
      '有扎实的编程基础；',
      '有常用大数据平台的使用经验；',
      '团队合作意识良好，乐于解决有挑战的工作，有良好的沟通能力和责任心。'
    ]
  },
  {
    id: 2,
    name: 'PHP 开发工程师',
    num: 5,
    duty: [
      '参与公司产品的开发，包括APP后台API接口、管理平台；',
      '为公司其他部门提供技术服务及支持工作，可以快速理解业务需求；',
      '在开发过程中有书写文档的良好习惯；',
      '工作中乐于与产品、业务部门进行沟通；',
      '工作中乐于与测试同事进行沟通解决程序的bug。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '了解PHP编程，有PHP框架使用经验；',
      '了解PHP结合MySQL的开发；',
      '责任心强有良好文档编写习惯，有团队合作精神；',
      '了解MongoDB及RabbitMQ；',
      '了解百度SDK或高德SDK；',
      '了解支付宝和微信支付开发。'
    ]
  },
  {
    id: 3,
    name: 'HTML5 开发工程师',
    num: 3,
    duty: [
      '负责公司移动端以及PC端的研发；',
      '根据产品需求完成相关功能的开发；',
      '各产品线的界面维护以及性能的优化；',
      '配合后台开发人员进行开发。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '了解HTML5/CSS3/JS等相关技术；',
      '了解jQuery/AJAX等Web开发技术，对页面性能和浏览器兼容有实践经验；',
      '了解网页与服务器间通信协议与过程，了解浏览器缓存机制，有快速定位问题的能力；',
      '了解前端框架中的一种：Angular、React、Vue等；',
      '了解小程序或类似环境产品开发（微信、支付宝、快应用均可）；',
      '热爱前端技术、有高度的技术敏感度、广阔的技术视野；',
      '具有较强的团队合作精神、进取心和求知欲，热爱学习，勇于挑战。'
    ]
  },
  {
    id: 4,
    name: 'iOS 开发工程师',
    num: 2,
    duty: [
      '参与iOS平台应用日常开发与维护；',
      '根据研发规范和项目流程编写相关的技术文档；',
      '与业务部门配合沟通，参与需求分析和软件的详细设计；',
      '持续的优化相关的产品的品质、性能、用户体验。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '理解iOS SDK；',
      '理解面向对象编程思想，具有较强的设计能力；',
      '可熟练查阅英文资料，如Apple官方文档，StackOverflow等；',
      '了解iOS下的高性能编程及性能调优、并行开发、网络管理、内存管理、消息通讯机制、多线程开发；',
      '了解与第三方开发组件集成的技巧及调试工作，如微信支付、分享、推送等；',
      '学习能力强，有自驱力，有强烈的责任心和团队精神，踏实可靠，善于沟通和合作，良好的编码风格。'
    ]
  },
  {
    id: 5,
    name: 'Android 开发工程师',
    num: 2,
    duty: [
      '参与Android 平台应用日常开发与维护；',
      '根据研发规范和项目流程编写相关的技术文档；',
      '与业务部门配合沟通，参与需求分析和软件的详细设计；',
      '持续的优化相关的产品的品质、性能、用户体验。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '了解Android系统架构及相关技术、相应架构，精通Android平台UI设计，了解 Android SDK不同版本的主要特性；',
      '了解Android移动终端特性与开发特点，具备应对Android平台各类常见问题的经验，并对手机软件性能优化有一定的了解；',
      '了解各种主流Android终端设备特性，掌握终端适配工程的特点与方法；',
      '熟识常用软件架构模式，了解常用数据结构与算法，了解JSON及XML数据结构及数据解析，多线程，网络编程（Socket、 http/web service）等；',
      '有良好的团队精神，沟通协调能力，执行力强。'
    ]
  },
  {
    id: 6,
    name: '测试工程师',
    num: 2,
    duty: [
      '参与项目/产品的测试工作，参与产品需求分析，负责测试计划制定,并能预先评估项目风险，确保测试活动的顺利开展；',
      '理解系统内部的设计原理，并能从测试的角度提供优化意见；',
      '根据产品需求和产品设计, 编写功能测试设计和用例；',
      '实施软件测试，完成对产品的集成测试与系统测试；',
      '对软件问题进行跟踪分析和报告，推动测试中发现问题及时合理地解决；',
      '汇总测试执行情况，编写相关报告；',
      '通过总结、对外交流、技术钻研和培训，进行测试过程和测试方法的持续改进。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '了解测试流程和规范，对软件测试工作有浓厚兴趣；',
      '了解Java/Shell/PHP/Python/Ruby等一种语言；',
      '了解Linux，MySQL数据库操作；',
      '很强的学习能力和技术钻研能力，良好的沟通能力，善于团队合作。',
    ]
  },
  {
    id: 7,
    name: 'UI 设计师',
    num: 2,
    duty: [
      '参与公司软件产品设计，满足业务视觉需求；',
      '参与界面风格研究和定义，及提升用户体验；',
      '同产品经理、交互设计师密切合作，构建界面及优化；',
      '给出现有产品易用性改善，探索新方案，对产出的设计质量负责。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '良好的视觉表现力；',
      '了解相关软件，Photoshop、Illustrator、Sketch等工具；',
      '良好的沟通能力和跨部门合作精神；',
      '拥有优秀的行业感知能力，思路清晰和学习能力；',
      '了解流行技术和趋势。'
    ]
  },
  {
    id: 8,
    name: '交互设计师',
    num: 2,
    duty: [
      '参与产品规划和构思，及创意过程；',
      '分析业务需求，拆解任务，归纳人机界面需求；',
      '产出业务的原型和用户操作流程，编写人机交互说明书等；',
      '参与和维护交互规范和标准，跟踪规范的实施；',
      '参与其他流程类的完善和优化工作。'
    ],
    skill: [
      '2019届本科及以上学历；',
      '了解常用交互软件和工作软件；',
      '有创造力和激情，有手动实践加分；',
      '逻辑思维能力强，了解业务和需求，有分解任务的技巧；',
      '开朗、乐观，能同不同背景人合作；',
      '了解视觉和代码相关；',
      '有大局观，可以在复杂条件下找到平衡方法。'
    ]
  }
]

$('.list').append(JOB_LIST.map(item=>jobBox(item)).join(''))
  .find('.job')
  .click(function(){
    let parent = $(this).parent()
    let id = parent[0].dataset.id

    $('.list>.item.open').each(function(index,item){
      if($(item).attr('data-id') !== id){
        $(item)
          .toggleClass('open')
          .find('.detail')
          .css({display:'none'})
      }
    })
    if(!parent.hasClass('open')){
      $("body,html").animate({
        scrollTop:parent.offset().top //让body的scrollTop等于pos的top，就实现了滚动
      },300);
    }
    parent.toggleClass('open')
      .find('.detail')
      .slideToggle()
  })

$('.btn').click(function(){
  let parent = $(this).parent()
  let data = {
    job:this.dataset.id,
    name:parent.find('.name').val(),
    phone_no:parent.find('.phone').val()
  }

  if(data.name.length<1){
    new Toast('请输入姓名')
    return
  }
  if(!/^1[3456789]\d{9}$/.test(data.phone_no)){
    new Toast('请输入正确的手机号')
    return
  }

  let loading = new Loading()
  let time = new Date().getTime()
  myAjax.post(getWebUrl('/campus/attend'),data,function(res){
    let time1 = new Date().getTime()
    let after = 0
    if((time1-time)<1200){
     after = 1200 - (time1-time)
    }
    setTimeout(function(){
      loading.destroy()
      if(res.status === 0){
        new Toast('我们已收到您的申请，请耐心等待')
        parent.find('.name').val('')
        parent.find('.phone').val('')
      }else{
        new Toast(res.msg)
      }
    },after)
  })
})

