<template>
    <div class="maintainItem">
        <div class="name">{{data.part_name}}</div>
        <div class="desc">
            <span>距下次保养</span
            ><span v-if="data.to_next_km < 0" class="strong">已超</span
            ><span v-else>剩余</span
            ><span> {{Math.abs(data.to_next_km)}} 公里，</span
            ><span v-if="data.to_next_day < 0" class="strong">已超</span
            ><span v-else>剩余</span
            ><span> {{Math.abs(data.to_next_day)}} 天</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "maintainItem",
    props: ['data'],
    created () {

    }
  }
</script>

<style lang=less scoped>
    .maintainItem {
        font-size: 12px;
        padding: 0.05rem 0;
        display: flex;

        .name {
            width: 1.2rem;
            color: #333;
        }

        .desc {
            padding-left: 0.1rem;
            color:#666;
            .strong {
                color: #ff6868;
            }
        }
    }
</style>