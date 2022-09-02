<template>
    <div class="Detail">
        <p class="block">
            <span>由于广州对非广州籍中小客车实行“开四停四”管理措施，部分车辆受此影响，无法驶入限行区，所有无法驶入限行区的车辆均标有</span>
            <img class="min-icon" :src="require('./images/禁入限行区.png')" />
            <span>标识。</span>
        </p>
        <p class="block">
            <span>所有标示</span>
            <img class="min-icon" :src="require('./images/可入限行区.png')" />
            <span>的车辆，可以正常驶入限行区，请放心使用。</span>
        </p>
    </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {

      }
    },
    components: {
    },
    methods: {

    }
  }
</script>

<style lang=less>
    html,body{
        background-color: #fff!important;
        min-height: 100vh;
    }
.Detail{
    padding:0.2rem;
    .block{
        margin-bottom:0.2rem;
        line-height: 0.2rem;
        &>*{
            vertical-align: middle;
        }

    }
    .min-icon{
        height: 0.2rem;
    }
}
</style>