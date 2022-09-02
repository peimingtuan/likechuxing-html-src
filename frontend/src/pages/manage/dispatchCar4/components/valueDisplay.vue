<template>
    <el-card class="valueDisplay" v-if="currentRect">
        <div v-if="currentType === 0">供需关系：<span class="value">{{currentRect.diff || 0}}辆</span></div>
        <div v-if="currentType !== 2">调度供应：<span class="value">{{currentRect.supply || 0}}辆</span></div>
        <div v-if="currentType !== 1">用车需求：<span class="value">{{currentRect.need || 0}}辆</span></div>
    </el-card>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "value-display",
    computed: {
      ...mapState(['currentRect','baseArea']),
      ...mapState('control',['currentType'])
    }
  }
</script>

<style lang=less scoped>
    .valueDisplay {
        position: absolute;
        top: 0;
        right: 0;
        margin: 20px;
        width: 160px;
        font-size: 14px;
        .value {
            float: right;
        }
    }
</style>