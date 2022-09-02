/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: iframe
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/19-下午12:22
 Description:
 Param:
 Return:
 *************************************************/
require('./iframe.less')
import $ from 'jquery'
import React from 'react'
import parseUrl from '../../../../../js/parseURL'
import loading from '../../component/loading'
import {appMutual} from '../../../../../../other_modules/app-mutual'

export default class iframe extends React.Component {
    constructor() {
        super()
        loading.show()
    }

    componentDidMount() {
        appMutual.send.updateTitle('2019春节长租')
        let url = decodeURIComponent(parseUrl(this.props.location.search).query.url)
        $('.iframe').height(window.innerHeight).on('load', function(){
            loading.hide()
        }).attr('src', url)
    }

    render() {
        return <div className="Iframe">
            <iframe className="iframe" src='' />
        </div>
    }
}


 