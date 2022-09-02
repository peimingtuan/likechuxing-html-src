<template>
    <div class="fail">
      <HeaderMain/>
      <FailBox :type="fail_status" :style="fail_status==2 ?'padding-bottom:.25rem':''" />
      <ShareList v-if="fail_status!=2"/>
    </div>
</template>

<script>
  import ShareList from '../components/ShareList'
  import FailBox from '../components/FailBox'
  import HeaderMain from '../components/HeaderMain'
  import {mapState} from 'vuex'

  export default {
    name: "fail",
    components:{
      FailBox,
      ShareList,
      HeaderMain,
    },
    data(){
      return {
        fail_status:1,
      }
    },
    created() {
      this.fail_status = this.$route.query.type || 1
    }
  }
</script>

<style lang=less scoped>
  .fail{
    background: #fc241c;
    min-height: 100vh;
    .finishHead{
      height: .93rem;
      img{
        width: 100%;
      }
    }
  }
</style>