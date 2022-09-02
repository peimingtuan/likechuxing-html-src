/**
 * Created by garvey on 2017/9/14.
 */
import BScroll from 'better-scroll'

function PullUpDown (opt){
	document.querySelector('.wrapper').style.height = opt.wrapperHeight + 'px'
	document.querySelector('.list').style.minHeight = opt.wrapperHeight + 'px'
	this.scroll = new BScroll('.wrapper', {
		startY: -35,
		probeType: 2,
		bounce: true,
		scrollbar: true
	})
	this.header = document.querySelector('.pull_down_text')
	this.footer = document.querySelector('.pull_up_text')
	this.headerStatus = 0
	this.footerStatus = 0
	this.pullDownRefresh = opt.hasOwnProperty('pullDownRefresh') ? opt.pullDownRefresh : function () {}
	this.pullUpLoad = opt.hasOwnProperty('pullUpLoad') ? opt.pullUpLoad : function () {}
	this.headerText = [
		'继续下拉',
		'松开刷新',
		'刷新中...',
		'刷新成功'
	]
	this.footerText = [
		'上拉加载更多',
		'加载中...',
		'没有更多数据了'
	]
	this.init()
}

PullUpDown.prototype.init = function () {
	let that = this
	this.updateText()
	this.scroll.on('scroll', function (e) {
		// 下拉过一定距离，显示'松开刷新'
		if (that.headerStatus === 0 && e.y > 20) {
			that.changeStatus('header', 1)
		}
		// 不松开手指上滑，文字显示回'继续下拉...'
		if (that.headerStatus === 1 && e.y < 20) {
			that.changeStatus('header', 0)
		}
		if (that.footerStatus === 0 && e.y < that.scroll.maxScrollY - 35) {
			that.changeStatus('footer', 1)
		}
	})
	this.scroll.on('touchEnd', function () {
		if (that.headerStatus === 1) {
			that.changeStatus('header', 2)
			that.pullDownRefresh(that.PullDownCallback.bind(that))
		}
		if (that.footerStatus === 1) {
			that.pullUpLoad(that.PullUpLoadCallback.bind(that))
		}
	})
	this.scroll.on('scrollEnd', function (e) {
		if (e.y > -34) {
			// that.scroll.scrollTo(0, -35, 700)
		}
	})
	setTimeout(function () {
		that.scroll.refresh()
	},0)

}

PullUpDown.prototype.changeStatus = function (type, status) {
	this[type + 'Status'] = status
	this.updateText()
}

PullUpDown.prototype.updateText = function () {
	this.header.innerText = this.headerText[this.headerStatus]
	this.footer.innerText = this.footerText[this.footerStatus]
}

PullUpDown.prototype.PullDownCallback = function () {
	// 下拉刷新重置footer状态，当footer=2状态时，下拉刷新后footer恢复成0状态
	this.changeStatus('footer', 0)
	this.changeStatus('header', 3)
	this.scroll.refresh()
	this.scroll.scrollTo(0, -35, 950)
	let that = this
	setTimeout(function () {
		that.changeStatus('header', 0)
	}, 1000)
}

PullUpDown.prototype.PullUpLoadCallback = function (update) {
	if (update) {
		this.scroll.refresh()
		this.changeStatus('footer', 0)
	} else {
		this.changeStatus('footer', 2)
	}
}

export default PullUpDown