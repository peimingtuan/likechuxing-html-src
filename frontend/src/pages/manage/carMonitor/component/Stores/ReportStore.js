/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ReportStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/1-下午2:48
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import ReportActions from './ReportActions'

class ReportStore extends Reflux.Store{
    constructor(){
        super()
        this.listenables = ReportActions
        this.state = {
            menus:[
                {pathname: '/report/fence', name: '围栏报警'},
                {pathname: '/report/stop', name: '停留点'}
            ],
            current_pathname:'/report/fence'
        }
    }

    onChangeCurrentPath(path){
        this.setState({
            current_pathname: path
        })
    }
}

ReportStore.id = 'report'

export default ReportStore