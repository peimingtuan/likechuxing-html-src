/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: getVerification
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-30-10:08
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/

let assert = require('assert');
const getVerification = require('../other_modules/like-request/getVerificationV2')
import {h5} from "../other_modules/like-request/keys";

// 测试case
const caseForGetVerification = {
  // 必须通过的case
  base: [
    {
      text:'模拟请求',
      data:{
        "uuid": "1502274754196764",
        "sign": "NGWAJM6Q6QSJW5KMQLCSY3JZFT7CJR4S",
        "user_version": "h5_2109",
        "rental_no": "RE15366594173171",
        "user_sys_version": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
        "device_name": "h5",
        "client_time": 1543549272
      },
      result:'CF4DDED35438517C05B5507FB5FDC88A'
    },
    {
      text: '一级json',
      data: {
        "key1": "value",
        "key2": 23,
        "key3": 23.45
      },
      result: '41FFA801FBF4F24859F4B244B1165221'
    },
    {
      text: '多级json',
      data: {
        "key1": 'value',
        "key2": 23,
        "key3": {
          "key4": "22"
        }
      },
      result: '4FCBE7817CCFAB3C439267F428CB7468'
    },
    {
      text: 'value有空格',
      data: {
        "key1": ' value ',
        "key2": 'val u e'
      },
      result: '68AD085B823A8C93C05A290D8C937B01'
    },
    {
      text: 'key含有sign',
      data: {
        "sign": "sss",
        "notSign": "aa"
      },
      result: 'CD3845AAC1ECBF25BC870C09E6F04896'
    },
    {
      text: 'key含有verification',
      data: {
        "verification": "sss",
        "notVerification": "aa"
      },
      result: '0F98D9AE7818132DE9E006100687C6AF'
    },
    {
      text: '空参数',
      data: {},
      result: '6E70E0CA707786191E862AAA02E99BED'
    },
    {
      text: 'value为空字符串',
      data: {
        "key1": "notEmpty",
        "key2": ""
      },
      result: 'D421D7CB67F82B86C6B5CC1D25032A4B'
    }
  ],

  // 最好通过的case
  better: [
    // 服务端验证逻辑问题，php: trim($string, 'K');
    {
      text: '大写K开头的',
      data: {
        "Key1": "value"
      },
      result: '1D31BD97BE2476F0A4BEAC9C0A490BDE'
    }
  ]
}

describe('getVerification', function () {
  describe('base', function () {
    caseForGetVerification.base.forEach(item => {
      it(item.text, function () {
        assert.equal(getVerification(item.data,h5), item.result)
      })
    })
  })

  describe('better', function () {
    caseForGetVerification.better.forEach(item => {
      it(item.text, function () {
        assert.equal(getVerification(item.data,h5), item.result)
      })
    })
  })

});