<template>
    <div class="container">
        <div class="header">
            <div class="title float-left">城市用户:</div>
            <label class="float-left">
                起止时间：
            </label>
                <Datepicker :language="language" v-model="date" format="yyyy-MM-dd" @selected="changeDate"/>
            <span>-</span>
                <Datepicker :language="language" v-model="date_end" format="yyyy-MM-dd" @selected="changeDateEnd"/>
        </div>
        <v-table
                class="table"
                is-horizontal-resize
                style="width:100%"
                :is-vertical-resize="true"
                :columns="columns"
                :table-data="tableData"
                :show-vertical-border="true"
                row-click-color="#edf7ff"
        />
    </div>
</template>

<script>
  import appArguments from '../../../../../other_modules/app-arguments'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "../js/getApiUrl";
  import {Alert, Toast, Loading,Confirm} from '../../../../../other_modules/vue-plugins/like-base/'
  import Datepicker from 'vuejs-datepicker';
  import zh from "../js/language_zh";
  import addZero from '../js/addZero'

  export default {
    name: "user-stats",
    components: {
      Datepicker
    },
    data(){
      return {
        language: zh,
        date:new Date(),
        date_end:new Date(),
        tableData: [],
        columns: [
          {field: 'city_name', title: '城市', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen: true},
          {field: 'register_num', title: '注册用户数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'license_num', title: '认证用户数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'deposit_num', title: '留存保证金用户数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'total_deposit', title: '累计保证金用户数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'car_num', title: '总车辆数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'reg_ratio', title: '注册人车比', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'lic_ratio', title: '认证人车比', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'dep_ratio', title: '保证金人车比', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true}
        ]
      }
    },
    computed:{
      date_str(){
        let y = this.date.getFullYear()
        let m = this.date.getMonth()+1
        let d = this.date.getDate()
        return y+'-'+addZero(m)+'-'+addZero(d)
      },
      date_end_str(){
        let y = this.date_end.getFullYear()
        let m = this.date_end.getMonth()+1
        let d = this.date_end.getDate()
        return y+'-'+addZero(m)+'-'+addZero(d)
      }
    },
    methods:{

      changeDate(val){
        this.date = val
        this.getData()
      },
      changeDateEnd(val){
        this.date_end = val
        this.getData()
      },
      getData(){
        let loading = Loading()
        let that = this
        myAjax.post(getApiUrl('/bi/user-stats/'),{
          uuid:appArguments.uuid,
          sign:appArguments.sign,
          start_time:this.date_str,
          end_time:this.date_end_str
        }).then(res=>{
          loading.close()

          let data = res.data
          res.total.city_name = '全国'
          data.push(res.total)
          that.tableData = data
        }).catch(err=>{
          loading.close()
        })
      }
    },
    created(){
      this.date = new Date(this.date.getTime()-86400000*30)
      this.getData()
    }
  }
</script>

<style lang=less scoped>
    .v-table-class{
        font-size: 12px;
    }
</style>