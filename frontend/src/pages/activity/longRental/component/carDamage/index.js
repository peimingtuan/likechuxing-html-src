/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/27-下午2:28
 Description:车辆损伤部位模块，提供父级div容器，可显示、
 选择车伤部位
 Others:
 *************************************************/
require('../../../../../js/polyfills')
let bg = require('./index.pug')
require('./index.less')
let part_list = require('./part_list.json')

export default class carDamage {
	data = {}
	constructor (opt) {
		let img_bg = require('./images/bg.png')
		let array19 = []
		for (let i=0; i<19;i++){ array19.push(0) }
		let img_list = array19.map( (item, index) => require('./images/part'+(index+1)+'.png'))
		this.selected = null
		let clickable = opt.clickable || false
		opt.parent.innerHTML = bg({
			img_bg,
			img_list,
			clickable
		})

		let that = this
		opt.parent.addEventListener('click', function (e) {
			let ele = e.target
			if (ele.className !== 'area'){
				return
			}

			let area = part_list.find( item => ele.dataset.areaid == item.id)
			if(area !== undefined ){
				that.selected = area
				if (typeof opt.clickCallback === 'function'){
					opt.clickCallback(area)
				}
			}
		})
	}

	getSelected () {
		return this.selected === null ? false : this.selected
	}

	getParts () {
		let container = document.querySelector('.carDamage_container')
		return part_list.map( (item) => {
			return {
				id: item.id,
				partName: item.partName,
				imgElement: container.querySelector('.part[data-id="'+item.id+'"]')
			}
		})
	}
}