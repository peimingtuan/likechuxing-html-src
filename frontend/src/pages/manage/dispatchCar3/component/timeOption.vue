<template>
    <div class="TimeOption">
        <div class="title" @click="toggleList">条件筛选</div>
        <div class="list" ref="list" style="display:none">
            <div class="item">
                <label>
                    时段:
                    <select class="select" v-model="group" @change="handleChange">
                        <option v-for="item in groupList" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                </label>
            </div>
            <div class="item">
                <label>
                    类型:
                    <select class="select" v-model="type" @change="handleChange">
                        <option v-for="item in typeList" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                </label>
            </div>
            <div class="item">
                <label>
                    <input type="checkbox" class="checkbox" v-model="show_name" @change="handleName"/>
                    显示网点名称
                </label>
            </div>
        </div>
    </div>
</template>

<script>
  import $ from '../../../../../other_modules/jquery&ui/jquery&ui'

  export default {
    name: "time-option",
    data() {
      return {
        groupList: [
          {
            id: 1,
            name: '7-10点'
          },
          {
            id: 2,
            name: '16-19点'
          },
          {
            id: 3,
            name: '21-3点'
          }
        ],
        group: 1,
        typeList: [
          {
            id: 0,
            name: '全部'
          },
          {
            id: 1,
            name: '用车'
          },
          {
            id: 2,
            name: '还车'
          }
        ],
        type: 0,
        show_name: false
      }
    },
    methods: {
      toggleList() {
        $(this.$refs.list).slideToggle(200)
      },
      handleChange() {
        this.$emit("setGroup",{
          group:this.group,
          type:this.type
        })
      },
      handleName(){
        this.$emit("setName",{
          show_name:this.show_name
        })
      }
    }
  }
</script>

<style lang=less>
    .TimeOption {
        padding: 7px 0;
        position: relative;
        .title {
            text-align: center;
            background-color: #1a1a1a;
            color: #fff;
            padding: 3px 8px;
            width: 140px;
            border-radius: 5px;
        }
        .select{
            width: 7em;
        }
        .list {
            position: absolute;
            top: 33px;
            width: 100%;
            background-color: #fff;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 2px 2px #999;
            padding: 10px;
            box-sizing: border-box;
            .item {
                padding: 2px 0;
            }
            .checkbox {
                -webkit-appearance: checkbox;
                width: 16px;
                height: 16px;
                margin: 2px
            }
        }
    }
</style>