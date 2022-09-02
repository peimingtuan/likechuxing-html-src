/**
 * Created by Administrator on 2018/2/11.
 */
require('./css/public.css')
require('./css/invitationRules.css')
import resize from './js/resize'
resize();
window.onresize = function () {
    resize();
};