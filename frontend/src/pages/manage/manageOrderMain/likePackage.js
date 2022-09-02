module.exports = {
  "id": 4019,
  "zh_name": "管理APP钉钉-入口",
  "name": "manageOrderMain",
  "group": "manage",
  "copy": true,
  "bundle_vendor": false,
  "dll":[
    //"vconsole",
    "mint_ui_vue",
    //"like_request"
  ],
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "output_file": {
    "path": "/dist/manage/manageOrderMain/",
    "publicPath": "/",
    "filename": "js/manage_manageOrderMain/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'立刻运维工单-钉钉',
        meta:['mobile','copyright'],
        appMountId: 'app',
        assets:['dd','amap']
      }
    ]
  }
}