<template>
    <div class="wrap">
        <div class="list">
            <div class="row">
                <div class="col-label">日期</div>
                <div class="col" v-for="(item,index) in label" :key="index">{{item}}</div>
            </div>
            <div class="row" v-for="(item,index) in list" :key="index">
                <div class="col-label">{{item.label}}</div>
                <div class="col" v-for="(i,index) in item.col" :key="index">{{i}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['list','label']
}
</script>
 <style lang="less" scoped>
    .wrap{
        .list{
            width:100%;
            background: #fff;
            font-size: 12px;
            overflow-x: auto;
            .row{
                height: 36px;
                display: flex;
                min-width: 500px;
                border-bottom: 1px solid #f6f6f6;
                .col-label{
                    width:70px;
                    height: 36px;
                    text-align: center;
                    line-height: 36px;
                    border-right: 1px solid #f6f6f6;
                }
                .col{
                    flex:1;
                    height: 36px;
                    text-align: center;
                    line-height: 36px;
                    border-right: 1px solid #f6f6f6;
                }
            }
        }
    }
</style>


