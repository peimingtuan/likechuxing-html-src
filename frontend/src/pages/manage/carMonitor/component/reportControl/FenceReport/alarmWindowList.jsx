/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: alarmWindowList
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/2-下午2:04
 Description:
 Param:
 Return:
 *************************************************/
require('./alarmWindowList.less')
import React from 'react'
import Reflux from 'reflux'
import ReportFenceStore from "../../Stores/ReportFenceStores";
import ReportFenceActions from '../../Stores/ReportFenceActions'
import Table from '../../base/Table/Table'
import Time from '../../../../../../js/function/Time'
import Confirm from '../../../../../../component/confirm'
import AuthStore from '../../Stores/AuthStore'

import Desensitized from '../../../../../../js/function/Desensitized'

class PhoneBox extends Reflux.Component{
  constructor(){
    super()
    this.store = AuthStore
    this.storeKeys = [
      'phone_show'
    ]
  }

  render(){
    if(this.props.data){
      if(!this.state.phone_show){
        return Desensitized.mobilePhone(this.props.data)
      }else{
        return <span>{this.props.data}</span>
      }
    }else{
      return <span>-</span>
    }
  }
}

class RentalBox extends Reflux.Component{
  constructor(){
    super()
    this.store = AuthStore
    this.storeKeys = [
      'rental_link'
    ]
  }

  openRental(){
    window.open('https://admintest.likechuxing.com/rental/detail?id='+this.props.data)
  }

  render(){
    if(this.props.data !== '0'){
      if(this.state.rental_link){
        return <span className="link pointer" onClick={this.openRental.bind(this)}>{this.props.data}</span>
      }else{
        return <span>{this.props.data}</span>
      }
    }else{
      return <span>-</span>
    }
  }
}

class AlarmOperate extends React.Component {
  constructor(){
    super()
  }

  render(){
    return(
      <div className="AlarmOperate">
        <button className="btn dark_btn" onClick={()=>ReportFenceActions.hideAlarm([this.props.data.id])}>
          <i className="iconfont icon-shanchu"/>
          删除
        </button>
      </div>
    )
  }
}

export default class alarmWindowList extends Reflux.Component {
  constructor() {
    super()
    this.stores = [
      ReportFenceStore
    ]
    this.storeKeys = [
      'alarmWindowList'
    ]
  }

  clear(){
    let that = this
    new Confirm({
      type:'confirm',
      title:'提示',
      msg:'即将删除当前页10条报警，确定？',
      confirmButtonCallback:function(){
        let table = that.refs.table
        let list = table.state.list.slice((table.state.page_index - 1) * table.state.items, table.state.page_index * table.state.items)
        let ids = list.map(item=>item.id)
        ReportFenceActions.hideAlarm(ids)
      }
    })
  }

  render() {
    let list = this.state.alarmWindowList.map((item, index)=>{
      item.index = index+1
      item.phone_no_show = <PhoneBox data={item.phone_no}/>
      item.rental_id_show = <RentalBox data={item.rental_id} />
      item.alarm_action_desc = ['驶入报警','驶出报警'][item.alarm_action]
      item.alarm_time_hum = new Time(item.alarm_time).getTime('YYYY-MM-DD HH:mm:ss')
      item.operate = <AlarmOperate data={item}/>
      return item
    })
    return <div className="AlarmWindowList">
      <div className="header">
        共 {this.state.alarmWindowList.length} 条（最多100条，欲查更多请见【统计报表】)
      </div>
      <Table
        ref="table"
        header={[
          {key:'index',name:'序号'},
          {key:'plate_no',name:'车牌'},
          {key:'phone_no_show',name:'手机号'},
          {key:'rental_id_show',name:'订单'},
          {key:'fence_name',name:'触发围栏'},
          {key:'alarm_action_desc',name:'类别'},
          {key:'alarm_time_hum',name:'触发时间'},
          {key:'operate',name:<button className="btn dark_btn" onClick={this.clear.bind(this)}>删除本页</button>}
          ]}
        list={list}
        items={10}
      />
    </div>
  }
}


 