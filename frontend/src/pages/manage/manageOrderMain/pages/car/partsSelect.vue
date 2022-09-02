<template>
    <div class="PartsSelect">
        <div class="parent">
            <CarPartsSelect @change="onChange"/>
        </div>

        <div class="select">
            <label>
                <input class="checkbox" type="checkbox" :checked="ids.length === 0" disabled/>
                外观无伤
            </label>
        </div>

        <div class="btn-con">
            <LikeButton
                    :text="btn_text"
                    type="primary"
                    @click="nextStep"
                    class="btn"
            />
        </div>

    </div>
</template>

<script>
  import CarPartsSelect from '../../../../../../other_modules/like-manageOrder/component/CarPartsSelect'
  import LikeButton from '../../../../../../other_modules/like-manageOrder/component/Button'
  export default {
    name: "carParts",
    components:{
      CarPartsSelect,
      LikeButton
    },
    data(){
      return {
        ids:[]
      }
    },
    computed:{
      btn_text(){
        return this.ids.length === 0 ? '下一步':'外观有伤，上传照片'
      }
    },
    methods:{
      onChange(part){
        this.ids = part.ids
      },
      nextStep(){
        this.$router.push({
          path:'/car/takePhotos',
          query:Object.assign({},this.$route.query,{parts:this.ids.join(',')})
        })
      }
    }
  }
</script>

<style lang=less scoped>
    .PartsSelect{
        .parent{
            padding: 0.1rem 0;
        }

        .select{
            text-align: center;
            padding: 0.1rem 0 70px;
            .checkbox{
                width: 0.2rem;
                height: 0.2rem;
                vertical-align: top;
            }
        }

        .btn-con{
            position: fixed;
            bottom:0;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 -2px 1px #eaeaea;
            .btn{
                width: 100%;
                margin:0
            }
        }
    }
</style>