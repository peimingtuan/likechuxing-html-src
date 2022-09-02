/* @xurr 兑换话费劵说明  080606 
 *描述：列表页面，显示劵码及话费充值方法
 */
require('./css/phoneDetail.css')
import $ from 'jquery'
import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData();
let phoneData = memberMallData.state.goodsDetail.extra_info
//渲染数据
$('#goodsName').text(phoneData.name);
$('#goodsNum').text(phoneData.coupon_val);

