<template>
    <div class="container">
        <div class="header">
            <div class="desc">*点击可预览照片</div>
            <!-- <div class="time">2018-09-20 10:23:34</div> -->
        </div>
        <div class="list">
            <div class="item" v-for="(item,index) in info.photo" :key="index">
                <img 
                    :src="item"
                    preview="1"
                >
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'imagePreview',
    computed:{
        ...mapState('workDetail',[
            'info'
        ])
    },
    created(){
        DDBase.setWebTitle('事故照片')
    },
    beforeRouteLeave(to, from , next){
        if(this.$preview.self){
            this.$preview.self.close()
        }
        next()
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        .header{
            height: .47rem;
            padding: .15rem;
            .fb();
            .desc{
                .fco(.12rem,#c4c4c4)
            }
            .time{
                .fco(.14rem,#333)
            }
        }
        .list{
            padding: 0 .15rem;
            .fb();
            flex-wrap: wrap;
            .item{
                width: 1.65rem;
                height: 1.5rem;
                background: #fff;
                margin-bottom: .15rem;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>

