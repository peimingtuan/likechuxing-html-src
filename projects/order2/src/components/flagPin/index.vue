<template>
  <div class="FlagPin"  v-if="show" >
    <div class="pin animated" :class="{jump:isJump}" @animationend="end"></div>
    <div class="point"></div>
  </div>
</template>

<script>
  export default {
    name: "flag-pin",
    props:[
      'show'
    ],
    data(){
      return {
        isJump:false
      }
    },
    methods:{
      jump(){
        if(!this.isJump){
          this.isJump = true
        }
      },
      end(){
        this.isJump = false
      }
    },

  }
</script>

<style lang=less>
  .FlagPin {
    .pin{
      position: absolute;
      bottom: 60%;
      left: 50%;
      margin-left: -0.16rem;
      width: 0.32rem;
      height: 0.32rem;
      z-index: 2;
      pointer-events: none;
      background: url('../../assets/images/datouzhen.png') no-repeat center;
      background-size: auto 100%;
      &.jump{
        animation-name: animate_jump;
        animation-duration: 0.3s;
      }
    }

    .point{
      display: none;
      position: absolute;
      bottom:60%;
      left:50%;
      width: 1px;
      height: 1px;
      background-color: #333;
      z-index: 2;
    }


  }

  @keyframes animate_jump {
    0% {
      transform: translate3d(0, 0, 0);
    }

    85% {
      transform: translate3d(0, -16px, 0);
    }

    94%{
      transform: translate3d(0, 2px, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }
</style>
