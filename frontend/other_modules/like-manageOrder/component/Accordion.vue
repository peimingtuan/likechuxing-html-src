<template>
    <div class="Accordion">
        <div class="acc-header">
            <div class="title" @click="changeOpen">
                {{title}}
                <div class="arrow float-right" :class="{open:is_open}"></div>
            </div>
        </div>
        <div class="acc-body" v-show="is_open">
            <slot ref="slot"/>
        </div>

    </div>
</template>

<script>
  export default {
    name: "Accordion",
    props: {
      title: {
        required: true
      },
      open:{
        default:false
      }
    },
    data () {
      return {
        is_open: this.open
      }
    },
    methods: {
      changeOpen () {
        this.is_open = !this.is_open
      }
    }
  }
</script>

<style lang=less scoped>
    .Accordion {
        background-color: #fff;

        .title {
            padding: 0.05rem 0;
            font-size: 14px;
            color: #333;

            .arrow {
                width: 0.2rem;
                height: 0.2rem;
                background: url('../images/Accordion/down.png') no-repeat center;
                background-size: 80%;
                transform: rotate(-90deg);
                transition: transform 200ms ease-in-out;
                &.open {
                    transform: rotate(0deg);
                }
            }

        }
    }
</style>