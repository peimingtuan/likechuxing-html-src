<template>
    <li class="GoodsBox animated fadeIn" :class="{double_block}">
        <div class="clearfix mini_box" :class="{soldOut:data.store_num < 1}" @click="toGoodsDetail">
            <div class="desc">
                <div class="hot" v-if="data.store_num>0 && is_hot"></div>
                <div class="fs16">{{name}}</div>
                <div class="cost fs14" v-if="data.id>0">{{point}}<span class="fs12"> 里程积分</span></div>
            </div>
            <div class="goods_img" :style="'background-image:url('+img+');'"></div>
        </div>
    </li>
</template>

<script>
  import {Alert, Toast, Loading,Confirm} from '../../../../../other_modules/vue-plugins/like-base/'
  require('../../../../../other_modules/css-animate/animate.less')
  require('../../../../../other_modules/css-animate/animate-btn.less')
  import appArguments from '../../../../../other_modules/app-arguments'

  export default {
    name: "goods-box",
    props:['data'],
    data(){
      return {
        name:'',
        point:0,
        img:'',
        // 显示hot标志
        is_hot:false,
        // 宽度占据两行的商品
        double_block:false
      }
    },
    methods:{
      toGoodsDetail(){
        if(this.data.id>0){
          if(this.data.store_num>0){
            window.location.href = 'goodsDetail.html?user_version='+appArguments.user_version+'&footerColor=f2f2f2&id=' + this.data.id
          }else{
            Toast('该商品已兑完，请选择其它商品')
          }
        }
      }
    },
    created(){
      this.name = this.data.cate_id === 1?this.data.name:this.data.name.substr(0,6)
      this.point = this.data.point
      this.img = this.data.store_num > 0 ? this.data.icon_image : this.data.spec_image
      this.is_hot = Boolean(this.data.is_hot)
      this.double_block = Boolean(this.data.cate_id === 1)
    }
  }
</script>

<style lang=less>
.GoodsBox{
    position: relative;
    padding-left: 0.2rem;
    height:0.86rem;
    width: 50%;
    box-sizing: border-box;
    border-top:solid 1px #f2f2f2;
    float: left;
    color:#111;
    border-right:solid 1px #f2f2f2;
    &.double_block{
        width: 100%;

        .goods_img{
            width: 1.4rem;
            height: 1.2rem;
            margin-top: -0.17rem;
        }
    }

    .mini_box{
        height: 100%;
    }

    .desc{
        line-height: 0.2rem;
        margin-top: 0.23rem;
        position: absolute;
        .cost{
            color:#999;
        }
        .hot{
            width: 0.3rem;
            height:0.17rem;
            position: absolute;
            background: url('../images/goods_hot.png') no-repeat center;
            background-size: 100%;
            right:-0.13rem;
            top:-0.17rem
        }
    }
    .goods_img{
        float: right;
        width: 0.86rem;
        margin-right: -0.05rem;
        background: no-repeat center;
        background-size: contain;
        height:100%;
        display: block;
    }
    .soldOut{
        color:#aaa;
        .cost{
            color:#aaa;
        }
    }

}

.hotGoods{
    .goods{
        width: 100%;
        .goods_img{
            width: 1.4rem;
            height: 1.2rem;
            margin-top: -0.17rem;
        }
    }
}
</style>