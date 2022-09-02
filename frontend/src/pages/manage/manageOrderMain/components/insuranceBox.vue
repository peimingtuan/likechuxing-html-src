<template>
    <div class="InsuranceBox">
        <div class="desc">
            有效截止日期：{{data.expire}}
        </div>

        <div class="img-con">
            <div class="title">交强险：</div>
            <div class="img" :style="{backgroundImage:'url('+data.force+')'}" @click="view(data.force)"></div>
        </div>

        <div class="img-con">
            <div class="title">商业险：</div>
            <div class="img" :style="{backgroundImage:'url('+data.trade+')'}" @click="view(data.trade)"></div>
        </div>
    </div>
</template>

<script>
  import preview from '../../../../../other_modules/previewImg'
  export default {
    name: "insuranceBox",
    props:{
      data:{
        type:Object
      }
    },
    methods:{
      view(url){
        if(url === 'https://imagestest.likechuxing.com//'  || url === 'https://images.likechuxing.com//'){
          this.$_LIKE_toast('保险单照片未上传')
        }else{
          preview({url})
        }
      }
    }

  }
</script>

<style lang=less scoped>
.InsuranceBox{
    padding: 0.2rem 0.15rem;
    .desc{
        color:#111;
    }
    .img-con{
        margin:0.1rem 0;
        .title{
            font-size: 13px;
            color:#999;
            margin:0.05rem 0;
        }
        .img{
            width: 100%;
            height: 2rem;
            background:#f9f9f9 no-repeat center;
            background-size: contain;
        }
    }
}
</style>