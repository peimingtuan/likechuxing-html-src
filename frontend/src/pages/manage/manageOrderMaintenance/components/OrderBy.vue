<template>
    <SlideUpBox title="排序" class="OrderBy" ref="slideUpBox" @close="close">
        <div class="list">
            <div class="item"
                 v-for="item in list"
                 :key="item.text"
                 @click="select(item)"
                 :class="item.id===current?'selected':''"
            >{{item.text}}
            </div>
        </div>
    </SlideUpBox>
</template>

<script>
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'

  export default {
    name: "OrderBy",
    props: ['list', 'current'],
    components: {
      SlideUpBox
    },
    methods: {
      select (item) {
        this.$emit('select', item.id)
        // 延时时间能够显示这次的选择结果，符合使用者的心理预期。
        setTimeout(this.$refs.slideUpBox.close,160)
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang=less>
    .OrderBy {
        .box-body{
            padding: 0 !important;
        }
        .list {
            padding: 0 0.1rem;
            border-top:solid 1px #dfdfdf;
            .item {
                padding: 0.12rem 0;
                border-top:solid 1px #dfdfdf;

                &:nth-of-type(1){
                    border-top:none
                }
                transition: color 100ms;
                &.selected{
                    color:#46a8ec;
                    background: url('../images/selected.png') no-repeat right;
                    background-size: auto 30%;
                }
            }
        }
    }
</style>