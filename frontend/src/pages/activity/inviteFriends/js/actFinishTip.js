/**
 * Created by garvey on 2017/10/11.
 */
import Confirm from '../../../../component/confirm'
import getApiUrl from '../../../../js/getApiUrl'
import axios from 'axios'

axios.get(getApiUrl('/time/get')).then( res => {
	// 活动结束：2017-10-18 24:00:00 = 1508342400
	if (res.data.data.timestamp < 1508342400){
		return
	}
	new Confirm({
		type: 'alert',
		msg: '活动已经结束，感谢您的关注',
		confirmButtonText: '查看榜单',
		confirmButtonCallback: function () {
			window.location.replace('winnerList.html')
		}
	})
})
