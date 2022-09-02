module.exports = {
  "id": 885,
  "zh_name": "a2b订单航线图",
  "name": "a2bBranchMap2s",
  "group": "test",
  "ver": "1.3.0",
  "bundle_vendor": false,
  "copy":true,
  dll:['vue','like_base'],
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  all_in_html:true,
  "template": {
    manual_list:[
      {
        name:'index',
        title:'',
        meta:['default'],
        appMountId: 'app',
        assets:['amap','amapUI','amapLoca']
      }
    ]
  }
}