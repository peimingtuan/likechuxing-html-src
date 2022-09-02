<template>
    <div>
        <el-card class="box-card control">
            <div class="clearfix">
                <div class="float-right con" @click="openChange"></div>
            </div>
            <div v-if="open" class="items">
                <div class="item">
                    <span class="label">查看方式：</span>
                    <span class="inline-block">
                    <el-select v-model="method" placeholder="请选择" @change="methodChange" size="mini">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                      </el-select>
                </span>
                </div>
                <div class="item">
                    <span class="label">网点：</span>
                    <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList">
                        <el-checkbox label="0">B</el-checkbox>
                        <el-checkbox label="1">B+</el-checkbox>
                    </el-checkbox-group>
                </span>
                </div>

                <div class="item">
                    <span class="label">网点热力图：</span>
                    <span class="inline-block">
                    <el-checkbox-group class="width" v-model="hotmap_filter" @change="hotChange">
                        <el-checkbox label="0">取车计数</el-checkbox>
                        <el-checkbox label="1">还车计数</el-checkbox>
                    </el-checkbox-group>
                </span>
                </div>

                <div class="item" v-if="method===0 && active_branch">
                    <span class="label">当前网点：</span>
                    <span class="inline-block">
                    {{active_branch.name}}
                </span>
                </div>
                <div class="item" v-if="method===0">
                    <span class="label">网点作为：</span>
                    <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList2">
                        <el-checkbox label="0">取车<span
                                v-show="rentals_as_begin.length">（{{rentals_as_begin.length}}）</span></el-checkbox>
                        <el-checkbox label="1">还车<span v-show="rentals_as_end.length">（{{rentals_as_end.length}}）</span></el-checkbox>
                    </el-checkbox-group>
                </span>
                </div>

            </div>
        </el-card>

        <el-card class="box-card time-bar" v-if="method===1">
            <div class="items">
                <div class="item">
                    <span class="label">时刻：</span>
                    <span class="inline-block">
                    {{time_h}}
                </span>
                    <div>
                        <el-slider
                                v-model="timer"
                                :show-tooltip=0
                                :step=60
                                :max="86400">
                        </el-slider>
                    </div>

                </div>
            </div>
        </el-card>
    </div>

</template>

<script>
  import mapControl from '../js/mapControl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../js/getApiUrl'
  import branches from '../data/branches'
  import rental from '../data/20190103'
  import Branch from '../js/model/Branch'
  import Rental from '../js/model/Rental'

  export default {
    name: "control",
    data () {
      return {
        options: [
          {
            value: 0,
            label: '网点'
          }, {
            value: 1,
            label: '时间轴'
          },
        ],
        method: 1,
        branches: branches.map(item => new Branch(item)),
        rentals: rental.map(item => new Rental(item)),

        active_branch: null,

        filter_list: ['0', '1'],
        filter_list2: ['0', '1'],
        time: 0,
        hotmap_filter: ['0', '1'],

        hot_level:20,
        hot_animate_level:10,

        open: true
      }
    },
    computed: {
      filterList: {
        get () {
          return this.filter_list
        },
        set (val) {
          this.filter_list = val
          mapControl.drawBranches(this.branches_after_filter)
        }
      },
      filterList2: {
        get () {
          return this.filter_list2
        },
        set (val) {
          this.filter_list2 = val
          this.drawLinesInOut()
        }
      },
      timer: {
        get () {
          return this.time
        },
        set (val) {
          this.time = val
          mapControl.drawLines(this.rentals_after_filter)
          mapControl.drawHot(this.branches_count_with_rentals,this.hot_animate_level)
        }
      },
      time_h () {
        let h = Math.floor(this.time / 3600)
        if (h < 10) h = '0' + h
        let m = Math.floor(this.time % 3600 / 60)
        if (m < 10) m = '0' + m
        return h + ':' + m
      },
      branches_after_filter () {
        return this.branches.filter(branch => {
          return this.filter_list.includes(String(branch.biz_type))
        })
      },
      rentals_as_begin () {
        if (!this.active_branch) return []

        return this.rentals.filter(rental => this.active_branch.name === rental.begin_branch)
      },
      rentals_as_end () {
        if (!this.active_branch) return []

        return this.rentals.filter(rental => this.active_branch.name === rental.end_branch)
      },
      rentals_after_filter () {
        return this.rentals.filter(rental => rental.is_during(this.time))
      },

      branches_count_after_filter () {
        if(this.hotmap_filter.length === 0)return []
        let include_begin = this.hotmap_filter.includes('0')
        let include_end = this.hotmap_filter.includes('1')
        return this.branches.map(item => {
          let count = 0
          if (include_begin) count += item.count_begin
          if (include_end) count += item.count_end
          return {
            lng: item.lng,
            lat: item.lat,
            count
          }
        })
      },

      branches_count_with_rentals(){
        let include_begin = this.hotmap_filter.includes('0')
        let include_end = this.hotmap_filter.includes('1')

        let data = []
        this.rentals_after_filter.forEach(item=>{
          if(include_begin)data.push({
            lng:item.begin_branch_poi[0],
            lat:item.begin_branch_poi[1],
            count:1
          })

          if(include_end)data.push({
            lng:item.end_branch_poi[0],
            lat:item.end_branch_poi[1],
            count:1
          })
        })

        return data

      }

    },
    methods: {
      openChange () {
        this.open = !this.open
      },

      hotChange () {
        if(this.method === 0){
          mapControl.drawHot(this.branches_count_after_filter,this.hot_level)
        }else{
          mapControl.drawHot(this.branches_count_with_rentals,this.hot_animate_level)
        }

      },

      pointClick (branch) {
        if (this.method === 0) {
          this.active_branch = branch
          this.drawLinesInOut()

        }
      },

      drawLinesInOut () {
        if (this.filter_list2.includes('0')) {
          mapControl.drawLinesOut(this.rentals_as_begin)
        } else {
          mapControl.drawLinesOut([])
        }
        if (this.filter_list2.includes('1')) {
          mapControl.drawLinesIn(this.rentals_as_end)
        } else {
          mapControl.drawLinesIn([])
        }
      },

      methodChange () {
        mapControl.drawLines([])
        mapControl.drawLinesIn([])
        mapControl.drawLinesOut([])

        if(this.method===0){
          mapControl.drawHot(this.branches_count_after_filter)
        }else{
          mapControl.drawHot([])
        }
      }
    },
    created () {
      mapControl.ready(() => {
        mapControl.drawBranches(this.branches_after_filter, this.pointClick)
        mapControl.drawLines(this.rentals_after_filter)
        mapControl.drawHot(this.branches_count_with_rentals,this.hot_animate_level)

      })
    }
  }
</script>

<style lang=less>

    .control, .time-bar {
        position: absolute;
        right: 0;


        .label {
            display: inline-block;
            min-width: 4em;
        }

        .width100 {
            width: 100%;
        }

        .con {
            margin: -10px;
            width: 20px;
            height: 20px;
            background: url('../images/setting.png') no-repeat center;
            background-size: 100%;
        }

        .inline-block {
            display: inline-block;
        }

        .items {
            min-width: 300px;
        }

        .el-checkbox + .el-checkbox {
            margin-left: 15px;
        }

        .tips {
            width: 300px;
            margin: 10px 0;
            font-size: 13px;
            color: #999;
        }

        .item {
            line-height: 24px;
        }

        .switch {
            vertical-align: text-top;
            margin-top: 1px;
        }
    }

    .control {
        top: 0;
    }

    .time-bar {
        width: 700px;
        bottom: 0;

    }

</style>