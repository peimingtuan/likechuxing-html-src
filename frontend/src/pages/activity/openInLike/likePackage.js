module.exports = {
  "id": 2039,
  "zh_name": "在立刻出行app中打开",
  "name": "openInLike",
  "group": "activity",
  "ver": "1.1.0",
  "bundle_vendor": false,
  "copy": true,
  "input_file": {
    "index": ["index.js"],
    "peccancy": ["peccancy.js"]
  },
  "output_file": {
    "path": "/dist/app/openInLike/",
    "publicPath": "/",
    "filename": "js/app_openInLike/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'立刻出行',
        meta:['default'],
        appMountId: '',
        assets:[]
      },
      {
        name:'peccancy',
        title:'立刻出行',
        meta:['default'],
        appMountId: '',
        assets:[]
      }
    ]
  }
}