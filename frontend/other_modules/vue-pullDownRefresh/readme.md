使用说明：

```vue
<template>
    <div class="main">
    
        <!--不需要额外容器，最外层div是position: relative的div，高度由opt传递进去-->
        <PullDownRefresh 
			:opt="opt" // 传递初始化参数，至少传个height
          @pullDown="pullDown" // 下拉事件被触发
          @pullUp="pullUp" // 上拉事件被触发
          ref="pullUpDown" 
        >
        
            <!--内容部分，由slot传递-->
            <p style="border-top: solid 1px #f2f2f2" v-for="item,index in list" :key="index">{{item}}</p>
            
        </PullDownRefresh>
       
    </div>
</template>

<script>

  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'


  export default {
    components: {
      PullDownRefresh
    },
    data () {
      return {
        opt: {
          height: 300,// 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: false // 是否启用上拉
        }
      }
    },
    methods: {
      pullDown () {
        // 模拟请求数据延时
        setTimeout(function () {
        
          // 此处更新内容部分
          
          // 更新完成后告知组件去刷新scroll控件
          this.$refs.pullUpDown.update()
          
        }.bind(this), 1500)

      },
      pullUp () {

        setTimeout(function () {
          if (有更多数据) {
            // 此处更新内容部分
            
            // 刷新scroll控件
            this.$refs.pullUpDown.update()
            
          } else {// 没有更多数据了
       
       		// 刷新控件的时候告知组件，没有更多数据
            this.$refs.pullUpDown.update({
              noMore: true
            })
          }
        }.bind(this), 1500)

      },
     },
}
</script>
```