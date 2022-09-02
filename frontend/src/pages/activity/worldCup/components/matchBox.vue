<template>
    <div class="MatchBox">
        <div class="title">
            <p>{{time_start_h}}</p>
            <p>{{time_remain}}</p>
        </div>
        <div class="box">

            <div class="vs">VS</div>

            <div class="team">
                <div class="flag_con" :style="{backgroundImage:'url('+match.home_logo+')'}">
                    <div class="bet" v-if="betting === 'home'"></div>
                </div>
                <button class="btn" v-if="!notBet" :class="{disabled:notBet}" @click="bet('home')">{{match.home_name}}胜</button>
            </div>

            <div class="team">
                <div class="flag_con" :style="{backgroundImage:'url('+match.away_logo+')'}">
                    <div class="bet" v-if="betting === 'away'"></div>
                </div>
                <button class="btn" v-if="!notBet" :class="{disabled:notBet}" @click="bet('away')">{{match.away_name}}胜</button>
            </div>

        </div>
    </div>
</template>

<script>
  import formatTime from '../js/formatTime'
  import during from '../js/during'
  export default {
    name: "match-box",
    props:['match','time_server','betting'],
    computed:{
      notBet(){
        return this.match.is_end || ['home','away'].includes(this.betting)
      },
      time_start_h(){
        return formatTime(this.match.match_time,8)
      },
      time_remain(){
        return this.match.is_end ? '本场竞猜已结束' : '距竞猜结束还有'+during(this.match.match_time-this.time_server)
      }
    },
    methods:{
      bet(team_id){
        if(this.notBet) return

        this.$emit('bet',{
          match_id:this.match.match_id,
          team_id:team_id
        })
      }
    }
  }
</script>

<style lang=less>
    .MatchBox{
        margin:0.1rem 0 0.3rem;
        .title{
            color:#fff;
            font-size: 14px;
            text-align: center;
        }
        .box{
            position: relative;
            display: flex;
            justify-content:space-between;
            .vs{
                position: absolute;
                width: 2em;
                margin-left:-1em;
                left:50%;
                color:#fff;
                font-size: 16px;
                text-align: center;
                line-height: 0.2rem;
                top:0.35rem
            }
            .team{
                width: 1.05rem;
                .flag_con{
                    margin:0.05rem 0;
                    height: 0.8rem;
                    background: no-repeat center;
                    background-size: auto 100%;
                    position: relative;
                    .bet{
                        width: 0.24rem;
                        height: 0.24rem;
                        background: url('../images/bet.png') no-repeat center;
                        background-size: 100%;
                        position: absolute;
                        top:0.44rem;
                        left:0.68rem;
                    }
                }
                .btn{
                    word-break: keep-all;
                    margin:0.1rem 0;
                    width: 100%;
                    height: 0.4rem;
                    border-radius: 0.2rem;
                    color:#f35046;
                    background-color: #fff;
                    font-size: 16px;
                    border:none;
                    box-shadow: 3px 5px 10px 0 rgba(0,0,0,0.3);
                    outline: none;
                    &:not(.disabled):active{
                        transition: all 100ms;
                        transform: scale(0.98);
                        box-shadow: 2px 3px 5px 0 rgba(0,0,0,0.1);
                    }
                    &.disabled{
                        box-shadow: none;
                        opacity: 0.6;
                    }
                }
            }
        }
    }
</style>