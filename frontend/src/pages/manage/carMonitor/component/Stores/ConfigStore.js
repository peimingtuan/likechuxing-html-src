/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ConfigStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/24-下午3:08
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import ConfigActions from './ConfigActions'

class ConfigStore extends Reflux.Store{
    constructor(){
        super()
        this.listenables = ConfigActions
        this.state = {
            menus:[
                {pathname: '/fence', name: '电子围栏'}
            ],
            current_pathname:'/fence'
        }
    }

    onChangeCurrentPath(path){
        this.setState({
            current_pathname: path
        })
    }
}

ConfigStore.id = 'config'

export default ConfigStore