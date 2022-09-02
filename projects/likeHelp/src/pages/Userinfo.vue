<template>
  <div class="UserInfo" v-loading="loading">
    <div class="search-box" @keydown="searchKeyDown($event)">
      <el-input ref="searchBox" placeholder="请输入检索关键字" v-model="query" class="input-with-select">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="用户id" value="uid"/>
          <el-option label="手机号" value="phone"/>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
      </el-input>
    </div>
    <div class="result" v-if="user">

      <!--uid/phone-->
      <el-row>
        <el-col :span="4">
          <div class="label">uid:</div>
        </el-col>
        <el-col :span="6">
          <div class="value">{{user.id}}</div>
        </el-col>
        <el-col :span="4">
          <div class="label">phone_no:</div>
        </el-col>
        <el-col :span="10">
          <div class="value">{{user.phone_no}}</div>
        </el-col>
      </el-row>

      <!--city/channel-->
      <el-row>
        <el-col :span="4">
          <div class="label">城市:</div>
        </el-col>
        <el-col :span="6">
          <div class="value">{{user.city_name}}({{user.city_id}})</div>
        </el-col>
        <el-col :span="4">
          <div class="label">注册渠道:</div>
        </el-col>
        <el-col :span="10">
          <div class="value">{{user.channel}}</div>
        </el-col>
      </el-row>

      <!--uuid/sign-->
      <el-row>
        <el-col :span="4">
          <div class="label">uuid:</div>
        </el-col>
        <el-col :span="6">
          <div class="value">{{user.uuid}}</div>
        </el-col>
        <el-col :span="4">
          <div class="label">sign:</div>
        </el-col>
        <el-col :span="10">
          <div class="value">{{user.sign}}</div>
        </el-col>
      </el-row>

      <!--point/license-->
      <el-row>
        <el-col :span="4">
          <div class="label">里程积分:</div>
        </el-col>
        <el-col :span="6">
          <div class="value">{{user.points}}</div>
        </el-col>
        <el-col :span="4">
          <div class="label">认证状态:</div>
        </el-col>
        <el-col :span="10">
          <div class="value">{{user.license_status_desc}}({{user.license_status}})</div>
        </el-col>
      </el-row>

      <!--rental-->
      <div v-if="user && user.rental.length>0">
        <el-row v-for="rental in user.rental" :key="rental.id">
          <el-col :span="2">
            <div class="rental">{{rental.id}}</div>
          </el-col>
          <el-col :span="6">
            <div class="rental">{{rental.uuid}}</div>
          </el-col>
          <el-col :span="4">
            <div class="rental">{{rental.status_desc}}</div>
          </el-col>
          <el-col :span="2">
            <div class="rental">{{rental.fee_total}}</div>
          </el-col>
          <el-col :span="6">
            <div class="rental">{{rental.book_time_h}}</div>
          </el-col>
          <el-col :span="4">
            <div class="rental">
              <el-button size="mini" @click="openRentalDetail(rental.uuid)">打开8081</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row>
          <el-col :span="24">
            <div class="rental">当前用户暂无行程</div>
          </el-col>
        </el-row>
      </div>

      <el-button class="float-right btn" type="primary" @click="openLocal">user跳转8081</el-button>
      <el-button class="float-right btn" v-if="user.admin_sign" @click="openLocalAdmin">admin跳转8081</el-button>
      <el-button class="float-right btn" v-if="user.phone_no==='18610326236'" @click="openLocalPro">admin_pro跳转8081
      </el-button>
    </div>
  </div>
</template>

<script>
  import myAjax from '../../other_modules/like-request/withAxiosV2'
  import {API} from '../common/apiAddress'

  export default {
    name: "usernfo",
    data() {
      return {
        loading: false,

        type: 'uid',
        query: '',

        user: null
      }
    },
    methods: {
      search() {
        this.loading = true
        myAjax.get(API.user.info, {
          type: this.type,
          query: this.query
        }).then(res => {
          this.loading = false
          if (res.status === 0) {
            this.user = res.data
          } else {
            this.user = null
            this.$message.error(res.msg);
          }
          console.log(res)
        })
      },
      searchKeyDown(ev) {
        // 回车
        if (ev.keyCode === 13) {
          this.$refs.searchBox.blur()
          this.search()
        }

      },
      openLocal() {
        window.open('http://localhost:8081/?uuid=' + this.user.uuid + '&sign=' + this.user.sign)
      },
      openLocalAdmin() {
        window.open('http://localhost:8081/?uuid=' + this.user.phone_no + '&sign=' + this.user.admin_sign)
      },
      openLocalPro() {
        window.open('http://localhost:8081/?uuid=18610326236&sign=$2y$13$JleurEAFJKgXjaS078DG.eoqvXGuTTzKRKf51M8RC3vt/l5O2TOOq')
      },
      openRentalDetail(rental_no) {
        window.open('http://localhost:8081/?uuid=' + this.user.uuid + '&sign=' + this.user.sign + '&rental_no=' + rental_no + '&user_version=ios_2109')
      }
    }
  }
</script>

<style lang=less>
  .UserInfo {
    height: 100%;
    box-sizing: border-box;
    .search-box {
      margin-top: 20px;
    }
    .btn {
      margin: 10px 0 10px 10px
    }
    .result {
      margin: 20px 0;
      .label, .value, .rental {
        font-size: 14px;
        line-height: 28px;
      }
      .label {
        text-align: right;
        color: #999;
        padding-right: 5px;
      }
      .rental {
        text-align: center;
      }
    }

    .el-select .el-input {
      width: 130px;
    }
    .el-row {
      background: #e5e9f2;
      border-radius: 4px;
      margin: 5px 0;
      padding: 5px 0;
      .el-col {
        overflow: hidden;
      }
    }
  }
</style>
