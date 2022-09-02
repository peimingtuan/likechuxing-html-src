module.exports = {
  "id": 2038,
  "name_zh": "地推注册页(接口带验证)",
  "desc":'和registerCoupon2一样，只是注册接口不一样',
  "name": "registerCoupon3",
  "group": "activity",
  "version": "1.0.0",
  "bundle_vendor": false,
  "copy": true,
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "output_file": {
    "path": "/dist/activity/registerCoupon3/",
    "publicPath": "/",
    "filename": "js/activity_registerCoupon3/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'立刻出行',
        meta:['default'],
        appMountId: 'app',
        assets:['wx']
      }
    ]
  }
}