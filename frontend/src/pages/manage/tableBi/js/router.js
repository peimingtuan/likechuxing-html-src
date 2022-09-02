/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/7-下午2:04
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'

import CityChart from '../pages/cityChart.vue'
import UserChart from '../pages/userChart.vue'
import DepositChart from '../pages/depositChart.vue'
import CarChart from '../pages/carChart.vue'
import BranchChart from '../pages/branchChart.vue'
import ChannelChart from '../pages/channelChart.vue'

Vue.use(Router)

const router = new Router({
	mode: 'hash',
	routes: [
		{
			path: '/',
			component: CityChart
		},
		{
			path: '/userChart',
			component: UserChart
		},
		{
			path: '/depositChart',
			component: DepositChart
		},
		{
			path: '/carChart',
			component: CarChart
		},
		{
			path: '/branchChart',
			component: BranchChart
		},
		{
			path: '/channelChart',
			component: ChannelChart
		}
	]
})

export default router
