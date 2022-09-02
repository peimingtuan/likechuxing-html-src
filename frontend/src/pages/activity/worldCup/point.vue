<template>
    <div class="Point">
        <header class="header"></header>
        <main class="container">
            <div v-if="point!=='-'">
                <div class="title" >
                    <p>已获得</p>
                    <div class="score" v-if="point!=='-'">
                        <ICountUp
                                :startVal="0"
                                :endVal="point"
                                :decimals="0"
                                :duration="1"
                                :options="countUp_options"
                        />
                        <span class="mini">分</span>
                    </div>
                </div>
                <ul class="list" v-if="list.length>0">
                    <li class="item" v-for="item in list" :key="item.create_at">
                        <span class="unit">{{item.create_time}}</span>
                        <span class="unit num">{{item.desc}}</span>
                        <span class="unit point">+{{item.point}}</span>
                    </li>
                    <li class="more">......</li>
                </ul>
                <div class="empty_list" v-else>还没有竞猜奖励，快去参与吧</div>
            </div>

            <div class="football"></div>
        </main>
        <footer class="footer"></footer>
    </div>
</template>

<script>
  import {Alert, Toast, Loading, Confirm} from '../../../../other_modules/vue-plugins/like-base/'
  import appArguments from '../../../../other_modules/app-arguments'
  import ICountUp from 'vue-countup-v2';
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";
  import formatTime from './js/formatTime'

  export default {
    name: "point",
    components: {
      ICountUp
    },
    data() {
      return {
        point: '-',
        list:[],
        countUp_options: {
          useEasing: true,
          useGrouping: false,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ''
        }
      }
    },
    created() {
      let loading = Loading()
      myAjax.post(getApiUrl('activity-world-cup/point-detail'), {
        uuid: appArguments.uuid,
        sign: appArguments.sign
      }).then(res => {
        loading.close()
        this.point = res.data.total
        this.list = res.data.list.map(item=>{
          item.create_time = formatTime(item.create_at,9)
          return item
        })
      }).catch(err => {
        loading.close()
      })
    }
  }
</script>

<style lang=less>
.Point{
    .container{
        min-height: 2.4rem;
        position: relative;
        padding-bottom: 0.56rem;
        .title{
            font-size: 42px;
            color:#fff;
            text-align: center;
            .score{
                color:#fcdd38
            }
            .mini{
                font-size: 22px;
                color:#fff;
            }
        }
        .list{
            margin:0.5rem 0;
            .item{
                font-size: 15px;
                color:#fff;
                margin:0.1rem 0;
                text-align: center;
                .unit{
                    margin:0 0.05rem;
                    text-align: center;
                    display: inline-block;
                    &.time{
                        width: 6em;
                    }
                    &.num{
                        width: 6.5em;
                        text-align: center;
                    }
                    &.point{
                        width: 2em;
                        color:#fcdd38
                    }
                }
            }
            .more{
                text-align: center;
                font-size: 18px;
                color:#fcdd38
            }
        }

        .empty_list{
            color:#fff;
            text-align: center;
            margin:0.4rem 0;
        }

        .football{
            position: absolute;
            bottom:0.1rem;
            left:0;
            width:100%;
            height: 0.46rem;
            background: url('./images/football.png') no-repeat center;
            background-size: auto 100%;
        }
    }
}
</style>