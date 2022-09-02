<template>
    <el-card class="box-card control" :body-style="style">
        <div class="clearfix">
            <div class="float-right con" @click="openChange"></div>
        </div>
        <div v-if="open">
            <div class="item">
                <span>城市：</span>
                <el-select v-model="city_id" placeholder="请选择" class="width" size="small" @change="cityChange">
                    <el-option
                            v-for="item in city_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item">
                <span>图层：</span>
                <el-radio-group v-model="layer" size="small" @change="layerChange">
                    <el-radio-button label="1">标准</el-radio-button>
                    <el-radio-button label="2">卫星</el-radio-button>
                </el-radio-group>
            </div>
            <div class="item">
                <span>日期：</span>
                <el-date-picker
                        v-model="date"
                        type="date"
                        placeholder="选择日期"
                        value-format="timestamp"
                        size="small"
                        :picker-options="pickerOptions"
                        @change="dateChange"
                        class="width"
                >
                </el-date-picker>
            </div>
            <div class="item">
                <span>速度：</span>
                <el-radio-group v-model="speed" size="small">
                    <el-radio-button label="500">2小时/秒</el-radio-button>
                    <el-radio-button label="1000">1小时/秒</el-radio-button>
                </el-radio-group>
            </div>
            <div class="item clearfix">
                <span>时间轴：</span>
                <el-switch
                        class="switch"
                        v-model="show_slider">
                </el-switch>

                <el-button size="small" class="float-right" @click="animateChange">{{animating ? '暂停' : '播放'}}</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
  import {mapState} from 'vuex'
  import mapControl from '../js/mapControl'
  import appArguments from '../../../../../other_modules/app-arguments'
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "control",
    data () {
      return {
        style:{
          padding:'20px'
        },
        layer: '1',
        date: '',
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > (Date.now() - 3600 * 1000 * 24);
          },
          shortcuts: [{
            text: '昨天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '前天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
        },
        speed:500,
        animating:false,

        open:true
      }
    },
    computed: {
      ...mapState(['city_list','current_time']),
      city_id: {
        get () {
          return this.$store.state.city_id
        },
        set (val) {
          this.$store.commit('setCityId', val)
        }
      },
      show_slider: {
        get () {
          return this.$store.state.show_slider
        },
        set (val) {
          this.$store.commit('setShowSlider', val)
        }
      },
    },
    methods: {
      openChange(){
        if(this.open){
          this.style = {padding:'5px'}
        }else{
          this.style = {padding:'20px'}
        }
        this.open = !this.open
      },
      animateChange(){
        this.animating = !this.animating
        if(this.current_time === 23)this.$store.commit('setCurrentTime',0)
        if(this.animating){
          this.play()
        }
      },
      dateChange (date) {
        this.$store.commit('setCurrentTime',0)
        this.animating = false

        let city = this.city_list.find(item => item.id === this.city_id)
        let loading = this.$loading({
          lock: true,
          text: '正在加载' + city.name + format.time(this.date/1000,7)+'的数据',
        });
        this.$store.dispatch('getHotData', date / 1000).then(res => {
          loading.close()
          if (res.length === 0) {
            this.$message.error('未找到当日数据，请更换日期重试');
          } else if (res.length < 24) {
            this.$message({
              type: 'warn',
              message: '当日数据不完整，请检查数据接口：https://admin.likechuxing.com/tbox/branch-free-car',
              duration: 0,
              showClose: true
            });
          }else{
            this.animating = true
            this.play()
          }
        })
      },
      layerChange (layer) {
        mapControl.setLayer(layer)
      },
      cityChange (id) {

        let city = this.city_list.find(item => item.id === id)

        let loading = this.$loading({
          lock: true,
          text: '正在加载' + city.name + '的网点',
        });
        mapControl.setCity(city.name)

        this.$store.dispatch('getBranches', id).then(() => {
          loading.close()
          mapControl.drawBranches(this.$store.state.branches)
        }).then(() => {
          if (this.date) {
            this.$store.commit('setHotData', [])
            this.dateChange(this.date)
          }
        }).catch(err => {
          loading.close()
          this.handleErr(err)
        })
      },
      handleErr (err) {
        console.log(err)
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        }
      },

      play(){
        if(this.animating){
          mapControl.drawHot(this.$store.state.hotData[this.current_time])
          this.$store.commit('setCurrentTime',this.current_time+1)

          if(this.current_time === 23){
            this.animating = false
          }else{
            let that = this

            setTimeout(function(){
              that.play()
            },this.speed)
          }
        }
      }
    },
    created () {
      if (!appArguments.uuid) {
        this.$_LIKE_alert('未检测到登录信息，请联系开发人员')
        return
      }

      this.$store.commit('setUuid', appArguments)
      this.$store.dispatch('getCityList').then(() => {
        this.$store.commit('setCityId', this.city_list[0].id)
        mapControl.setCity(this.city_list[0].name)
        return this.$store.dispatch('getBranches', this.city_list[0].id)
      }).then(() => {
        mapControl.drawBranches(this.$store.state.branches)
      })
    }
  }
</script>

<style lang=less scoped>
    .control {
        position: absolute;
        top: 10px;
        right: 10px;
        .con{
            width: 32px;
            height: 32px;
            background: url('../images/设置.png') no-repeat center;
            background-size: 90%;
        }
        .width {
            width: 200px;
        }
        .item {
            margin-top: 10px;
            line-height: 32px;
        }
        .switch {
            vertical-align: text-top;
            margin-top: 1px;
        }
    }
</style>