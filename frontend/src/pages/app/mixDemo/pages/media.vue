<template>
    <div class="media">
        <div>
            <input ref="input" type="file" accept="image/*" @change="changeFile"/>
        </div>
        <div class="img-con">
            <img :src=src class="img"/>
        </div>
    </div>
</template>

<script>

  export default {
    data() {
      return {
        src: ''
      }
    },
    methods: {
      changeFile() {
        let file = this.$refs.input.files[0]

        if (file) {
          let that = this
          let reader = new FileReader()
          reader.onload = function (e) {
            let imgFile = e.target.result
            if (imgFile) {
              // base64
              that.src = imgFile
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }
</script>

<style lang="less">
    .media {
        .img-con{
            border: solid 1px #dfdfdf;
            box-sizing: border-box;
            .img {
                width: 100%;
                height: auto;
                min-height: 3rem;
            }
        }

    }
</style>