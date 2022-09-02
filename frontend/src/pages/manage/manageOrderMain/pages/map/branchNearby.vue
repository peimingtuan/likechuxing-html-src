<template>
    <div class="branchNearby" v-if="dataReady">
        <Map class="map-con" :center="center" :showCurrent="true"/>

        <div class="search-box">
            <LikeInput
                    class="search"
                    type="text"
                    placeholder="请输入网点名称"
                    v-model="branch_name"
                    :options="branch_list_by_kw"
                    @input="kwChange"
                    @pick="pickBranchName"
            />
        </div>

        <div class="footer-box">
            <div class="branch-box" v-if="branch_picked">
                <div class="branch-desc">
                    <div class="name">{{branch_picked.name}}</div>
                    <div class="address">{{branch_picked.address}}</div>
                </div>

                <div class="nav-box" @click="toNav"></div>
            </div>

            <div class="btn-con">
                <LikeButton
                        text="提交"
                        type="primary2"
                        :disabled="!branch_picked"
                        @click="onSubmit"
                        class="btn"
                />
            </div>
        </div>

    </div>
</template>

<script>
  import finishData from '../../js/finishData'
  import mapControl from '../../../../../../other_modules/like-manageOrder/mapControl'
  import Map from '../../../../../../other_modules/like-manageOrder/component/Map'
  import dd from '../../../../../../other_modules/like-manageOrder/ddSDK'
  import {Indicator} from 'mint-ui';
  import {getOspApiUrl} from '../../js/getApiUrl'
  import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'
  import LikeButton from '../../../../../../other_modules/like-manageOrder/component/Button'
  import LikeInput from '../../../../../../other_modules/like-manageOrder/component/Input'

  export default {
    name: "branchNearby",
    components: {
      Map,
      LikeButton,
      LikeInput
    },
    data () {
      return {
        dataReady: false,
        lng: 0,
        lat: 0,

        // 附近网点
        branches_nearBy: [],
        // 全城搜索名称点选的网点
        branch_picked: null,

        // 调接口搜索的延时flag
        next_search: null,
        // 当前页所有搜索次数接口返回的列表（大概率有重复项）
        branch_list: [],
        // 根据关键词搜索出的可能的网点列表
        branch_list_by_kw: [],

        branch_name: '',
      }
    },
    computed: {
      center () {
        return [this.lng, this.lat]
      },
      branches () {
        return this.branch_picked ? this.branches_nearBy.concat([this.branch_picked]) : this.branches_nearBy
      }
    },
    created () {
      Indicator.open()
      dd.getLocation().then(res => {
        this.lng = res.longitude
        this.lat = res.latitude
        this.dataReady = true
        Indicator.close()

        return myAjax.post(getOspApiUrl('/work-order/select-branch'), {
          lng: this.lng,
          lat: this.lat
        })
      }).then(res => {
        if (res.status === 0) {
          this.branches_nearBy = res.data
          mapControl.drawBranchMarkers(this.branches)
          mapControl.drawBranchNumMarkers(this.branches)

          mapControl.marker.branchMarkers.on('click', this.handleMarkerCLick)
          mapControl.marker.branchNumMarkers.on('click', this.handleMarkerCLick)
        } else {
          this.$_LIKE_toast(res.msg)
        }
      })
    },
    methods: {
      handleMarkerCLick (e) {
        let click_data = e.target.getExtData()
        this.branch_picked = click_data
        this.branch_name = click_data.name

        mapControl.marker.branchMarkers.eachOverlay(function (marker) {
          let marker_data = marker.getExtData()
          if (marker_data.branch_id === click_data.branch_id && !marker.is_zoomIn) {
            marker.zoomIn()
          } else if (marker.is_zoomIn) {
            marker.zoomOut()
          }
        })

        mapControl.marker.branchNumMarkers.eachOverlay(function (marker) {
          let marker_data = marker.getExtData()
          let content = marker.getContent()
          let is_active = /active/.test(content)
          if (marker_data.branch_id === click_data.branch_id && !is_active) {
            marker.setOffset(mapControl.markerConfig.branchNum.offset_large)
            marker.setContent(mapControl.markerConfig.branchNum.contentTemplate_large.replace('$num$', marker_data.car_num))
          } else if (is_active) {
            marker.setOffset(mapControl.markerConfig.branchNum.offset)
            marker.setContent(mapControl.markerConfig.branchNum.contentTemplate.replace('$num$', marker_data.car_num))
          }
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

      pickBranchName (branchName) {
        let branch = this.branch_list.find(item => item.name === branchName)
        this.branch_picked = branch

        let marker = mapControl.drawBranchMarker(branch)
        marker.zoomIn()
        marker.on('click', this.handleMarkerCLick)
        mapControl.marker.branchMarkers.addOverlay(marker)
        mapControl.map.setZoom(16)
        mapControl.map.panTo([branch.lng, branch.lat])
      },

      toNav(){
        mapControl.drivingOnAmap({
          origin:this.center,
          originName:'当前位置',
          destination:[this.branch_picked.lng,this.branch_picked.lat],
          destinationName:this.branch_picked.name
        })
      },

      onSubmit(){
        if(!this.branch_picked.id)this.branch_picked.id=this.branch_picked.branch_id
        finishData.save({
          current_branch:this.branch_picked
        })

        switch (this.$route.query.from){
          case 'finish':
            this.$router.push({
              path:'/order/finish',
              query:Object.assign({
                action:'load'
              },this.$route.query)
            })
            break;

          case 'delete':
            this.$router.push({
              path:'/order/delete',
              query:Object.assign({
                action:'load'
              },this.$route.query)
            })
            break;
        }

      }
    }
  }
</script>

<style lang=less scoped>
    .branchNearby {
        position: relative;
        width: 100vw;
        height: 100vh;

        .map-con {
            width: 100vw;
            height: 100vh;
        }

        .search-box {
            position: absolute;
            margin: 0.1rem;
            padding: 0.12rem 0.13rem;
            background-color: #fff;
            border-radius: 2px;
            top: 0;
            left: 0;
            right: 0;
        }

        .footer-box{
            position: fixed;
            z-index: 170;
            margin:0.1rem;
            left:0;
            right:0;
            bottom: 0;

            .branch-box{
                background: #fff;
                border-radius: 2px;
                overflow: hidden;
                display: flex;
                .branch-desc{
                    padding: 0.1rem 0.2rem;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    align-content: center;
                    flex:1;
                    .name {
                        width:100%;
                        font-size: 15px;
                        color:#333;
                        margin-bottom: 0.05rem;
                    }
                    .address{
                        width: 100%;
                        font-size: 12px;
                        color:#999;
                    }

                }
                .nav-box{
                    width: 0.8rem;
                    height: 0.8rem;
                    background: url('../../images/nav.png') no-repeat center;
                    background-size:60%;
                    border-left:solid 1px #f6f6f6;
                }
            }

            .btn-con {
                width: 100%;
                margin-top: 0.1rem;
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

    }
</style>