<template>
    <div class="infoPre">
        <div v-if="!view_mode">
            <div class="item">
                <span class="label required">选择保养方式：</span>
                <Radio
                        class="radio-com"
                        :options="options"
                        v-model="maintain_way_type"
                        display="inline"
                />
            </div>

            <div class="item flex">
                <span class="label required">车辆已行驶总里程：</span>
                <LikeInput
                        class="flex-1"
                        type="number"
                        placeholder="请输入车辆已行驶总里程"
                        v-model="distance"
                />
                <span class="label">公里</span>
            </div>

            <div class="item flex">
                <span class="label" :class="{required:maintain_way_type!==1}">保养地点：</span>
                <LikeInput
                        class="flex-1"
                        placeholder="请输入维修地点"
                        :options="maintain_branches.map(item=>item.place_name)"
                        @pick="pickBranch"
                        v-model="maintain_branch_name"
                />

            </div>

            <div class="item">
                <span class="label required">请拍摄照片：</span>
                <div class="photo-con">
                    <UploadPhoto
                            @change="onPhoto"
                            @view="onView"
                    />
                    里程表照片
                </div>

            </div>

            <div class="tips">*“自保”为运维人员自行保养，“外保”为将车送至4S店或维修厂保养</div>

            <div>
                <div class="btn-con-height"></div>
                <div class="btn-con">
                    <LikeButton
                            text="保存"
                            type="primary"
                            :disabled="btn_disabled"
                            :disabled_msg="disabled_msg"
                            @click="onSubmit"
                            class="btn"
                    />
                </div>
            </div>
        </div>

        <div v-else>
            <div class="item">
                <span class="label">选择保养方式：</span>
                <span >{{maintain_way_type===1 ? '自保':'外保'}}</span>
            </div>

            <div class="item flex">
                <span class="label">车辆已行驶总里程：</span>
                <span class="flex-1">{{distance}}</span>
                <span class="label">公里</span>
            </div>

            <div class="item flex">
                <span class="label">保养地点：</span>
                <span class="flex-1">{{maintain_branch_name}}</span>
            </div>

            <div class="item">
                <span class="label">请拍摄照片：</span>
                <div class="photo-con">
                    <UploadPhoto
                            type="11"
                            :view_url="photo_url"
                            @view="onView"
                    />
                    里程表照片
                </div>
            </div>

            <div class="tips">*“自保”为运维人员自行保养，“外保”为将车送至4S店或维修厂保养</div>

            <div>
                <div class="btn-con-height"></div>
                <div class="btn-con">
                    <LikeButton
                            text="返回"
                            type="default"
                            @click="back"
                            class="btn"
                    />
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import LikeInput from '../../../../../other_modules/like-manageOrder/component/Input'
  import Radio from '../../../../../other_modules/like-manageOrder/component/Radio'
  import UploadPhoto from '../../../../../other_modules/like-manageOrder/component/uploadPhoto'

  export default {
    name: "infoPre",
    components: {
      Radio,
      UploadPhoto,
      LikeButton,
      LikeInput
    },
    data () {
      return {
        view_mode:false,

        options: [
          {id: 1, label: '自保'},
          {id: 2, label: '外保'},
        ],
        maintain_way_type: 0,

        current_branch:null,
        photo_url: '',
        distance: '',
        maintain_branch_name: ''
      }
    },
    computed: {
      ...mapState('maintain', ['maintain_branches']),
      btn_disabled () {
        return (this.maintain_way_type !== 1 && this.maintain_branch_name === '') || this.distance === '' || this.photo_url === ''
      },
      disabled_msg () {
        if (this.distance === '') return '请输入行驶总里程'
        if (this.maintain_way_type !== 1 && this.maintain_branch_name === '') return '请选择保养地点'
        if (this.photo_url === '') return '请上传照片'
        return '输入判定出错了，请联系开发'
      },


    },
    methods: {
      back(){
        this.$router.back()
      },
      onPhoto (url) {
        this.photo_url = url
      },
      onView (url) {
        dd.previewImage({
          urls: [this.photo_url],
          current: url
        })
      },
      pickBranch(branch){
        let maintain_branch = this.maintain_branches.find(item => item.place_name === branch)
        if(maintain_branch){
          this.current_branch = maintain_branch
        }else{
          this.current_branch = null
        }
      },
      onSubmit () {
        let data = {
          item_id:3,
          order_id:this.$route.query.order_id,
          params:{
            maintain_mod:this.maintain_way_type,
            custom_km:this.distance,
            photo:this.photo_url
          }
        }

        if(this.current_branch){
          data.params.repair_branch = this.current_branch.id
          data.params.branch_name = this.current_branch.place_name
        }else if(this.maintain_way_type !==1){
          this.$_LIKE_alert({
            msg: '该保养地点未在系统录入，请联系相关人员新增后操作',
            confirmButtonText: '知道了'
          })
          return
        }

        this.$store.dispatch('maintain/submit',data).then(res=>{
          this.$_LIKE_toast('提交成功')
          this.$router.push({
            path:'/edit',
            query:{
              order_id:this.$route.query.order_id
            }
          })
        }).catch(err=>{
          if(err.msg)this.$_LIKE_toast(err.msg)
        })

      }

    },
    created () {
      this.view_mode=Boolean(this.$route.query.view)

      if(this.view_mode){
        this.$store.dispatch('history/getItemHistory',{
          order_id:this.$route.query.order_id,
          item_id:3
        }).then(res=>{
          this.maintain_way_type = Number(res.data.maintain_mod)
          this.distance = res.data.custom_km
          this.maintain_branch_name = res.data.branch_name
          this.photo_url = res.data.photo
        }).catch(err=>{
          if(/code 500/.test(err.message)){
            this.$_LIKE_alert({
              msg:'服务器接口500错误，请联系开发'
            })
          }else if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            throw err
          }
        })
      }else{
        this.$store.dispatch('maintain/getMaintainBranches')
      }

    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';
    .infoPre {

        .item {
            color: #333;
            border-top: solid 1px #f2f2f2;
            padding: 0.15rem 0.1rem;
            background-color: #fff;

            &:nth-of-type(1) {
                border: none
            }

            &.flex {
                display: flex;
                justify-content: space-between;
            }

            .flex-1 {
                flex: 1;
            }

            .label.required::before{
                content: '*';
                color:@error;
            }


            .radio-com {
                display: inline-block;
            }

            .photo-con {
                padding: 0.1rem;
                width: 0.9rem;
                font-size: 12px;
                color: #333;
                text-align: center;
            }
        }

        .tips {
            padding: 0.1rem;
            font-size: 12px;
            color: #999999;
        }

        .btn-con-height {
            height: 0.7rem;
        }

        .btn-con {
            position: fixed;
            display: flex;
            justify-content: space-between;
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

            .btn-full {
                width: 100%;
                margin: 0;
            }
        }
    }
</style>