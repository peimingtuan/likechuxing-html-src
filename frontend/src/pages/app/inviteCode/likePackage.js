module.exports = {
  "id": 1010,
  "zh_name": "邀请码v3",
  "name": "inviteCode",
  "group": "app",
  "ver": "3.0.0",
  "bundle_vendor": false,
  "dll":[
    "vuer",
    "like_base"
  ],
  "copy": true,
  "input_file": {
    "index": [
      "index.js"
    ],
    "share": [
      "share.js"
    ]
  },
  "output_file": {
    "path": "/dist/app/inviteCode/",
    "publicPath": "/",
    "filename": "js/app_inviteCode/[name].js"
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'邀请好友',
        meta:['default'],
        appMountId: 'app',
        assets:['wx']
      },
      {
        name:'share',
        title:'优惠券',
        meta:['default'],
        appMountId: 'app',
        assets:['wx']
      }
    ]
  }
}