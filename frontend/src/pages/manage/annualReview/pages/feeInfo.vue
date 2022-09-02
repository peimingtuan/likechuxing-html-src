<template>
    <div class="container">
        <div class="c-header">
            <div>费用金额：</div>
            <div class="input-wrap">
                <input type="number" v-model="fee" placeholder="请输入费用金额">
            </div>
            <div>元</div>
        </div>
        <div class="c-body">
            <div class="title">备注：</div>
            <textarea v-model="remark" placeholder="请输入备注信息，200字以内"></textarea>
        </div>
        <FooterBtn txt="提交" @press="postInfo" :active="fee"/>
    </div>
</template>
<script>
import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'

import FooterBtn from '../components/footerBtn.vue'

export default {
    name:'feeInfo',
    components:{
        FooterBtn
    },
    data(){
        return{
            id:'',
            remark:'',
            fee:'',
            radioList:[{id:1,name:'是'},{id:0,name:'否'}]
        }
    },
    watch:{
        remark(v){
            if(v.length>150){
                let str = this.remark.substr(0,150)
                this.remark = str
            }
            
        }
    },
    created(){
        this.id = this.$route.query.order_id
    },
    methods:{
        postInfo(){
            let  mobile = sessionStorage.getItem('mobile')
            let { id, remark, fee  } = this
            let _this = this;
            if(isNaN(Number(fee))){
                Toast('费用请输入数字')
                return
            }
            http.post(api('/vehicle-examine/add-fee'),{
                mobile,
                id,
                fee,
                fee_remark:remark
            }).then(res=>{
                if(res.status===0){
                    _this.$router.go(-1)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        .c-header{
            height: .54rem;
            .fd();
            .fco(.14rem,#333);
            background: #fff;
            margin-bottom: .1rem;
            padding:0 .15rem;
            .input-wrap{
                flex:1;
                input{
                    width:100%;
                    height: .4rem;
                    .fco(.14rem,#333);
                }
            }
        }
        .c-body{
            padding: .17rem .15rem;
            background:#fff;
            .title{
               .fco(.14rem,#333); 
                margin-bottom: .1rem;
            }
            textarea{
                width:100%;
                height: .88rem;
                border: 1px solid #C1C1C1;
                border-radius:2px;
                background: #F6F6F6;
                padding:.1rem;
                font-size: .12rem;
            }
        }
    }
</style>


