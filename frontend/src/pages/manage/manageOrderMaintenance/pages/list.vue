<template>
    <div class="List">
        <div class="nav-page">
            <div class="nav-bar">
                <div class="bar"
                     v-for="item in nav_list"
                     :key="item.id"
                     :class="{active:active_tab===item.id}"
                     @click="barClick(item.id)"
                >{{item.name}}
                </div>
            </div>

            <div class="container">
                <div class="tab" :class="{active:active_tab===1}">
                    <ListRemind/>
                </div>
                <div class="tab" :class="{active:active_tab===2}">
                    <ListOrder/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'

  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'

  import ListRemind from '../components/list-remind'
  import ListOrder from '../components/list-order'

  export default {
    name: "list",
    components: {
      ListRemind,
      ListOrder
    },
    data () {
      return {
        nav_list: [
          {id: 1, name: '保养提醒'},
          {id: 2, name: '保养工单'}
        ]
      }
    },
    computed: {
      ...mapState('list', ['active_tab'])
    },
    methods: {
      barClick (id) {
        this.$store.commit('list/setActiveTab',id)
      }
    }
  }
</script>

<style lang=less>

    .List {
        .nav-bar {
            display: flex;
            justify-content: space-around;

            .bar {
                font-size: 12px;
                line-height: 13px;
                padding: 15px 4px;
                border-bottom: solid 3px transparent;

                &.active {
                    color: #42A6EA;
                    border-color: #42A6EA;
                }
            }
        }

        .container {

            .tab {
                // 不用display:none是因为better-scroll插件在含有display:none的子项进行初始化时会使得高度计算错误
                height: 0;
                overflow: hidden;

                &.active {
                    height: auto;
                }
            }
        }
    }
</style>