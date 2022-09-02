require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../page/index/index');
require('../../page/coupon/list');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
