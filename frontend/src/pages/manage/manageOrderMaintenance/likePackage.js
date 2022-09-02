module.exports = {
  "id": 4031,
  "name_zh": "管理App保养工单",
  "name": "manageOrderMaintenance",
  "group": "manage",
  "bundle_vendor": false,
  "copy":true,
  "dll":[
    "jquery",
    "bscroll",
    //"vconsole",
    //"like_request",
    "mint_ui_vue"
  ],
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'保养工单',
        meta:['default'],
        appMountId: 'app',
        assets:['dd','amap','amapUI']
      }
    ]
  }
}