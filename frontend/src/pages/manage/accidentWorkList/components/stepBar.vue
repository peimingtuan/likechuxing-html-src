<template>
    <div class="wrap">
        <div class="item" v-for="(item,index) in list" :key="index">
            <div class="item-h">
                <div class="line"></div>
                <div class="cir" :class="{'on':item.num<status||item.num==status,'un':item.num==1 && status==1 && !isUpdate}">{{item.num>status ? index+1 :''}}</div>
            </div>
            <div class="item-f">
                {{item.des}}
            </div>
            <div class="desing" v-show="item.num==statusIndex" >{{filterDesing(item.des)}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'stepBar',
    props:['list','status','isUpdate'],
    computed:{
        statusIndex(){
            let arr = this.list.slice()
            let v = this.status
            return this.findNextIndex(arr,v)
        }
    },
    methods:{
        findNextIndex(arr,v){
            let keyArray = []
            arr.map(item=>{
                keyArray.push(item.num)
            })
            if(keyArray.indexOf(parseInt(v))==-1){
                keyArray.push(parseInt(v))
            }
            keyArray.sort();
            return keyArray[keyArray.indexOf(parseInt(v))+1]
        },
        filterDesing(v){
            if(this.status==1 && !this.isUpdate){
                return ''
            }
            if(this.statusIndex==6){
                return '待' + v
            }else{
                return '待' + v.substr(1)
            }
            
        }
    },
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
                    width: 100%;
                    height: 1px;
                    background:#E5E5E5;
                    left: 50%;
                    top: 50%;
                    right: -50%;
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
                    &.un{
                        background:url('../images/icon_default.png') no-repeat;
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

