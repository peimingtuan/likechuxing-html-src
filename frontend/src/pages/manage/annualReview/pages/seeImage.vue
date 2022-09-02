<template>
    <div class="container">
        <div class="header">
            <div class="desc">*点击可预览照片</div>
        </div>
        <div class="list">
            <div class="item" v-for="(item,index) in info" :key="index">
                <img 
                    :src="item"
                    preview="2"
                >
            </div>
        </div>
    </div>
</template>
<script>
import api from '../js/api'
import http from '../js/http'
import { Toast } from 'mint-ui'
export default {
    name:'imagePreview',
    data(){
        return{
            order_id:'',
            info:[]
        }
    },
    created(){
        this.order_id = this.$route.query.order_id
        this.getInfo();
    },
    methods:{
        getInfo(){
            let mobile = sessionStorage.getItem('mobile')
            let { order_id } = this;
            let _this = this;
            http.post(api('/vehicle-examine/pictures'), {
                mobile,
                id:order_id	
            }).then(res=>{
                if(res.status == 0){
                    _this.info = res.data
                    _this.$previewRefresh()
                }else{
                Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
            
        },
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

