<template>
    <div class="container">
        <div class="title">
            <span>截止{{time}}</span>
            <span>非粤A车辆、广佛运营网点总统计</span>
        </div>
        <div class="header-table">
            <div class="row row1">
                <div class="row-item col1">统计项目</div>
                <div class="row-item col2">限行区域内</div>
                <div class="row-item col3">限行区域外</div>
            </div>
            <div class="row">
                <div class="row-item col1">当前车辆数</div>
                <div class="row-item col2">{{info['all']['in']}}</div>
                <div class="row-item col3">{{info['all']['out']}}</div>
            </div>
            <div class="row  row-color">
                <div class="row-item col1">当前限行车辆数</div>
                <div class="row-item col2">{{info['forbid']['in']}}</div>
                <div class="row-item col3">{{info['forbid']['out']}}</div>
            </div>
            <div class="row">
                <div class="row-item col1">当前不限行车辆数</div>
                <div class="row-item col2">{{info['unforbid']['in']}}</div>
                <div class="row-item col3">{{info['unforbid']['out']}}</div>
            </div>
            <div class="row  row-color row4">
                <div class="row-item col1"><span>当前上线合作网点数/</span><span>车位总数</span></div>
                <div class="row-item col2">{{info['branch']['in'][0]}}/{{info['branch']['in'][1]}}</div>
                <div class="row-item col3">{{info['branch']['out'][0]}}/{{info['branch']['out'][1]}}</div>
            </div>
        </div>
        <div class="title">
            <span>截止{{time}}</span>
            <span>粤牌车辆明细统计</span>
        </div>
        <div class="footer-table">
            <div class="label">限行区域内</div>
            <div class="value">
                <div class="row row-color">
                    <div class="row-item col1">粤A</div>
                    <div class="row-item col2">{{info['data']['in'][0]}}</div>
                </div>
                <div class="row">
                    <div class="row-item col1">非粤A</div>
                     <div class="row-item col2">{{info['data']['in'][1]}}</div>
                </div>
                <div class="row row-color">
                    <div class="row-item col1">
                        <span>今日限行/明日限行</span>
                        <span>(非粤A)</span>
                    </div>
                     <div class="row-item col2">{{info['data']['in'][2]}}</div>
                </div>
                <div class="row">
                    <div class="row-item col1">
                        <span>今日限行/明日不限行</span>
                        <span>(非粤A)</span>
                    </div>
                    <div class="row-item col2">{{info['data']['in'][3]}}</div>
                </div>
                <div class="row row-color">
                    <div class="row-item col1">
                        <span>今日不限行/明日限行</span>
                        <span>(非粤A)</span>
                    </div>
                    <div class="row-item col2">{{info['data']['in'][4]}}</div>
                </div>
                <div class="row">
                    <div class="row-item col1">
                        <span>今日不限行/明日不限行</span>
                        <span>(非粤A)</span>
                    </div>
                    <div class="row-item col2">{{info['data']['in'][5]}}</div>
                </div>
            </div>
        </div>
        <div class="footer-table">
            <div class="label bt">限行区域外</div>
            <div class="value">
                <div class="row row-color">
                    <div class="row-item col1">粤A</div>
                     <div class="row-item col2">{{info['data']['out'][0]}}</div>
                </div>
                <div class="row">
                    <div class="row-item col1">非粤A</div>
                     <div class="row-item col2">{{info['data']['out'][1]}}</div>
                </div>
                <div class="row row-color">
                    <div class="row-item col1">
                        <span>可入限行区域(非粤A)</span>
                    </div>
                     <div class="row-item col2">{{info['data']['out'][2]}}</div>
                </div>
                <div class="row ">
                    <div class="row-item col1">
                        <span>禁入限行区域(非粤A)</span>
                    </div>
                    <div class="row-item col2">{{info['data']['out'][3]}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import tools from '../js/tools'
import http from '../js/myAjax/withAxiosV2'
import getApiUrl from '../js/getApiUrl';
export default {
    name:'k4t4Data',
    data(){
        return{
            mobile:'',
            time:tools.initDateData(),
            info:{
                "data":{
                    "in":['','','','','',''],
                    "out":['','','','']
                },
                "all":{//总车辆数
                    "in":'',
                    "out":'',
                },
                "forbid":{//限行车辆数
                    "in":'',
                    "out":'',
                },
                "unforbid":{//非限行车辆数
                    "in":'',
                    "out":'',
                },
                "branch":{
                    "in":['',''],
                    "out":['','']
                }
            }
        }
    },
    created(){
        this.mobile = sessionStorage.getItem('mobile')
    },
    mounted(){
        this.getData()
    },
    methods:{
        getData(){
            const _this = this;
            let { mobile } = this
            http.post(getApiUrl('/statistics/car-stats'),{
                mobile
            }).then(res=>{
                console.log(res)
                if(res.status==0){
                    _this.info = res.data
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .container{
        .row{
            display: flex;
            .row-item{
                height:.4rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-right: 1px solid #fff;
                font-family: PingFangSC-Light;
                font-size: .12rem;
                color: #4A4A4A;
                &:last-child{
                    border-right: none;
                }
            }
        }
        .row-color{
            .row-item{
                background: #F3F8FB
            }
        }
        .header-table{
            .row{
                .col1{
                    flex:1
                }
                .col2{
                    width: 1.07rem;
                }
                .col3{
                    width:1rem;
                }
            }
            .row1{
                background: #E9F2FA;
                .row-item{
                    font-size: .14rem;
                }
            }
            .row4{
                .row-item{
                    height: .5rem;
                }
            }
        }
        .title{
            height:.6rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-size: .14rem;
            color: #4A4A4A;
        }
        .footer-table{
            display: flex;
            .label{
                width: 1rem;
                background: #E9F2FA;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .14rem;
                color: #4A4A4A;
                border-right: 1px solid #fff;
            }
            .value{
                flex: 1;
            }
            .row{
                .col1{
                    width:1.72rem;
                }
                .col2{
                    flex: 1;
                }
            }
        }
        .bt{
            border-top: 1px solid #fff;
        }
    }
</style>

