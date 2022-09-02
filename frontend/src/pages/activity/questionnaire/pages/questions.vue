<template>
    <div class="questions">
        <div class="header"></div>

        <div class="list">
            <template v-for="(item,index) in questions">
                <Radio v-if="item.type==='radio_s'" :key="item.id" :data="item" :index="index" v-model="item.value"
                       @inputDesc="val=>onInputDesc(item,val)"/>
                <Grade v-else-if="item.type==='grade'" :key="item.id" :data="item" :index="index" v-model="item.value"/>
                <TextArea2 v-else-if="item.type==='textarea'" :key="item.id" :data="item" :index="index"
                           :maxlength="item.maxlength" :value="item.value" @inputDesc="val=>onInputDesc(item,val)"/>
            </template>

            <button class="btn" :class="{disabled:btn_disabled}" @click="onSubmit">提交</button>

            <div class="tips">
                <p class="title">*说明</p>
                <p>1.该活动仅限首次用车的用户参加；</p>
                <p>2.每位符合条件的用户仅可参加一次；</p>
                <p>3.官方短信中的链接仅对本人有效。</p>
            </div>
        </div>

        <div class="footer"></div>
    </div>
</template>

<script>
  import Radio from '../components/radio'
  import Grade from '../components/grade'
  import TextArea2 from '../components/textarea2'

  const questions = require('../data/question_1').map(item => {
    item.value = ''
    item.desc = ''
    return item
  })

  export default {
    name: "questions",
    components: {
      Radio,
      Grade,
      TextArea2
    },
    data () {
      return {
        questions: questions
      }
    },
    computed: {
      btn_disabled () {
        return this.questions.some(item => item.require && item.value === '')
      }
    },
    methods: {
      onInputDesc (item, val) {
        item.desc = val
      },
      onSubmit () {
        if (this.btn_disabled) return

        let data = {}
        this.questions.forEach(item => {

          switch (item.type){
            case 'radio_s':
              if(item.value !== '') data['qid_'+item.id+'_value'] = item.value
              if(item.radios.find(item2=>item2.id===item.value).needInput && item.desc !== '') data['qid_'+item.id+'_desc'] = item.desc
              break;
            case 'grade':
              if(item.value !== '') data['qid_'+item.id+'_value'] = item.value
              break;
            case 'textarea':
              if(item.desc !== '') data['qid_'+item.id+'_desc'] = item.desc
              break;
          }
        })
        console.log(JSON.stringify(data))
      }
    },
    created () {
    }
  }
</script>

<style lang=less scoped>
    .questions {
        .header {
            width: 100%;
            height: 1.4rem;
            background: url('../images/header.png') no-repeat center;
            background-size: 100% auto;
        }

        .list {
            background-color: #fff;
            margin: 0 0.2rem;
            width: 3.35rem;
            border-radius: 2px;
            padding: 0.25rem 0.13rem;
            box-sizing: border-box;
        }

        .btn {
            width: 100%;
            margin: 0 0 10px 0;
            padding: 0 25px;
            outline: none;
            border: none;
            font-size: 20px;
            height: 48px;
            border-radius: 3px;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            background-color: #3385ff;
            color: #fff;

            // 覆盖一层遮罩，平时隐藏
            &::after {
                content: " ";
                opacity: 0;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                position: absolute;
                transition: opacity 200ms ease-in-out;
            }

            // 激活时显示
            &:not(.disabled):active::after {
                background-color: #fff;
                opacity: 0.2;
            }

            // disabled时显示白色
            &.disabled::after {
                background-color: #fff;
                opacity: 0.4;
            }

        }

        .tips {
            margin-top: 0.4rem;
            padding-bottom: 0.1rem;
            color: #999;
            font-size: 13px;

            .title {
                margin-bottom: 0.05rem;
            }
        }

        .footer {
            margin-top: 0.07rem;
            height: 0.38rem;
            background: url('../images/logo.png') no-repeat center;
            background-size: 83px 12px;
        }
    }
</style>
