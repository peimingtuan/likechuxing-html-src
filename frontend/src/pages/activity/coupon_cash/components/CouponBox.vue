<template>
    <div class="CouponBox">
        <div class="name-box">
            <span class="flag">¥</span>
            <span class="money">{{Number(data.coupon_value)}}</span>            
        </div>

        <div class="detail-box">
            <div>
                <h3 class="name">{{data.name}}</h3>
                <div class="desc">
                    <p class="item" v-for="(item,index) in desc" :key="index">{{item}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "CouponBox",
    props:['data'],
    computed:{
      desc(){
        return this.data.desc.filter(item=>Boolean(item))
      }
    }
  }
</script>

<style lang=less scoped>
.CouponBox{
    background-color: #fff2d6;
    border-left:solid 3px rgba(252,36,28,0.35);
    height: 1.05rem;
    margin:0.2rem 0;
    display: flex;
    position: relative;

    .name-box{
        flex:none;
        width: 16px;
        padding: 0 0.4rem;
        text-align: center;
        border-right:dashed 2px #fff;
        display: flex;
        align-items:center;
        justify-content: center;
       
        .money{
            font-size: 40px;
            color:#FC241C;
        }
        .flag{
            font-size: 20px;
            color:#FC241C;
            padding-top: 12px;
            padding-right: 8px;
        }
    }

    .detail-box{
        width: 100%;
        text-align: center;
        display: flex;
        align-items:center;
        /* justify-content: center; */
        padding-left: 26px;

        .name{
            line-height: 1;
            font-size: 18px;
            color:#FE1A15;
            text-align: left;
            font-weight: normal;
        }

        .desc{
            text-align: left;
            max-width: 1.8rem;
            color:#9D9C9C;
            font-size: 13px;
            .item{
                padding-top: 8px;
                line-height: 1;
            }
        }
    }
}
</style>