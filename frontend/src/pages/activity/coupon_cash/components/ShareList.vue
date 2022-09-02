<template>
    <div class="ShareList" v-show="this.list.length>0">
        <div class="title">
            <TextInLine text="查看车友手气" />
        </div>

        <div class="list">
            <UserBox v-for="item in list" :key="item.nickName" :data="item"/>
        </div>
    </div>
</template>

<script>
    import TextInLine from './TextInLine'
    import UserBox from './UserBox'
    import {mapState} from 'vuex'

  export default {
    name: "ShareList",
    components:{
      TextInLine,
      UserBox,
    },
    computed:{
      ...mapState(['list'])
    }
  }
</script>

<style lang=less scoped>
    .ShareList {
        background-color: #fc241c;
        padding: 0 0.13rem;
        position: relative;
        padding-bottom: .19rem;
        .title{
            padding: 0.28rem 0 .26rem;
        }

        .list{
            width: 100%;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);
        }
    }
</style>