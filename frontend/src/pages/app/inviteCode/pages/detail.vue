<template>
    <div class="detail">
        <p>
           分享给好友，TA在“个人中心” - “优惠”中输入“优惠码”进行兑换，兑换成功即可获得<span class="strong"> 3个10元 </span>红包。
        </p>
        <p>
            好友用车（有效里程大于等于5公里），您也可以获得<span class="strong"> 1张30元 </span>红包奖励。
        </p>
    </div>
</template>

<script>
  export default {
    name: "detail"
  }
</script>

<style lang=less scoped>
.detail{
    padding: 0.18rem;
    color:#333;
    p{
        margin-bottom: 0.15rem;
        padding-left: .15rem;
        &:nth-child(1){
            &::before{
                content: '1.';
                margin-left: -.15rem; 
            }
        }
        &:nth-child(2){
            &::before{
                content: '2.';
                margin-left: -.15rem; 
            }
        }
    }
    .strong{
        color:#ED3C05;
        /* margin:0 3px; */
    }
}
</style>