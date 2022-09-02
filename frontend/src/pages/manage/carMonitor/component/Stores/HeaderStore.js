/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: CommonStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/29-下午4:20
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import HeaderActions from './HeaderActions'

class HeaderStore extends Reflux.Store {
    constructor(){
        super()
        this.listenables = HeaderActions
        this.state = {
            // @Array tab目录的列表
            headerTabs: [
                {name: '鹰眼监控', pathname:'/'},
                {name: '系统管理', pathname:'/manage'},
                {name: '统计报表', pathname:'/report'}
            ],
            current_pathname:'/',
            // @Number 自动刷新clock标志deg
            autoRefreshCars_clock_point_deg: 0,
            // @Number MsgBox中显示loading的数目
            loadingNum: 0
        }
    }

    onPrintThis(){
        console.log(Reflux.GlobalState)
    }

    onChangePathname(pathname){
        this.setState({
            current_pathname: pathname
        })
    }

    // 显示Loading
    onLoadingShow(){
        this.setState({
            loadingNum: this.state.loadingNum+1
        })
    }

    // 隐藏Loading
    onLoadingHide(){
        this.setState({
            loadingNum: this.state.loadingNum-1
        })
    }
}

HeaderStore.id = 'header'

export default HeaderStore