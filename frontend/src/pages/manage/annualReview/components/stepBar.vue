<template>
    <div class="wrap">
        <div class="item" v-for="(item,index) in list" :key="index">
            <div class="item-h">
                <div class="line"></div>
                <div class="cir" :class="{'on':item.num==status && current_status>0}">{{item.num==status && current_status>0?'':item.num}}</div>
            </div>
            <div class="item-f">
                {{item.des}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'stepBar',
    props:['list','status','current_status']
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .wrap{
        .fd();
        .item{
            position: relative;
            flex:1;
            .item-h{
                position: relative;
                .line{
                    position: absolute;
                    width: 70%;
                    height: 1px;
                    background:#E5E5E5;
                    top: 50%;
                    right: -35%;
                }
                .cir{
                    margin:0 auto .08rem;
                    .wh(.25rem,.25rem);
                    .br(100%);
                    background: #EDEDED;
                    .f12();
                    color: #666;
                    line-height: .25rem;
                    text-align: center;
                    z-index: 1;
                    position: relative;
                    &.on{
                        background:url('../images/icon_success.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
            &:last-child{
                .line{
                    display: none;
                }
            }
            .item-f{
                .f12();
                .c3();
                text-align: center;
            }
            .desing{
                width:100%;
                position: absolute;
                left:-25%;
                top:-.1rem;
            }
        }
    }
</style>

