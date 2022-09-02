<template>
  <div class="TakePhoto">
    <p class="title">*请拍摄有伤部位 ( {{list.length}}/10 ) </p>
    <ul class="list clearfix">
      <li class="item camera" v-if="list.length === 0" @click="photo">
        <img :src="require('../../assets/images/license_camera.png')" class="img"/>
        <div class="desc">拍摄/上传照片</div>
      </li>
      <li class="item" v-for="(item,index) in list" :style="{backgroundImage:'url('+item.src+')'}">
        <div class="close" @click="e=>clearItem(e,index)"></div>
      </li>
      <li class="item border" @click="photo" v-if="list.length>0 && list.length<10"><p class="plus">+</p></li>
    </ul>
    <div class="btn_con">
      <button class="btn btn-primary btn-block" :class="{disabled:list.length===0}" @click="openDoor">提交并开车门</button>
    </div>
  </div>
</template>

<script>
  import API from '../../common/apiAddress'
  import myAjax from '../../common/myAjax'
  import {mapState} from 'vuex'

  export default {
    name: "take-photo",
    data(){
      return {
        list:[]
      }
    },
    computed:{
      ...mapState('user',[
        'city_id'
      ]),
      ...mapState('rental',[
        'rental'
      ])
    },
    methods:{
      photo(){
        let that = this
        SDK.chooseImage().then(src=>{
          that.list.push({
            src:src
          })
        }).catch(err=>{})
      },
      clearItem(e,index){
        e.stopPropagation()
        e.preventDefault()
        this.list.splice(index,1)
      },
      openDoor(){
        if(this.list.length===0){
          return
        }

        Promise.all(this.list.map((item,index)=>{
          return myAjax.postV2(API.upload.carBeforePhoto,{
            city_id:this.city_id,
            rental_id:this.rental.rental_id,
            behavior:'pre',
            key:index,
            from:2,
            base64_string:item.src
          }).then(res=>{
            if(res.status !== 0){
              throw res
            }
          })
        })).then(()=>{
          let loading = this.$_LIKE_loading({title: '开门中...'})
          this.$store.dispatch('rental/openDoor').then(()=>{
            loading.close()
            this.$router.replace('/rental')
          }).catch(err=>{
            loading.close()
            if(err.msg && err.msg!==''){
              this.$_LIKE_toast(err.msg)
            }
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .TakePhoto{
    .title{
      padding: 0.1rem 0.2rem;
      text-align: left;
      font-size: 0.12rem;
      color:#999;
    }
    .list{
      padding: 0 0.1rem;
      .item{
        width: 1rem;
        height: 1rem;
        float: left;
        margin:0.08rem;
        background: no-repeat center;
        background-size: cover;
        position: relative;
        &.camera{
          background-color:#f7f7f7;
        }
        .close{
          position: absolute;
          right:-0.1rem;
          top:-0.1rem;
          width: 0.2rem;
          height: 0.2rem;
          background:url('../../assets/images/close.png') no-repeat center;
          background-size: 100%;
        }
        .img{
          width: 0.4rem;
          height: 0.4rem;
          margin-top: 0.25rem;
        }
        .desc{
          color:#999;
          font-size: 0.12rem;
        }
        .plus{
          color:#999;
          font-size: 0.6rem;
          font-weight: 200;
        }
        &.border{
          box-sizing: border-box;
          border:dashed 1px #dfdfdf;
        }
      }
    }
    .btn_con{
      position: absolute;
      left:0.1rem;
      right:0.1rem;
      bottom:0.1rem;
      .btn{
        height: 0.46rem;
        font-size: 0.16rem;
      }
    }
  }
</style>
