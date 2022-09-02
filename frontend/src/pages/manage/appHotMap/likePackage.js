module.exports = {
  "id": 4001,
  "zh_name": "业务热力图",
  "name": "appHotMap",
  "group": "manage",
  "ver": "1.3.0",
  "bundle_vendor": false,
  "copy":true,
  dll:['vue','like_base'],
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "output_file": {
    "path": "/dist/manage/appHotMap/",
    "publicPath": "/",
    "filename": "js/manage_appHotMap/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'App PV热力图',
        meta:['default'],
        appMountId: 'app',
        assets:['amap','amapUI']
      }
    ]
  }
}