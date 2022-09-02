<template>
    <div class="DetailItems">
        <div class="item clearfix" v-for="item in list" :key="item.name">
            <p class="name float-left" :class="[item.name_class || '']">{{item.name}}</p>
            <p class="value float-right" :class="[item.value_class || '']">{{item.value || '-'}}</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: "DetailItems",
    props:['list']
  }
</script>

<style lang=less>
.DetailItems{
    margin:0.05rem 0;
    .item{
        line-height: 0.2rem;
        margin:0.03rem 0;
        font-size: 13px;
        .value{
            color:#111;
        }
    }
}
</style>