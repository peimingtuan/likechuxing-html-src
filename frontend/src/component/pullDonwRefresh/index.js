/**
 * Created by garvey on 2017/9/14.
 */
import BScroll from 'better-scroll'
require('./index.less')
let wrapper = require('./index.pug')

function PullUpDown (opt){
	opt.parent.innerHTML = wrapper({
		className: opt.listClassName || ''
	})
	this.content = document.querySelector('.wrapper_list')
	this.content.innerHTML = opt.content || ''
	this.content.style.minHeight = opt.parent.offsetHeight + 'px'
	this.scroll = new BScroll('.wrapper', {
		startY: -35,
		probeType: 2,
		bounce: true,
		scrollbar: true,
		click: true
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
		'松开加载',
		'加载中...',
		'没有更多数据了'
	]
	this.init()
}

PullUpDown.prototype.init = function () {
	let that = this
	that.changeStatus('header', 0)
	that.changeStatus('footer', 0)
	this.scroll.on('scroll', function (e) {
		// 下拉过一定距离，显示'松开刷新'
		if (that.headerStatus === 0 && e.y > 0) {
			that.changeStatus('header', 1)
		}
		// 不松开手指上滑，文字显示回'继续下拉...'
		if (that.headerStatus === 1 && e.y < 0) {
			that.changeStatus('header', 0)
		}
		if (that.footerStatus === 0 && e.y < that.scroll.maxScrollY - 10) {
			that.changeStatus('footer', 1)
		}
	})
	this.scroll.on('touchEnd', function () {
		if (that.headerStatus === 1) {
			that.changeStatus('header', 2)
			that.pullDownRefresh(that.PullDownCallback.bind(that))
		}
		if (that.footerStatus === 1) {
			that.changeStatus('footer', 2)
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
		this.changeStatus('footer', 3)
	}
}

PullUpDown.prototype.changeContent = function (str){
	this.content.innerHTML = str
	this.scroll.refresh()
}

PullUpDown.prototype.appendContent = function (str){
	let _content = this.content.innerHTML
	this.content.innerHTML = _content + str
	this.scroll.refresh()
}

export default PullUpDown

/*
* let pullUpDown = new PullUpDown({
*		listClassName: '容器附加class，默认空',
*		content: '当前列表内容字符串，<li>1</li><li>2</li><li>3</li>',
*		parent:document.querySelector('.listContainer'),父元素
*		pullDownRefresh: function (cb) {
*			//下拉刷新触发，接收到返回数据后执行cb()
*		},
*		pullUpLoad: function (cb) {
*			//上拉加载触发，如果没有更多内容则cb(false),还有更多页则cb(true)
*		}
*	})
*
* //手动固定父元素的高，否则scroll不起作用
* $('.listContainer').height($(window).height())
*
*
*
*
*
*/