<template>
    <SlideInLeftBox class="filterRightBox"
                    title="筛选"
                    @close="close"
    >
        <div class="filterRightBoxBody">
            <div class="filter-list">
                <div class="item">
                    <div class="item-name">工单类型</div>
                    <FilterSingle
                            class="filter-single"
                            :options="order_type_options"
                            :selected="order_type"
                            @change="id=>{this.order_type=id}"
                    />
                </div>
                <div class="item">
                    <div class="item-name">保养次数</div>
                    <FilterSingleWithInput
                            ref="historyTimes"
                            :options="history_times_list"
                            :selected="history_times"
                            @change="times=>{this.history_times=times}"
                    />
                </div>

            </div>
            <div class="btn-con">
                <LikeButton
                        text="重置"
                        type="default2"
                        @click="filterReset"
                        class="btn"
                />
                <LikeButton
                        text="确定"
                        type="primary2"
                        @click="filterSearch"
                        class="btn float-right"
                />
            </div>
        </div>
    </SlideInLeftBox>
</template>

<script>
  import SlideInLeftBox from '../../../../../other_modules/like-manageOrder/component/SlideInLeftBox'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import FilterSingle from '../../../../../other_modules/like-manageOrder/component/FilterSingleV2'
  import FilterSingleWithInput from './filterSingleWithInput'
  import RadioRange from './radioRange'

  export default {
    name: "filterRightBox",
    components: {
      SlideInLeftBox,
      LikeButton,
      RadioRange,
      FilterSingle,
      FilterSingleWithInput
    },
    props:['preData'],
    data () {
      return {
        // 工单类型
        order_type_options: [
          {text: '全部', id: 0},
          {text: '待保养', id: 1},
          {text: '保养中', id: 2},
          {text: '已完成', id: 3}
        ],
        order_type: 0,

        // 保养次数
        history_times_list: [
          {text: '全部', id: 0},
          {text: '1次', id: 1}
        ],
        history_times: 0
      }
    },
    computed: {

    },
    methods: {
      filterReset () {
        this.order_type = 0
        this.history_times = 0

        this.$refs.historyTimes.reset()
      },

      filterSearch () {
        let data = {
          order_type:this.order_type,
          history_times:this.history_times
        }

        this.$emit('finish',data)
        this.close()
      },
      close () {
        this.$emit('close')
      }
    },
    created(){
      if(this.preData){
        for(let k in this.preData){
          this[k]=this.preData[k]
        }
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';

    .filterRightBoxBody {
        height: 100%;
        overflow: scroll;

        .filter-list {
            min-height: 100%;
            padding: 0 0.15rem 0.4rem;
            box-sizing: border-box;

            .filter-single{
                margin:0.1rem 0;
            }

            .item {
                .item-name {
                    line-height: 1;
                    font-size: 12px;
                    color: #999;
                    padding-left: 0.06rem;
                    border-left: solid 3px @major;
                }

                .input-select {
                    position: relative;

                    .clear {
                        width: 0.2rem;
                        height: 0.2rem;
                        border-radius: 0.1rem;
                        background: url('../images/clear.png') no-repeat center;
                        background-size: 80%;
                        position: absolute;
                        top: 0.2rem;
                        right: 0.05rem;
                    }
                }

                .input {
                    height: 0.3rem;
                    border: solid 1px #dbdbdb;
                    border-radius: 0.15rem;
                    padding: 0 0.15rem;
                    width: 100%;
                    box-sizing: border-box;
                    margin: 0.15rem 0 0;
                }
            }
        }

        .btn-con {
            border-top: solid 1px #dbdbdb;
            position: absolute;
            width: 100%;
            bottom: 0;

            .btn {
                margin: 0;
                width: 50%;
                border-radius: 0;
            }
        }
    }
</style>