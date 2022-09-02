<template>
    <div class="CommentLog" @touchmove="preventEvent">
        <div class="box">
            <label><span class="comment_plate">{{car.plate}}</span> 记录内容：
                <textarea class="log" autofocus rows="5" v-model.trim="text" maxlength="99"></textarea>
                <div id="text_length">{{text.length}}/99</div>
            </label>
            <div class="btn_con">
                <button class="comment_cancel" @click.stop="destroy">取消</button>
                <button class="comment_submit" @click.stop="submit">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
  import {getManageUrl} from "../../../../../other_modules/url-constructor/index";
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";

  export default {
    name: "comment-log",
    props:['car'],
    data(){
      return {
        uuid: window.localStorage.getItem('uuid'),
        sign: window.localStorage.getItem('sign'),
        city_id: window.localStorage.getItem('city_id') || '',
        text:''
      }
    },
    methods:{
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      destroy(){
        this.$emit('destroyBox')
      },
      submit(){
        if (this.text === '') {
         this.$_LIKE_toast('输入不能为空')
          return
        }

        let loading = this.$_LIKE_loading('提交中...')
        myAjax.post(getManageUrl('/evaluate/add'), {
          uuid: this.uuid,
          sign: this.sign,
          city_id: this.city_id,
          car_id:this.car.car_id,
          comment:this.text
        }).then(res => {
          loading.close()
          if (res.status !== 0) {
            throw res
          } else {
            this.destroy()
          }
        }).catch(err=>{
          loading.close()
          this.$emit('likeError',err)
        })
      }
    }
  }
</script>

<style lang=less scoped>
    .CommentLog{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.4);
        top:0;
        .log {
            width: 100%;
            border: solid 1px #dfdfdf;
            outline: none;
        }
    }
    .comment {
        margin-left: 5em;
        margin-top: -1.8em;
        color: #666;
    }

    .op_btn {
        width: 28%;
        margin: 0 2%;
        padding: 5px 0;
        border-radius: 3px;
        background-color: #15bdf4;
        border: none;
        color: #fff
    }

    .box {
        width: 76%;
        margin: 20% auto;
        background-color: #fff;
        padding: 20px;
    }

    .btn_con {
        padding: 5px 0;
        width: 100%;
    }

    .btn_con button {
        width: 45%;
        padding: 5px 0;
        margin: 0 2%;
        border-radius: 2px
    }

    .comment_cancel {
        border: solid 1px #dfdfdf;
        background-color: #fff
    }

    .comment_submit {
        border: none;
        background-color: #15bdf4;
        color: #FFF
    }


    #text_length {
        text-align: right;
        margin: 0 auto
    }

    .dispose {
        width: 6rem;
        height: 1.6rem;
        font-size: 0.85rem;
        line-height: 1.6rem;
        border-radius: 6px;
        border: 0.032rem solid #828282;
        text-align: center;
        background-color: #F5F5F5;
        margin-left: 6rem;
    }
</style>