<!--
管理app钉钉端顶部功能tab标签
包含搜索、筛选、排序、刷新
接收一个module的props来控制四个标签的显示与顺序
module = [
    'search',
    'filter',
    'sort',
    'refresh'
]
点击后触发对应的事件，监听即可

<HeaderTab
    :module="module"
    @tabSearch="toSearch"
    @tabFilter="filterShow"
    @tabRefresh="refresh"
/>
-->

<template>
    <div class="HeaderTab">

        <div class="item" v-for="item in module" :key="item" @click="()=>popAction(item)">
            <span class="text">

                <span v-if="item === 'refresh'" class="icon refresh" :class="{refreshAnimate:refreshAnimate}"
                      @animationend="end"></span>
                <span v-else class="icon" :class="item"></span>

                {{moduleName[item]}}
            </span>
        </div>

    </div>
</template>

<script>
  import '../../polyfills'
  /*
  */

  export default {
    name: "header-tab",
    props: {
      module: {
        type: Array
      }
    },
    data () {
      return {
        moduleName: {
          search:'搜索',
          filter:'筛选',
          sort:'排序',
          refresh:'刷新'
        },
        refreshAnimate: false
      }
    },
    methods: {
      end(){
        this.refreshAnimate = false
      },
      popAction(type){
        switch(type){
          case 'search':
          this.$emit('tabSearch')
          break;
          case 'filter':
            this.$emit('tabFilter')
            break;
          case 'sort':
            this.$emit('tabSort')
            break;
          case 'refresh':
            if(!this.refreshAnimate){
              this.refreshAnimate = true
              this.$emit('tabRefresh')
              // 不支持animationend事件的机型
              setTimeout(()=>{this.refreshAnimate = false},400)
            }
        }
      }
    }
  }
</script>

<style lang=less scoped>
    .HeaderTab {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #FFFFFF;
        border-bottom: 1px solid #f6f6f6;
        border-top:1px solid #f6f6f6;
        width: 100%;
        .item {
            flex: auto;
            margin:0.08rem 0;
            height: 0.2rem;
            text-align: center;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: solid 1px #f6f6f6;
            &:nth-last-of-type(1) {
                border-right: none
            }

            .text {
                font-size: 14px;
                color:#333;
                padding-left: 0.24rem;
                position: relative;
                .icon {
                    position: absolute;
                    margin-left: -0.24rem;
                    width: 0.2rem;
                    height: 0.2rem;
                    background: no-repeat center;
                    background-size: auto 70%;
                    &.search {
                        background-image: url('../images/icon_search.png');
                    }
                    &.filter {
                        background-image: url('../images/icon_filter.png');
                    }
                    &.refresh {
                        background-image: url('../images/icon_refresh.png');
                    }
                    &.sort{
                        background-image: url('../images/icon_sort.png');
                    }
                }
            }

        }
    }

    @keyframes refresh {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(720deg);
        }
    }

    .refreshAnimate {
        animation-duration: 1000ms;
        animation-name: refresh;
        animation-fill-mode: both;
    }
</style>