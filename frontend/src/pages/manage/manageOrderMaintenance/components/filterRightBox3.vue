<template>
    <SlideInLeftBox class="filterRightBox"
                    title="筛选"
                    @close="close"
                    ref="slide"
    >
        <div class="filterRightBoxBody">
            <div class="filter-list">
                <div class="item">
                    <div class="item-name">工单状态</div>
                    <FilterMultiple
                            ref="filter"
                            :options="options"
                            :preselect="chosen"
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
  import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultipleV2'

  export default {
    name: "filterRightBox",
    components: {
      SlideInLeftBox,
      LikeButton,
      FilterMultiple
    },
    data () {
      return {
        options:[
          {id:1,name:'待保养'},
          {id:2,name:'保养中'},
          {id:3,name:'已完成'}
        ],
        chosen:this.$store.state.mine.filter_status
      }
    },
    methods: {
      filterReset () {
        this.chosen = [0,1,2]
      },

      filterSearch () {
        let data = {
          filter_status:this.$refs.filter.getResult()
        }

        this.$emit('search',data)
        this.$refs.slide.close()
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