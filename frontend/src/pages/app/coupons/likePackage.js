module.exports = {
  "id": 1004,
  "zh_name": "优惠券",
  "name": "coupons",
  "group": "app",
  "ver": "2.0.0",
  "bundle_vendor": false,
  "dll":[
    "vueFull",
    "like_base",
    "bscroll"
  ],
  "copy": true,
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "output_file": {
    "path": "/dist/app/coupons/",
    "publicPath": "/",
    "filename": "js/app_coupons/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'优惠',
        meta:['default'],
        appMountId: 'app',
        assets:[]
      }
    ]
  }
}