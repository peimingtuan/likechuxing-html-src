module.exports = {
  "id": 1001,
  "zh_name": "App行程详情/评价",
  "name": "rentalDetail",
  "group": "app",
  "ver": "1.4.0",
  "bundle_vendor": true,
  "dll":[
    "vueFull",
    "like_base"
  ],
  "copy": true,
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'行程详情',
        meta:['default'],
        appMountId: 'app',
        assets:['amap']
      }
    ]
  }
}