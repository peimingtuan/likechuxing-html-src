/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/27-下午2:28
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import Header from '../Header/index.jsx'
import Route from '../../base/Route'
import TrackContent from '../../trackControl/TrackContent'
import ReportContent from '../../reportControl/ReportContent'
import ConfigContent from '../../configControl/ConfigContent'

import HeaderStore from '../../Stores/HeaderStore'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import CarStore from '../../Stores/CarStore'
import BranchStore from '../../Stores/BranchStore'
import AuthStore from '../../Stores/AuthStore'

import AuthActions from '../../Stores/AuthActions'

class MainPage extends Reflux.Component {
  constructor() {
    super()
    this.stores = [
      HeaderStore,
      TrackSearchStore,
      CarStore,
      BranchStore,
      AuthStore
    ]
    this.storeKeys = []
  }

  componentDidMount(){
    AuthActions.getPermission()
  }

  render() {
    return (
      <div className="MainPage">
        <Header/>
        <div className="Content" style={{height: window.innerHeight - 44}}>
          <Route store={HeaderStore} storeKeys={['current_pathname']} pathname='/' component={<TrackContent/>}/>
          <Route store={HeaderStore} storeKeys={['current_pathname']} pathname='/manage' component={<ConfigContent/>}/>
          <Route store={HeaderStore} storeKeys={['current_pathname']} pathname='/report' component={<ReportContent/>}/>
        </div>
      </div>
    )
  }
}

export default MainPage
