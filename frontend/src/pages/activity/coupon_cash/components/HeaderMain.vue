<template>
    <div class="HeaderMain">
        <div class="img"></div>
        <div class="rule" @click="rule()">活动规则</div>
        <Rules v-if="isShow" @ruleDestroy="ruleDestroy()"/>
    </div>
</template>

<script>
  import Rules from './Rules2'  
  export default {
    name: "HeaderMain",
    components:{
        Rules
    },
    data(){
        return{
            isShow:false,
        }
    },
    methods:{
        rule(){
            this.isShow = true;
        },
        ruleDestroy(){
            this.isShow = false;
        }
    }
  }
</script>

<style lang=less scoped>
.HeaderMain{

    .img{
        background: url('../images/header_img2.png') no-repeat top center;
        background-size: 100% auto;
        width: 100%;
        height: 2.66rem;
    }
    .rule{
        position: absolute;
        top: .17rem;
        right: .15rem;
        background: #FDDF4C;
        width:.67rem;
        height:.21rem;
        display: flex;
        justify-content: center;
        align-items: center; 
        border-radius:.1rem;
    }
}
</style>