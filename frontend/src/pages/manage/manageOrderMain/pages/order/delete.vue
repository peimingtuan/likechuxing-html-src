<template>
    <div class="Delete">

        <div class="box">
            <div class="title">更改车辆状态：</div>
            <FilterSingle class="filter-single" :options="options" :selected="selected" @change="id=>{this.selected=id}"/>
        </div>

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

        <div class="btn-con">
            <LikeButton
                    text="确认删除"
                    type="primary2"
                    :disabled="btn_disable"
                    @click="nextStep"
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

    </div>
</template>

<script>
  import userData from '../../../../../../other_modules/like-manageOrder/UserData'
  import finishData from '../../js/finishData'
  import FilterSingle from '../../../../../../other_modules/like-manageOrder/component/FilterSingleV2'
  import LikeButton from '../../../../../../other_modules/like-manageOrder/component/Button'
  import LikeInput from '../../../../../../other_modules/like-manageOrder/component/Input'
  import LikeSelect from '../../../../../../other_modules/like-manageOrder/component/Select'
  import {getOspApiUrl} from '../../js/getApiUrl'
  import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'

  export default {
    name: "delete",
    components: {
      FilterSingle,
      LikeButton,
      LikeInput,
      LikeSelect
    },
    data () {
      return {
        options:[
          {id:1,text:'空闲'}
        ],
        selected:1,

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
      }
    },
    computed:{
      btn_disable(){
        return !this.current_branch || !this.floor_id || !this.place_no
      },

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
    },
    methods:{
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
      chooseFloor (floor) {
        this.floor_id = floor.id
      },
      toMap(){
        this.$router.push({
          path:'/map/branchNearby',
          query:Object.assign({from:'delete'}, this.$route.query)
        })
      },

      // 保养工单
      _handleMaintainOrder(data){
        let loading = this.$_LIKE_loading()
        myAjax.post(getOspApiUrl('/vehicle-maintain/operate'),Object.assign({
          mobile:userData.state.mobile
        },data)).then(res=>{
          loading.close()
          if(res.status!==0)throw res
          this.$_LIKE_toast({
            msg:'删除成功',
            toastCallback:()=>{window.location.href = '/manage/manageOrderMain/index.html'}
          })

        }).catch(err=>{
          loading.close()
          if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            this.$_LIKE_toast('出错了')
            console.log(err)
          }
        })
      },

      nextStep(){
        finishData.clear()
        let params = {
          branch_id:this.current_branch.id,
          parking_floor:this.floor_name,
          parking_no:this.place_no,
          status:this.selected
        }
        console.log(params)

        switch (Number(this.order_type)){
          case 1:
            this._handleMaintainOrder({
              item_id:99,
              order_id:this.$route.query.order_id,
              params
            })

        }
      }
    },
    created(){
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
      }

      console.log(this.current_branch)

      if (this.$route.query.order_type) this.order_type = String(this.$route.query.order_type)
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
  }
</script>

<style lang=less scoped>
    @import '../../../../../../other_modules/like-manageOrder/css/color';

.Delete{
    min-height: 100vh;
    background-color: #f6f6f6;
    color:#333;
    .box{
        padding: 0.1rem 0.15rem;
        background-color: #fff;
        margin-top: 0.1rem;
        &:nth-of-type(1){margin-top: 0;}

        &.no-padding{
            padding: 0;
        }

        .filter-single{
            margin-top:0.05rem
        }

        .branch{
            margin:0.05rem 0;
        }

        .label{
            display: inline-block;
            min-width: 4em;
        }

        .item{
            padding: 0.15rem 0.15rem;
            border-top:solid 1px #dfdfdf;
            &:nth-of-type(1){
                border:none;
            }
        }
    }

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

    .btn-con{
        position: fixed;
        bottom:0;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 -2px 1px #eaeaea;
        .btn{
            width: 100%;
            margin:0
        }
    }
}
</style>