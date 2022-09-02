<template>
    <el-card class="box-card control">
        <div class="header">
                <span v-if="open">
                    <el-tooltip content="点击收起" placement="bottom">
                        <i class="iconfont icon-zuixiaohua" @click="()=>{this.open=false}"></i>
                    </el-tooltip>

                    <el-tooltip content="退出全屏" placement="bottom" v-if="isFull">
                        <i @click="full" class="iconfont icon-quitquanping"></i>
                    </el-tooltip>

                    <el-tooltip content="全屏" placement="bottom" v-else>
                        <i @click="full" class="iconfont icon-quanping"></i>
                    </el-tooltip>
                </span>
                <span v-else>
                    <el-tooltip content="显示工具栏" placement="bottom">
                        <i class="iconfont icon-jia" @click="()=>{this.open=true}"></i>
                    </el-tooltip>
                </span>
            </div>

        <div v-if="open" style="marginTop:10px">
            <div class="item">
                <span>城市：</span>
                <el-select v-model="city_id" placeholder="请选择" class="width" size="mini"
                           @change="cityChange">
                    <el-option
                            v-for="item in city_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="item">
                <el-button size="medium" style="width: 100%" @click="hideRect" :loading="rect_btn_disabled" v-if="rect_show">隐藏网格</el-button>
                <el-button size="medium" style="width: 100%" @click="showRect" :loading="rect_btn_disabled" v-else>显示网格</el-button>
            </div>

            <div class="item" v-if="rect_show">
                <span>网格状态：</span>
                <el-select v-model="rects_filter_type" class="width" size="mini">
                    <el-option label="全部" value="0" />
                    <el-option label="无网点" value="1" />
                    <el-option label="有网点" value="2" />
                </el-select>
            </div>

            <div class="item" v-if="branches.length > 0">
                <el-autocomplete
                        style="width:100%"
                        class="input"
                        v-model="queryString"
                        :fetch-suggestions="querySearch"
                        placeholder="搜索网点名称"
                        :trigger-on-focus="false"
                        clearable
                        @clear="searchClear"
                        size="small"
                        @select="handleSelect"
                />
            </div>

            <div class="item" v-if="branches.length > 0">
                <span>筛选：</span>
                <span class="inline-block">
                    <el-checkbox-group v-model="filterList">
                        <el-checkbox label="0">B网点</el-checkbox>
                        <el-checkbox label="1">B+网点</el-checkbox>
                    </el-checkbox-group>
                </span>
            </div>

            <div class="item" v-if="branches.length > 0">
                <el-button-group style="width:100%">
                    <el-button size="medium" style="width: 50%" @click="toCount">查看统计</el-button>
                    <el-button size="medium" style="width: 50%" @click="showDataTable">查看数据</el-button>
                </el-button-group>

                <div style="margin-top: 5px">
                    <el-button size="medium" style="width: 100%" @click="toArea">查看片区</el-button>
                </div>
            </div>
        </div>

        </el-card>
</template>

<script>
  import {mapState} from 'vuex'
  import {mapControl} from '../js/mapControl'

  export default {
    name: "control",
    data () {
      return {
        queryString: '',

        isFull: false,
        open: true,

        rect_show:true,
        rect_btn_disabled:false
      }
    },
    computed: {
      ...mapState(['city_list', 'branches']),
      city_id: {
        get () {
          return this.$store.state.city_id
        },
        set (val) {
          this.$store.commit('setCurrentBranch',null)
          this.$store.commit('setCityId', val)
        }
      },
      filterList: {
        get () {
          return this.$store.state.filterList
        },
        set (val) {
          this.$store.commit('setFilterList', val)
          mapControl.drawBranches(this.$store.getters.branches_after_filter)
        }
      },
      rects_filter_type:{
        get(){
          return String(this.$store.state.rects_filter_type)
        },
        set(val){
          this.$store.commit('setRectsFilterType', Number(val))
        }
      },
    },
    methods: {
      showDataTable(){
        this.$store.commit('setDataTableShow',true)
      },
      showRect(){
        if(this.rect_btn_disabled)return

        this.rect_btn_disabled = true
        let that = this
        setTimeout(function(){
          mapControl.showRect()
          that.rect_show = true
          that.rect_btn_disabled = false
        },500)

      },
      hideRect(){
        if(this.rect_btn_disabled)return

        this.rect_btn_disabled = true

        let that = this
        setTimeout(function(){
          mapControl.hideRect()
          that.rect_show = false
          that.rect_btn_disabled = false
        },500)

      },
      searchClear(){
        mapControl.hidePoint()
      },
      querySearch (queryString, cb) {
        let restaurants = this.branches;
        let results = queryString ? restaurants.filter(item => {
          return item.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        }) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results.map(item => {
          item.value = item.name
          return item
        }));
      },
      handleSelect (item) {
        mapControl.viewPoint(item)
        console.log(item);
      },
      toArea () {
        // 如果有显示的方格筛选，先清除
        if(this.rects_filter_type)this.$store.commit('setRectsFilterType',0)

        this.$router.push({
          path: '/area'
        })
      },
      toCount () {
        let modules = this.$store.state.checkedModules.concat()

        let index = modules.indexOf('统计')
        if (index === -1) {
          modules.push('统计')
          this.$store.commit('setCheckedModules', modules)
        }

      },
      cityChange (id) {
        // 清除选中的方格
        this.$store.commit('setRemarkRectId',0)

        let city = this.city_list.find(item => item.id === id)

        let loading = this.$loading({
          lock: true,
          text: '正在加载' + city.name + '的数据',
        });

        let that = this
        setTimeout(function () {
          that.$store.dispatch('setCity', id).then(() => {
            loading.close()
            mapControl.startRemark()
          }).catch(err => {
            loading.close()
            that.handleErr(err)
          })
        }, 100)

      },

      layerChange (layer) {
        mapControl.setLayer(layer)
      },

      handleErr (err) {
        console.log(err)
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        }
      },

      full () {
        if (this.isFull) {
          // 退出全屏
          let exitMethod = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.webkitExitFullscreen;
          if (exitMethod) {
            exitMethod.call(document);
            this.isFull = false
          }
        } else {
          // 全屏
          let el = document.documentElement;
          let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          if (typeof rfs !== "undefined" && rfs) {
            rfs.call(el);
            this.isFull = true
            this.$store.commit('setCheckedModules', [])
          }
        }
      },
    },
    created () {
      if (!this.city_id) {
        // 默认选择第一个权限城市
        this.$store.dispatch('setCity', this.city_list[0].id).then(()=>{
          mapControl.startRemark()
        })
      }else{
        mapControl.startRemark()
      }
    },
    beforeDestroy () {
      // 隐藏搜索的网点
      mapControl.hidePoint()

      // 清除变色的方格
      mapControl.clearEditArea()

      // 清除选中的方格
      this.$store.commit('setRemarkRectId',0)

      // 去除右键事件
      mapControl.endRemark()
    }
  }
</script>

<style lang=less scoped>
    @import "../css/control";

</style>