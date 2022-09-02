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
import filterInvalidParams from '../other_modules/like-request/filterInvalidParams.js'

// 测试case
const caseForGetVerification = {
  // 必须通过的case
  base: [
    {
      text: '普通json',
      data: {
        "key1": "value",
        "key2": 23,
        "key3": 23.45
      },
      result: {
        "key1": "value",
        "key2": 23,
        "key3": 23.45
      }
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
      result: {
        "key1": 'value',
        "key2": 23,
        "key3": {
          "key4": "22"
        }
      }
    },
    {
      text: '空参数',
      data: {},
      result: {}
    },
    {
      text: 'value为空字符串',
      data: {
        "key1": "notEmpty",
        "key2": ""
      },
      result: {
        "key1": "notEmpty",
        "key2": ""
      }
    },
    {
      text: 'value为undefined/null/NaN',
      data: {
        "key1": "notEmpty",
        "key2": undefined,
        "key3": null,
        "key4": NaN
      },
      result: {
        "key1": "notEmpty",
        "key2": 'undefined',
        "key3": 'null',
        "key4": 'NaN'
      }
    }
  ]
}

describe('filterInvalidParams', function () {
  describe('base', function () {
    caseForGetVerification.base.forEach(item => {
      it(item.text, function () {
        assert.deepStrictEqual(filterInvalidParams(item.data), item.result)
      })
    })
  })

});