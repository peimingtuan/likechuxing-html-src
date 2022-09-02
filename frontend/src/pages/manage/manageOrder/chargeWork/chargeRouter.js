//开四停四调度列表
import Vue from 'vue'
import Router from 'vue-router'

import chargelist from './childpages/chargelist' //充电工单列表
import newbuiltcharge from './childpages/newbuiltcharge' //新建充电工单
import chargedetail from './childpages/chargedetail' //充电工单详情
import addchargeinfo from './childpages/addchargeinfo' //添加充电信息
import changetrouble from './childpages/changetrouble' //调故障
import searchchargenet from './childpages/searchchargenet' //搜索充电站
import chargegoline from './childpages/chargegoline' //充电中上线
import addcostinfo from './childpages/addcostinfo' //添加费用信息
import endchargework from './childpages/endchargework' //充电结束信息
import chargeworkfinshed from './childpages/chargeworkfinshed' //充电工单完成
import finsheddetail from './childpages/finsheddetail' //工单完成详情
import choicechargestation from './childpages/choicechargestation' //选择充电站
import checkchargeinfo from './childpages/checkchargeinfo' //查看充电信息
import checkcostinfo from './childpages/checkcostinfo' //查看缴费信息
import checkgolineinfo from './childpages/checkgolineinfo' //查看充电中上线信息
import checkchargepayment from './childpages/checkchargepayment' //查看缴费信息
import chargepayment from './childpages/chargepayment' //添加缴费信息
import carchargelist from './childpages/carchargelist' //车辆充电列表
import mychargelist from './childpages/mychargelist' //我的充电列表

Vue.use(Router)

const router = new Router({
    history: false,
    routes: [
      {//充电工单列表
        path: '/chargelist',
        name: 'chargelist',
        component: chargelist
      },
      {//新建充电工单
        path: '/newbuiltcharge',
        name: 'newbuiltcharge',
        component: newbuiltcharge
      },
      {//充电工单详情
        path: '/chargedetail',
        name: 'chargedetail',
        component: chargedetail
      },
      {//添加充电信息
        path: '/addchargeinfo',
        name: 'addchargeinfo',
        component: addchargeinfo
      },
      {//调故障
        path: '/changetrouble',
        name: 'changetrouble',
        component: changetrouble
      },
      {//搜索充电站
        path: '/searchchargenet',
        name: 'searchchargenet',
        component: searchchargenet
      },
      {//充电中上线
        path: '/chargegoline',
        name: 'chargegoline',
        component: chargegoline
      },
      {//添加费用信息
        path: '/addcostinfo',
        name: 'addcostinfo',
        component: addcostinfo
      },
      {//充电结束信息
        path: '/endchargework',
        name: 'endchargework',
        component: endchargework
      },
      {//充电工单完成
        path: '/chargeworkfinshed',
        name: 'chargeworkfinshed',
        component: chargeworkfinshed
      },
      {//工单完成详情
        path: '/finsheddetail',
        name: 'finsheddetail',
        component: finsheddetail
      },
      {//选择充电站
        path: '/choicechargestation',
        name: 'choicechargestation',
        component: choicechargestation
      },
      {//查看充电信息
        path: '/checkchargeinfo',
        name: 'checkchargeinfo',
        component: checkchargeinfo
      },
      {//查看缴费信息
        path: '/checkcostinfo',
        name: 'checkcostinfo',
        component: checkcostinfo
      },
      {//查看充电中上线信息
        path: '/checkgolineinfo',
        name: 'checkgolineinfo',
        component: checkgolineinfo
      },
      {//查看缴费信息
        path: '/checkchargepayment',
        name: 'checkchargepayment',
        component: checkchargepayment
      },
      {//添加缴费信息
        path: '/chargepayment',
        name: 'chargepayment',
        component: chargepayment
      },
      {//车辆充电列表
        path: '/carchargelist',
        name: 'carchargelist',
        component: carchargelist
      },
      {//我的充电列表
        path: '/mychargelist',
        name: 'mychargelist',
        component: mychargelist
      }
    ]
});

export default router;