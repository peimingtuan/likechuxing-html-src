/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/23-下午3:09
 Description:
 Param:
 Return:
 *************************************************/
import MAP_MAIN from './class.MAP_MAIN'
import MAP_CALL from './class.MAP_CALL'
import MAP_RENTAL_DETAIL from './class.MAP_RENTAL_DETAIL'
import MAP_RENTAL from './class.MAP_RENTAL'
import MAP_END_BRANCH from './class.MAP_END_BRANCH'
import MAP_END_BRANCH_CONFIRM from './class.MAP_END_BRANCH_CONFIRM'

const mainMap = new MAP_MAIN()
const endBranchMap = new MAP_END_BRANCH()
const callMap = new MAP_CALL()
const rentalDetailMap = new MAP_RENTAL_DETAIL()
const rentalMap = new MAP_RENTAL()
const endBranchConfirmMap = new MAP_END_BRANCH_CONFIRM()

/*window.mainMap = new MAP_MAIN()*/
//window.endBranchMap = new MAP_END_BRANCH()
window.callMap = new MAP_CALL()
window.rentalDetailMap = new MAP_RENTAL_DETAIL()
window.rentalMap = new MAP_RENTAL()
//window.endBranchConfirmMap = new MAP_END_BRANCH_CONFIRM()

export {
  mainMap,
  endBranchMap,
  callMap,
  rentalDetailMap,
  rentalMap,
  endBranchConfirmMap
}



