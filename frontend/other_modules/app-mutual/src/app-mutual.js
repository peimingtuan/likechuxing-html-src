/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: app-mutual
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-上午11:46
 Description:
 Param:
 Return:
 *************************************************/
import MutualSend from './MutualSend'
import MutualShare from './MutualShare'
import MutualJump from './MutualJump'

const send = new MutualSend()
const share = new MutualShare()
const jump = new MutualJump()

export default {
  appArguments:send.appArguments,
  send,
  share,
  jump
}

