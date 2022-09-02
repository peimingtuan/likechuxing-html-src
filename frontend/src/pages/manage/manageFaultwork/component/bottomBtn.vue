<template>
    <div class="bottom-btn">
        <button v-if="show">{{text}}</button>
        <button v-else class="submit-btn"  @click="submit">{{text}}</button>
    </div>
</template>
<script>
    export default{
        name: "bottomBtn",
        props:{
            show:Boolean,
            text:{
                default:'保存',
                type:String,
                required:true
            }
        },
        data ()
    {
        return {}
    }
    ,
    beforeCreate()
    {

    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {

    }
    ,
    methods: {
        submit(){
                this.$emit('clickbtn')
        }
    }
    }
</script>
<style>
    .bottom-btn{
        position: fixed;
        bottom: 0;
        left:0;
        width:3.75rem;
        padding:.12rem;
        background: #fff;
        box-shadow: 1px -2px 2px #e8e8e8;
    }
    .bottom-btn button{
        width: 3.51rem;
        line-height: .44rem;
        color:#fff;
        text-align: center;
        outline: none;
        border: none;
        border-radius: 2px;
        box-sizing: border-box;
        background: #d1d1d1;
    }

    .submit-btn{
        background:#333!important;
        border:none;
        color:#fff;
    }

</style>