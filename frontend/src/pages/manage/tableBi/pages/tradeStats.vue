<template>
    <div class="container">
        <div class="header">
            <div class="title float-left">城市营收:</div>
            <label class="float-left">
                城市：
                <select v-model="city_id" @change="changeCity">
                    <option v-for="item in cities" :key="item.id" :value="item.id">{{item.name}}</option>
                </select>
            </label>

            <label class="float-left">
                结束：
            </label>
            <Datepicker :language="language" v-model="date" format="yyyy-MM-dd" @selected="changeDate"/>
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
        cities:[],
        city_id:197,
        date:new Date(),
        tableData: [],
        columns: [
          {field: 'date_no', title: '日期', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen: true},
          {field: 'city_name', title: '城市', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'car_num', title: '运营车辆(油车)', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'branch_num', title: '网点数据', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'order_num', title: '单车订单', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'time_total', title: '单车时长(小时)', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'km_total', title: '单车里程(公里)', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'fee_total', title: '单车应收(元)', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'fee_actual', title: '单车实收(元)', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'register_num', title: '注册人数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'license_num', title: '认证人数', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true},
          {field: 'order_user', title: '订单用户', width:60,titleAlign: 'center', columnAlign: 'center',isResize:true}
        ]
      }
    },
    computed:{
      date_str(){
        let y = this.date.getFullYear()
        let m = this.date.getMonth()+1
        let d = this.date.getDate()
        return y+'-'+addZero(m)+'-'+addZero(d)
      }
    },
    methods:{
      changeCity(){
        this.getData()
      },
      changeDate(val){
        this.date = val
        this.getData()
      },
      getData(){
        let loading = Loading()
        let that = this
        myAjax.post(getApiUrl('/bi/trade-stats/'),{
          uuid:appArguments.uuid,
          sign:appArguments.sign,
          city:this.city_id,
          end_time:this.date_str
        }).then(res=>{
          loading.close()

          // 加载日期
          if(that.cities.length === 0){
            let cities = []
            for(let key in res.cities){
              cities.push(res.cities[key])
            }
            that.cities = cities
          }

          let data = res.data
          res.compare_last.date_no = '环比上一天'
          data.push(res.compare_last)
          res.compare_last_week.date_no = '环比上周同期'
          data.push(res.compare_last_week)
          res.compare_last_two_week.date_no = '环比上2周同期'
          data.push(res.compare_last_two_week)
          res.latest_days.date_no = '近七天平均'
          data.push(res.latest_days)
          
          that.tableData = data
          console.log(res)
        }).catch(err=>{
          loading.close()
        })
      }
    },
    created(){
      this.date = new Date(new Date().getTime()-86400000)
      console.log(appArguments)
        this.getData()
    }
  }
</script>

<style lang=less>
    .header{
        padding: 0.05rem 0.1rem;
        .title{
            margin-right: 10px;
        }
        select,input{
            width: 6em;
        }
        .vdp-datepicker{
            display: inline-block;
        }
    }


    .v-table-title-cell{
        background-color:#666;
        color:#fff;
    }
    .v-table-class{
        font-size: 12px;
    }
</style>