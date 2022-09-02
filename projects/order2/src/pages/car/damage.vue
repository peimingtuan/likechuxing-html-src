<template>
  <div class="Damage">
    <div class="header">＊请检查车辆外观并选择车伤部位</div>
    <div class="car_container">
      <img class="img" id="bg" :src="bg"/>
      <div data-area="20" @click="()=>choose(2)" class="area"></div>
      <div data-area="21" @click="()=>choose(3)" class="area"></div>
      <div data-area="22" @click="()=>choose(8)" class="area"></div>
      <div data-area="23" @click="()=>choose(10)" class="area"></div>
      <div data-area="24" @click="()=>choose(15)" class="area"></div>
      <div data-area="25" @click="()=>choose(16)" class="area"></div>
      <img v-for="item in parts_img" class="img part" :class="{show:chosen.includes(item.id)}" :src="item.src"/>
      <div v-for="item in parts_img" :data-area="item.id" class="area" @click="()=>choose(item.id)"></div>
    </div>
    <div class="footer">
      <div class="agree_con">
        <div class="agree_icon"></div>
        <a>立刻出行验车服务条款</a>
      </div>
      <button class="btn submit" v-if="chosen.length === 0" @click="toRental">外观无伤，跳过</button>
      <button class="btn submit" v-else @click="toPhoto">外观有伤，上传照片</button>
    </div>
  </div>
</template>

<script>
  import API from '../../common/apiAddress'
  import myAjax from '../../common/myAjax'
  import {mapState} from 'vuex'

  let parts_img = []
  for (let i = 1; i < 20; i++) {
    parts_img.push({
      id: i,
      src: require('../../assets/images/damage/part' + i + '.png'),
    })
  }

  export default {
    name: "damage",
    data() {
      return {
        bg:require('../../assets/images/damage/bg.png'),
        parts_img:parts_img,
        chosen:[]
      }
    },
    computed:{
      ...mapState('rental',[
        'rental'
      ])
    },
    methods:{
      choose(id){
        let index = this.chosen.indexOf(id)
        if(index > -1){
          this.chosen.splice(index,1)
        }else{
          this.chosen.push(id)
        }
      },
      toRental(){
        let loading = this.$_LIKE_loading({title: '开门中...'})
        this.$store.dispatch('rental/openDoor').then(()=>{
          loading.close()
          this.$router.go(-1)
        }).catch(err=>{
          loading.close()
          if(err.msg && err.msg!==''){
            this.$_LIKE_toast(err.msg)
          }
        })
      },
      toPhoto(){
        myAjax.postV2(API.upload.carBeforeParts,{
          rental_id:this.rental.rental_id,
          parts:'^'+this.chosen.join('^') + '^'
        }).then(res=>{
          if(res.status === 0){
            this.$router.replace('/car/takePhoto')
          }else{
            this.$_LIKE_toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .Damage {

    .header {
      padding: 0.1rem 0.15rem;
      font-size: 0.12rem;
      color: #999
    }

    .footer {
      background-color: #fff;
      padding: 0.1rem 0.15rem;
      width: 100%;
      box-sizing: border-box;
      position: fixed;
      bottom:0;
      .btn {
        width: 100%;
        height: 0.43rem;
        border-radius: 3px;
        border: none;
        color: #fff;
        font-size: 0.15rem;
        background-color: #494b51;
        &.disabled{
          background-color: #999;
        }
      }
    }

    .agree_con {
      position: relative;
      font-size: 0.12rem;
      color: #999;
      text-align: center;
      padding: 0.16rem 0.3rem;
      .agree_icon {
        width: 2em;
        height: 2em;
        position: absolute;
        left: 50%;
        margin-left: -7.5em;
        top: 50%;
        margin-top: -1em;
        background: url('../../assets/images/damage/icon_chosen.png') no-repeat center;
        background-size: 70% auto;
        &.disable {
          background-image: url('../../assets/images/damage/icon_unchosen.png');
        }
      }
      span {
        color: #111
      }
    }

    .car_container {
      position: relative;
      .img {
        display: block;
        width: 100%;
      }
      .part {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1;
        &.show{
          display: block;
        }
      }
      .area {
        position: absolute;
        z-index: 10;
        &[data-area="1"] {
          width: 22%;
          height: 20%;
          left: 38%;
          top: 0
        }
        &[data-area="2"] {
          width: 15%;
          height: 5%;
          left: 63%;
          top: 5%
        }
        &[data-area="3"] {
          width: 18%;
          height: 5%;
          left: 77%;
          top: 16%
        }
        &[data-area="4"] {
          width: 20%;
          height: 8%;
          left: 76%;
          top: 28%
        }
        &[data-area="5"] {
          width: 25%;
          height: 10%;
          left: 70%;
          top: 39%
        }
        &[data-area="6"] {
          width: 25%;
          height: 10%;
          left: 70%;
          top: 49%
        }
        &[data-area="7"] {
          width: 20%;
          height: 8%;
          left: 76%;
          top: 59%
        }
        &[data-area="8"] {
          width: 18%;
          height: 5%;
          left: 77%;
          top: 75%
        }
        &[data-area="9"] {
          width: 22%;
          height: 20%;
          left: 38%;
          bottom:0;
        }
        &[data-area="10"] {
          width: 18%;
          height: 5%;
          left: 3%;
          top: 75%
        }
        &[data-area="11"] {
          width: 20%;
          height: 8%;
          left: 3%;
          top: 59%
        }
        &[data-area="12"] {
          width: 25%;
          height: 10%;
          left: 3%;
          top: 49%
        }
        &[data-area="13"] {
          width: 25%;
          height: 10%;
          left: 3%;
          top: 39%
        }
        &[data-area="14"] {
          width: 20%;
          height: 8%;
          left: 3%;
          top: 28%;
        }
        &[data-area="15"] {
          width: 18%;
          height: 5%;
          left: 3%;
          top: 16%
        }
        &[data-area="16"] {
          width: 15%;
          height: 5%;
          left: 20%;
          top: 5%
        }
        &[data-area="17"] {
          width: 19%;
          height: 13%;
          left: 40%;
          top: 24%
        }
        &[data-area="18"] {
          width: 14%;
          height: 17%;
          left: 42%;
          top: 45%
        }
        &[data-area="19"] {
          width: 19%;
          height: 5%;
          left: 40%;
          top: 69%
        }
        &[data-area="20"] {
          width: 5%;
          height: 5%;
          left: 58%;
          top: 40%
        }
        &[data-area="21"] {
          width: 6%;
          height: 15%;
          left: 70%;
          top: 24%
        }
        &[data-area="22"] {
          width: 6%;
          height: 15%;
          left: 70%;
          top: 60%
        }
        &[data-area="23"] {
          width: 6%;
          height: 15%;
          left: 23%;
          top: 60%
        }
        &[data-area="24"] {
          width: 6%;
          height: 15%;
          left: 23%;
          top: 24%
        }
        &[data-area="25"] {
          width: 5%;
          height: 5%;
          left: 36%;
          top: 40%
        }

      }
    }
  }
</style>
