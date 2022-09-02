<template>
    <div class="Photos-tab">
        <div class="tab-con">
            <div
                    v-for="item in tab_list"
                    :key="item.id"
                    class="tab-box"
                    :class="{active:item.id===tab_id}"
                    @click="onClick(item.id)"
            >{{item.name}}
            </div>
        </div>
        <div class="active-bar" :class="{right:tab_id===tab_list[1].id}"></div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "Photos-tab",
    data () {
      return {
        tab_list: [
          {id: 1, name: '用车前'},
          {id: 2, name: '用车后'}
        ]
      }
    },
    computed: {
      ...mapState('photos', ['tab_id'])
    },
    methods: {
      onClick (id) {
        this.$store.commit('photos/setTabId', id)
      }
    }

  }
</script>

<style lang=less scoped>
    .Photos-tab {
        background-color: #fff;
        border-bottom: solid 1px #dfdfdf;
        font-size: 15px;
        position: relative;

        .tab-con {
            display: flex;
            padding: 0.15rem 0;


            .tab-box {
                width: 50%;
                text-align: center;
                box-sizing: border-box;
                color: #999;
                line-height: 1;

                &.active {
                    color: #555;
                }

                &:nth-of-type(1) {
                    border-right: solid 1px #dfdfdf;
                }
            }
        }

        .active-bar {
            width: 50%;
            position: absolute;
            bottom: 0;
            margin-left: 0;
            transition: margin-left 300ms ease-in-out;
            &::before{
                content: '';
                display: block;
                margin:0 auto;
                width: 3.6em;
                height: 1px;
                background: #494B51;
            }
            &.right{
                margin-left: 50%;
            }
        }


    }
</style>