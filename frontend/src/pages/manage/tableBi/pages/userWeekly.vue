<template>
    <div class="container">
        <div class="header">
            <div class="title float-left">用户周报表:</div>
            <label class="float-left">
                查询时间：
            </label>
            <Datepicker :language="language" v-model="date_end" format="yyyy-MM-dd" @selected="changeDateEnd"/>
            <div class="week_des">{{week_des}}</div>
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
    name: "user-weekly",
    components: {
      Datepicker
    },
    data(){
      return {
        language: zh,
        date_end:new Date(new Date().getTime() - 86400000*7),
        week_des:'',
        tableData: [],
        columns: [
          {field: 'city', title: '城市', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen: true},
          {field: 'new_register_num', title: '新增注册用户', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'new_license_num', title: '新增认证用户', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'new_deposit_num', title: '新增押金用户', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'new_order_user', title: '新增订单用户', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'order_user_num', title: '周订单用户数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'active_user', title: '活跃用户数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'honest_user', title: '忠诚用户数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'activity_ratio', title: '用户活跃度', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'register_num', title: '总用户', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'license_num', title: '总认证用户', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'deposit_num', title: '总押金用户', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true}
        ]
      }
    },
    computed:{
      date_end_str(){
        let y = this.date_end.getFullYear()
        let m = this.date_end.getMonth()+1
        let d = this.date_end.getDate()
        return y+'-'+addZero(m)+'-'+addZero(d)
      }
    },
    methods:{
      changeDateEnd(val){
        this.date_end = val
        this.getData()
      },
      getData(){
        let loading = Loading()
        let that = this
        myAjax.post(getApiUrl('/bi/user-weekly/'),{
          uuid:appArguments.uuid,
          sign:appArguments.sign,
          end_time:this.date_end_str
        }).then(res=>{
          loading.close()


          if(res.week_no){
            that.week_des = '第'+res.week_no+'周 '+res.date

            let data = []
            for (let key in res.data){
              data.push(res.data[key].cur)
              data.push(res.data[key].pre)
            }
            data.push(res.cur_total)
            data.push(res.pre_total)

            that.tableData = data
          }else{
            Toast('未查询到有效数据')
          }


          console.log(res)
        }).catch(err=>{
          loading.close()
        })
      }
    },
    created(){
      this.getData()
    }
  }
</script>

<style lang=less scoped>
    .v-table-class{
        font-size: 12px;
    }
</style>