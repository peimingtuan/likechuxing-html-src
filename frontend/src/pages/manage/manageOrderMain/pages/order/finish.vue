<template>
    <div class="FinishOrder">
        <!--网点名称-->
        <section>
            <div class="item flex">
                <div class="label">网点名称：</div>
                <LikeInput
                        class="flex-1"
                        type="text"
                        placeholder="请输入网点或地图选择"
                        v-model="branch_name"
                        :options="branch_list_by_kw"
                        @input="kwChange"
                        @pick="chooseBranch"
                        @clear="clearBranch"
                />
                <div class="choose-map" @click='toMap'>地图选择</div>
            </div>
        </section>

        <!--楼层、车位-->
        <section>
            <div class="item flex" @click="()=>this.select_floor_show=true">
                <div class="label">楼层：</div>

                <div class="result flex-1" v-if="floor_id">{{floor_name}}</div>
                <div class="placeholder flex-1" v-else>请选择楼层</div>

                <div class="icon-right"></div>
            </div>
            <div class="item flex">
                <div class="label">车位号：</div>
                <LikeInput
                        class="flex-1"
                        type="text"
                        placeholder="请输入车位号"
                        v-model="place_no"
                />
            </div>
        </section>

        <!--车辆状态-->
        <section>
            <div class="item flex" @click="()=>this.select_car_status_show=true">
                <div class="label">更改车辆状态：</div>

                <div class="result flex-1" v-if="car_status_id">{{car_status_name}}</div>
                <div class="placeholder flex-1" v-else>请选择状态</div>

                <div class="icon-right"></div>
            </div>
            <div class="item">
                <div class="label">备注：</div>
                <div class="textarea-con">
                    <LikeTextarea v-model="desc"/>
                </div>
            </div>
        </section>

        <div class="btn-con">
            <LikeButton
                    text="提交"
                    type="primary2"
                    :disabled="!desc"
                    @click="onSubmit"
                    class="btn"
            />
        </div>

        <LikeSelect
                v-if="select_floor_show"
                @close="()=>this.select_floor_show=false"
                title="楼层"
                :options="floor_options"
                :defaultOptionIndex="floor_options_index"
                @change="chooseFloor"
        />

        <LikeSelect
                v-if="select_car_status_show"
                @close="()=>this.select_car_status_show=false"
                title="更改车辆状态"
                :options="car_status_options"
                :defaultOptionIndex="car_status_options_index"
                @change="chooseCarStatus"
        />

    </div>
</template>

