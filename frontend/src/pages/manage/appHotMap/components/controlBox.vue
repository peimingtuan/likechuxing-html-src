<template>
    <el-card class="box-card control">
        <div class="clearfix">
            <div class="float-right con" @click="openChange"></div>
        </div>
        <div v-if="open" class="items">
            <div class="item">
                <span>城市：</span>
                <el-select v-model="city_id" placeholder="请选择" class="width" size="mini" @change="cityChange">
                    <el-option
                            v-for="item in city_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item">
                <span>筛选：</span>
                <span class="inline-block">
                    <el-checkbox-group class="width" v-model="filterList">
                        <el-checkbox label="0">B</el-checkbox>
                        <el-checkbox label="1">B+</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>

            <div class="item">
                <span>开始：</span>
                <el-date-picker
                        v-model="date_begin"
                        type="date"
                        placeholder="选择开始日期"
                        value-format="timestamp"
                        size="mini"
                        :picker-options="pickerBeginOptions"
                        @change="dateBeginChange"
                        class="width"
                >
                </el-date-picker>
            </div>
            <div class="item">
                <span>结束：</span>
                <el-date-picker
                        v-model="date_end"
                        type="date"
                        placeholder="选择结束日期"
                        value-format="timestamp"
                        size="mini"
                        :picker-options="pickerEndOptions"
                        @change="dateEndChange"
                        class="width"
                >
                </el-date-picker>
            </div>
            <div class="item">
                <span>类别：</span>
                <el-select v-model="hot_type" placeholder="请选择" class="width" size="mini" @change="hotTypeChange">
                    <el-option
                            v-for="item in hot_type_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item">
                <span>等级：</span>
                <span class="inline-block">
                    <el-input
                            class="width"
                            v-model="hot_level"
                            size="mini"
                            @change="hotLevelChange"
                    >
                    </el-input>
                </span>
            </div>
            <div class="item">
                <el-button size="small" type="primary" style="width: 100%" @click="getData" :loading="gettingData">查询数据</el-button>
            </div>


        </div>
    </el-card>
</template>

<script>
  import mapControl from '../js/mapControl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../js/getApiUrl'

  export default {
    name: "control",
    data () {
      return {
        city_id: 197,
        city_list: [
          {
            "id": 183,
            "lat": 28.200548,
            "lng": 113.023789,
            "name": "长沙市"
          },
          {
            "id": 235,
            "lat": 30.650909,
            "lng": 104.07074,
            "name": "成都市"
          }, {
            "id": 214,
            "lat": 22.51595,
            "lng": 113.3926,
            "name": "中山市"
          }, {
            "id": 213,
            "lat": 23.02067,
            "lng": 113.75179,
            "name": "东莞市"
          }, {
            "id": 202,
            "lat": 23.002012,
            "lng": 113.135147,
            "name": "佛山市"
          }, {
            "id": 197,
            "lat": 23.12908,
            "lng": 113.26436,
            "name": "广州市"
          }, {
            "id": 169,
            "lat": 30.59276,
            "lng": 114.30525,
            "name": "武汉市"
          }, {
            "id": 74,
            "lat": 32.05838,
            "lng": 118.79647,
            "name": "南京市"
          }
        ],

        date_begin: new Date(new Date().toLocaleDateString()).getTime() - 86400 * 1000,
        date_end: new Date(new Date().toLocaleDateString()).getTime() - 86400 * 1000,
        pickerBeginOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        },
        pickerEndOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        },

        hot_type: 1,
        hot_type_list: [
          {id: 1, name: 'PV'},
          {id: 2, name: 'UV'},
        ],

        branches: [],
        filter_list: ['0', '1'],

        gettingData: false,
        pv: [],
        uv: [],
        hot_level: 10,

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
      branches_after_filter () {
        if (this.filter_list.length > 1) return this.branches

        let show_type = this.filter_list[0]
        return this.branches.filter(branch => branch.biz_type === show_type)
      },
      date_range () {
        return {
          begin_time: this.date_begin / 1000,
          end_time: this.date_end / 1000 + 86399
        }
      }

    },
    methods: {
      openChange () {
        this.open = !this.open
      },

      getReturnBranches () {
        myAjax.post(getApiUrl('/chart/return-car-history'), this.date_range).then(res => {
          if (res.status === 0) {
            this.branches = res.data
            mapControl.drawBranches(this.branches_after_filter)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err=>{
          this.$message.error('查询网点出错')
          console.log(err)
        })
      },

      dateBeginChange (date) {
        this.date_begin = date
        //if(this.date_begin && this.date_end)this.getData()
      },
      dateEndChange (date) {
        this.date_end = date
        //if(this.date_begin && this.date_end)this.getData()
      },
      hotTypeChange (type) {
        this.hot_type = type
      },
      cityChange (id) {

        let city = this.city_list.find(item => item.id === id)

        mapControl.setCity(city.name)
      },

      hotLevelChange () {
        let points = this.hot_type === 1 ? this.pv : this.uv
        mapControl.drawHot(points, this.hot_level)
      },

      getData () {
        if (!this.date_begin || !this.date_end) {
          this.$message('请输入起止时间');
          return
        }

        if (this.date_begin > this.date_end) {
          this.$message.error('错误：起始时间大于结束时间');
          return
        }

        this.gettingData = true

        let url = this.hot_type === 1 ? '/open-app/pv' : '/open-app/uv'
        myAjax.post(getApiUrl(url), this.date_range).then(res => {
          this.gettingData = false
          if (res.status === 0) {
            let points = res.data.map(item => {
              return {
                lng: item.user_lng,
                lat: item.user_lat,
                count: 1
              }
            })
            if (this.hot_type === 1) {
              this.pv = points
            } else {
              this.uv = points
            }
            mapControl.drawHot(points, this.hot_level)
          } else {
            this.$message.error('出错了：'+res.msg);
          }
        }).catch(err => {
          this.gettingData = false
          if (err.response.status === 500) {
            this.$message.error('出错了，服务器返回内部错误，可以缩短查询时段重试，如果多次出现此问题请联系开发');
          } else {
            this.$message.error('出错了，' + err.response.data.msg);
          }
        })
      }
    },
    created () {
      this.getReturnBranches()
    }
  }
</script>

<style lang=less scoped>
    .control {
        position: absolute;
        top: 0;
        right: 0;

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
            padding-top: 10px;
        }

        .width {
            width: 160px;
        }

        .item {
            margin-top: 5px;
            line-height: 32px;
        }

        .switch {
            vertical-align: text-top;
            margin-top: 1px;
        }
    }
</style>