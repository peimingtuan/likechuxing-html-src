<template>
    <SlideInLeftBox class="filterRightBox"
                    needTouchmove="1"
                    title="筛选"
                    @close="close"
    >
        <div class="filterRightBoxBody">
            <div class="filter-list">
                <div class="item">
                    <div class="item-name">车辆当前已行驶总公里数</div>
                    <RadioRange
                            :value="distance_total"
                            ref="range_dis_total"
                    />
                </div>
                <div class="item">
                    <div class="item-name">距离下次保养已超公里数</div>
                    <RadioRange
                            :value="distance_pass"
                            ref="range_dis_pass"
                    />
                </div>
                <div class="item">
                    <div class="item-name">距离下次保养已超天数</div>
                    <RadioRange
                            :value="day_pass"
                            ref="range_day_pass"
                    />
                </div>
                <div class="item">
                    <div class="item-name">距离下次保养剩余天数</div>
                    <RadioRange
                            :value="day_remain"
                            ref="range_day_remain"
                    />
                </div>
                <div class="item">
                    <div class="item-name">已完成保养次数</div>
                    <FilterSingle
                            class="filterSingle"
                            :options="finish_times_options"
                            :selected="finish_times"
                            @change="id=>{this.finish_times=id}"
                    />
                </div>
                <div class="item">
                    <div class="item-name">当前车辆状态</div>
                    <FilterSingle
                            class="filterSingle"
                            :options="car_status_list"
                            :selected="car_status"
                            @change="id=>{this.car_status=id}"
                    />
                </div>
                <div class="item">
                    <div class="item-name">车型</div>
                    <div class="input-select">
                        <input class="input" v-model="model_search" placeholder="请输入车型"/>
                        <div class="clear" v-if="model_search" @click="clearSearch"></div>
                        <FilterSingle
                                class="filter-single"
                                :options="car_models_result"
                                :selected="car_model"
                                @change="id=>{this.car_model=id}"
                        />
                    </div>


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
  import RadioRange from './radioRange'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'

  export default {
    name: "filterRightBox",
    props:['preData'],
    components: {
      SlideInLeftBox,
      LikeButton,
      RadioRange,
      FilterSingle
    },
    data () {
      return {
        distance_total: '',
        distance_pass: '',
        day_pass: '',
        day_remain: '',
        // 完成保养次数
        finish_times_options: [
          {text:'全部',id:0},
          {text: '0次', id: 1},
          {text: '1次', id: 2},
          {text: '更多', id: 3}
        ],
        finish_times: 0,

        // 车状态
        car_status_list: [
          {text: '全部', id: 0},
          {text: '空闲', id: 1},
        ],
        car_status: 0,

        // 车型
        car_models: [
          {text: '2015-奇瑞', id: 1},
          {text: '2016-奇瑞', id: 2},
          {text: '2015-奥德赛', id: 3},
          {text: '2016-奥德赛', id: 4},
          {text: '2015-gl8', id: 5},
          {text: '2016-gl8', id: 6}
        ],
        car_model: 0,
        model_search: ''
      }
    },
    computed: {
      car_models_result () {
        let all = [{text: '全部', id: 0}]
        if (this.model_search === '') {
          return all.concat(this.car_models)
        } else {
          let reg = new RegExp(this.model_search, 'i')
          return all.concat(this.car_models.filter(item => reg.test(item.text)))
        }
      }
    },
    methods: {
      filterReset () {
        this.distance_total = ''
        this.distance_pass = ''
        this.day_pass = ''
        this.day_remain = ''
        this.$refs.range_dis_total.clear()
        this.$refs.range_dis_pass.clear()
        this.$refs.range_day_pass.clear()
        this.$refs.range_day_remain.clear()
        this.finish_times = 0
        this.car_status = 0
        this.car_model = 0
        this.model_search = ''
      },

      clearSearch () {
        this.model_search = ''
      },

      filterSearch () {
        let data = {
          distance_total: this.$refs.range_dis_total.getValue(),
          distance_pass: this.$refs.range_dis_pass.getValue(),
          day_pass: this.$refs.range_day_pass.getValue(),
          day_remain: this.$refs.range_day_remain.getValue()
        }

        for (let key in data) {
          if (data[key] === '_') {
            this.$_LIKE_toast('请输入区间最大最小值')
            return
          } else if (/_/.test(data[key])) {
            let values = data[key].split('_')
            let min = values[0]
            let max = values[1]
            if (min !== '' && max !== '' && Number(min) >= Number(max)) {
              this.$_LIKE_toast('最小值不能大于等于最大值')
              return
            }
          }
        }
        if (/_/.test(data.day_pass) && /_/.test(data.day_remain)) {
          this.$_LIKE_toast('已超天数跟剩余天数不能同时筛选')
          return
        }

        data.finish_times = this.finish_times
        data.car_status = this.car_status
        data.car_model = this.car_model

        this.$emit('finish',data)
        this.close()
      },
      close () {
        this.$emit('close')
      }
    },
    created(){
      myAjax.post(getOspApiUrl('/vehicle-maintain/get-car-model')).then(res=>{
        this.car_models = res.data.map(item=>{
          return {
            id:Number(item.id),
            text:item.model_string
          }
        })
      })

      if(this.preData){
        console.log(this.preData)
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
                margin:0.1rem 0
            }

            .filterSingle{
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