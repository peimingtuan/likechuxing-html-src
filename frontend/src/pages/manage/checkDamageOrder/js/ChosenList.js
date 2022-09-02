/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ChosenList
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/6-下午5:20
 Description:
 Demo:
 Others:
 *************************************************/
export default class ChosenList {
	list = []
	constructor() {}

	addItem (item){
		if(this.list.indexOf(item) === -1){
			this.list.push(item)
		}
	}

	removeItem (item){
		let index = this.list.indexOf(item)
		if(index > -1){
			this.list.splice(index, 1)
		}
	}

	getList () {
		return this.list
	}


}