<template>
  <div class='StepShow'>
    <div class="line base" :style="baseLineStyle"></div>
    <div class="line active" :style="activeLineStyle"></div>
    <ul>
      <li class="step" v-bind:class=" [ (index+1)<=stepNow?'active':'']" :style="{width:100/stepLength+'%'}"
          v-for="(item, index) in step">
        <div class="num">{{index + 1}}</div>
        <p class="desc">{{item}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'stepShow',
    props: [
      'step',
      'stepNow'
    ],
    computed: {
      stepLength: function () {
        return this.step.length
      },
      baseLineStyle: function () {
        return {
          width: (this.stepLength - 1) / this.stepLength * 100 + '%',
          left: 50 / this.stepLength + '%'
        }
      },
      activeLineStyle: function () {
        return {
          left: 50 / this.stepLength + '%',
          width: (this.stepNow - 1) / this.stepLength * 100 + '%'
        }
      }
    },
    methods: {
      preventEvent (e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    },
    created () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .StepShow {
    font-size: 13px;
    color: #DEDEDE;
    background-color: #F1F2F7;
    position: relative;
    z-index: 0;
    padding: 0.5em 0;
    .line {
      position: absolute;
      z-index: -2;
      height: 2px;
      top: 1.9em;
      &.base {
        background-color: #DEDEDE;
      }
      &.active {
        z-index: -1;
        background-color: #24BE60;
      }
    }
    li {
      display: inline-block;
    }
    .step {
      .num {
        margin: 1em auto 0;
        font-size: 12px;
        width: 1.3em;
        height: 1.3em;
        background-color: #DEDEDE;
        border-radius: 50%;
        color: #fff;
        border-left: solid 4px #F1F2F7;
        border-right: solid 4px #F1F2F7;
      }

      &.active {
        .num {
          background-color: #24BE60;
        }
        .desc {
          color: #999;
        }
      }
    }
  }
</style>
