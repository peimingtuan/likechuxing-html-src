/**
 * Created by garvey on 2017/9/26.
 */
export default function (prize) {
	switch (prize) {
		case 'iPhone X' :
			return require('../../images/gift_iphonex.png')
			break;
		case 'iPhone 8' :
			return require('../../images/gift_iphone8.png')
			break;
		case '魅蓝5手机' :
			return require('../../images/gift_mezi5.png')
			break;
		case '魅蓝6手机' :
			return require('../../images/gift_mezi5.png')
			break;
		case '小米手环2' :
			return require('../../images/gift_miband.png')
			break;
		case '30元用车券' :
			return require('../../images/gift_coupon.png')
			break;
		case '未获奖':
			return '未获奖'
			break;
		default:
			return ''
	}
}