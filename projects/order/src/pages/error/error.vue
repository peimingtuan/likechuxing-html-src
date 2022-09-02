<template>
  <div class="Error">
    <div>错误页</div>
    <div>{{errorType}}</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        error_type: this.$route.query.errorType || '出错了'
      }
    }
  }
</script>