<script>
  import finishData from '../../js/finishData'
  import userData from '../../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../../js/getApiUrl'
  import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'
  import LikeTextarea from '../../../../../../other_modules/like-manageOrder/component/Textarea'
  import LikeButton from '../../../../../../other_modules/like-manageOrder/component/Button'
  import LikeInput from '../../../../../../other_modules/like-manageOrder/component/Input'
  import LikeSelect from '../../../../../../other_modules/like-manageOrder/component/Select'

  const carStatus = require('../../../../../js/database/carStatus.json')

  const config = {
    1: {
      car_status: [1, 37, 3, 20, 23].map(status => carStatus.find(item => item.status === status)),
      api_url: '/vehicle-maintain/operate'
    }
  }

  export default {
    name: "finish",
    components: {
      LikeTextarea,
      LikeButton,
      LikeInput,
      LikeSelect
    },
    data () {
      return {
        // 工单类型 1:保养工单
        order_type: 0,

        current_branch: null,
        // 调接口搜索的延时flag
        next_search: null,
        // 当前页搜索接口返回的列表
        branch_list: [],
        // 根据关键词搜索出的可能的网点列表
        branch_list_by_kw: [],

        branch_name: '',
        floor_id: null,
        place_no: '',
        car_status_id: null,
        desc: '',

        select_floor_show: false,
        floor_options: [
          {id: 1, text: '6'},
          {id: 2, text: '5'},
          {id: 3, text: '4'},
          {id: 4, text: '3'},
          {id: 5, text: '2'},
          {id: 6, text: '地面'},
          {id: 7, text: 'B1'},
          {id: 8, text: 'B2'},
          {id: 9, text: 'B3'},
          {id: 10, text: 'B4'},
          {id: 11, text: 'B5'},
          {id: 12, text: 'B6'}
        ],

        select_car_status_show: false,
        car_status_options: []

      }
    },
    computed: {
      // 楼层
      current_floor () {
        return this.floor_options.find(item => this.floor_id === item.id)
      },
      floor_options_index () {
        // index = id - 1 默认选地面 index=5
        return this.current_floor ? this.current_floor.id - 1 : 5
      },
      floor_name () {
        return this.current_floor ? this.current_floor.text : ''
      },

      // 车状态
      current_car_status () {
        return this.car_status_options.find(item => this.car_status_id === item.id)
      },
      car_status_options_index () {
        let index = this.car_status_options.findIndex(item => this.car_status_id === item.id)
        return index > -1 ? index : 0
      },
      car_status_name () {
        return this.current_car_status ? this.current_car_status.text : ''
      }

    },
    created () {

      if (this.$route.query.action === 'load') {
        if (finishData.state.type) this.order_type = finishData.state.type

        // 恢复网点
        if (finishData.state.current_branch) {
          this.current_branch = finishData.state.current_branch
          this.branch_name = finishData.state.current_branch.name
        }

        // 恢复楼层车位
        if (finishData.state.floor_id) this.floor_id = finishData.state.floor_id
        if (finishData.state.place_no) this.place_no = finishData.state.place_no

        if (finishData.state.car_status_id) this.car_status_id = finishData.state.car_status_id
        if (finishData.state.desc) this.desc = finishData.state.desc
      }

      if (this.$route.query.order_type) this.order_type = String(this.$route.query.order_type)

      // 合法type列表
      if (Object.keys(config).includes(this.order_type)) {
        this.car_status_options = config[this.order_type].car_status.map(item => {
          return {
            id: item.status,
            text: item.desc
          }
        })
      } else {
        this.$_LIKE_alert({
          msg: 'type值非法'
        })
      }

    },
    mounted () {

    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/map/branchNearby') {
        let data = {
          type: this.order_type,
          floor_id: this.floor_id,
          place_no: this.place_no,
          car_status_id: this.car_status_id,
          desc: this.desc
        }

        finishData.save(data)
      }
      next()
    },

    methods: {
      chooseFloor (floor) {
        this.floor_id = floor.id
      },
      chooseCarStatus (status) {
        this.car_status_id = status.id
      },

      toMap(){
        this.$router.push({
          path:'/map/branchNearby',
          query:Object.assign({from:'finish'}, this.$route.query)
        })
      },

      kwChange () {
        if (this.next_search) clearTimeout(this.next_search)
        this.next_search = setTimeout(this.searchBranch, 400)
      },
      searchBranch () {
        if (this.branch_name === '') {
          this.branch_list_by_kw = []
          return
        }

        myAjax.post(getOspApiUrl('/vehicle-problem/search'), {kw: this.branch_name}).then(res => {
          if (res.data.branch) {
            this.branch_list = res.data.branch
            this.branch_list_by_kw = res.data.branch.map(item => item.name)
          }
        })
      },
      chooseBranch (value) {
        this.current_branch = this.branch_list.find(item => item.name === value)
      },
      clearBranch () {
        this.current_branch = null
      },

      // 保养工单
      _handleMaintainOrder(data){
        myAjax.post(getOspApiUrl('/vehicle-maintain/operate'),Object.assign({
          mobile:userData.state.mobile
        },data)).then(res=>{
          if(res.status!==0)throw res
          this.$_LIKE_toast({
            msg:'结束工单成功',
            toastCallback:()=>{window.location.href = '/manage/manageOrderMaintenance/index.html#/finishOrder?order_id='+data.order_id}
          })
        }).catch(err=>{
          if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            this.$_LIKE_toast('出错了')
            console.log(err)
          }
        })
      },

      onSubmit () {
        finishData.clear()
        let params = {
          branch_id:this.current_branch.id,
          parking_floor:this.floor_name,
          parking_no:this.place_no,
          remark:this.desc,
          status:this.car_status_id
        }

        switch (Number(this.order_type)){
          case 1:
            this._handleMaintainOrder({
              item_id:7,
              order_id:this.$route.query.order_id,
              params
            })

        }
      }
    }
  }

</script>

<style lang=less scoped>
    @import '../../../../../../other_modules/like-manageOrder/css/color';

    .FinishOrder {
        min-height: 100vh;
        background-color: #f6f6f6;

        section {
            background-color: #fff;
            margin-top: 0.1rem;

            &:nth-child(1) {
                margin-top: 0;
            }

            .choose-map {
                font-weight: 300;
                color: @major;
                padding-left: 1em;
                border-left: solid 1px #f6f6f6;
            }

            & > .item {
                padding: 0.15rem 0.1rem;
                border-top: solid 1px #f6f6f6;

                &.flex {
                    display: flex;
                    justify-content: space-between;

                    .flex-1 {
                        flex: 1;
                    }
                }

                &:nth-of-type(1) {
                    border-top: none
                }

                .label {
                    min-width: 4em;
                }

                .placeholder {
                    font-size: 14px;
                    color: #999;
                }

                .icon-right {
                    width: 0.2rem;
                    height: 0.2rem;
                    background: url('../../images/icon_right.png') no-repeat 90% center;
                    background-size: auto 0.2rem;
                }

                & > .label {

                }

                .textarea-con {
                    margin-top: 0.05rem;
                    background-color: #f7f7f7;
                }
            }
        }

        .btn-con {
            position: fixed;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 -2px 1px #eaeaea;

            .btn {
                width: 100%;
                margin: 0
            }
        }


    }
</style>