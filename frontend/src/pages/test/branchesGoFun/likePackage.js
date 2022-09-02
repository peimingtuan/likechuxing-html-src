module.exports = {
  "id": 888,
  "zh_name": "gofun成都",
  "name": "branchesGoFun",
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
  "output_file": {
    "path": "/dist/manage/branchesGoFun/",
    "publicPath": "/",
    "filename": "js/manage_branchesGoFun/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'',
        meta:['default'],
        appMountId: 'app',
        assets:['amap','amapUI']
      }
    ]
  }
}