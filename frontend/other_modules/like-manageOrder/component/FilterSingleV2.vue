<template>
    <div class="FilterSingleV2 item-list">
        <div class="filter-item"
             v-for="item in options"
             :key="item.text"
             :class="{active:item.id===selected}"
             @click="handleClick(item)"
        >{{item.text}}
        </div>
    </div>
</template>

<script>
  export default {
    name: "FilterSingleV2",
    props: ['options', 'selected'],
    methods: {
      handleClick (item) {
        if (item.id !== this.selected) this.$emit('change', item.id)
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';

    .FilterSingleV2.item-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .filter-item {
            display: block;
            font-size: 13px;
            color: #333;
            border: solid 1px #dbdbdb;
            width: 32%;
            text-align: center;
            line-height: 0.16rem;
            padding: 0.07rem 0.05rem;
            border-radius: 2px;
            margin: 0.03rem 0 0.03rem 2%;
            box-sizing: border-box;

            &:nth-of-type(3n+1) {
                margin-left: 0;
            }

            &.active {
                color: @major;
                background-color: @majorOpac;
                border-color: @major
            }
        }
    }

</style>