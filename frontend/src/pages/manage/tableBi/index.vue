<template>
    <div class="page">
        <div class="header-container">
            <div class="header-wrap">
                <div class="header">
                    <router-link :to="item.link" class="item"  v-for="item in navbar" :key="item.id" >{{item.des}}</router-link>
                </div>
            </div>
        </div>
        <keep-alive>
        <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
    export default{
        name:'indexPage',
        data(){
            return {
                navbar:[
                    {
                        id:1,
                        des:"城市运营",
                        link:'/'
                    },
                    {
                        id:6,
                        des:'渠道转化漏斗',
                        link:'/channelChart'
                    },
                    {
                        id:2,
                        des:"用户漏斗",
                        link:'/userChart'
                    },
                    {
                        id:3,
                        des:"押金趋势",
                        link:'/depositChart'
                    },
                    {
                        id:4,
                        des:"总车辆和运营车辆",
                        link:'/carChart'
                    },
                    {
                        id:5,
                        des:"网点和车位数",
                        link:'/branchChart'
                    }
                ]
            }
        }
    }
</script>

<style lang="less">
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    body{
        background: #f2f2f2;
    }
    a{
        text-decoration: none;
    }
    .page{
        padding-bottom: 40px;
        padding-top: 60px;
        .header-container{
            height: 48px;
            width: 100%;
            position: fixed;
            left: 0;
            top:0;
            z-index:1006;
        }
        .header-wrap{
            height: 48px;
            overflow-x: auto;
            background: #fff;
        }
        .header{
            min-width: 650px;
            height: 48px;
            .item{
                float: left;
                height: 48px;
                text-align: center;
                padding: 0 15px;
                line-height: 48px;
                color: #5E5E5E;
                font-size: 14px;
                border-bottom:1px solid #e6e6e6;
                position: relative;
                &::after{
                    content:'';
                    position: absolute;
                    right: 0;
                    top: 12px;
                    width:1px;
                    height: 24px;
                    background:#000;
                    transform: scaleX(0.5)
                }
                &.router-link-exact-active{
                    color: #000;
                    font-size: 16px;
                    &::before{
                        content:'';
                        position: absolute;
                        left: 5%;
                        bottom:-1px;
                        width:90%;
                        height: 2px;
                        background:#000;
                        z-index: 20
                    }
                }
            }
        }
    } 
</style>