<template>
    <div class="CarPartsSelect" ref="container">

        <!--显示点击区域，debug时开启-->
        <div v-if="debug">
            <div class="hot-group" v-for="part in parts" :key="part.id" >
                <div class="hot-area"
                     v-for="(area,index) in part.hotArea"
                     :key="index"
                     :style="'top:'+area[0]+'px;left:'+area[1]+'px;width:'+area[2]+'px;height:'+area[3]+'px;background-color:'+part.color"
                ></div>
            </div>
        </div>

        <img alt="part" class="part-img" v-for="part in chosen" :key="part.id" :src="part.img"/>

        <div class="event-layer" @click="bgClick"></div>
    </div>
</template>

<script>
    const randomColor = function (){
      let color="#";
      for(let i=0;i<6;i++){color += (Math.random()*16 | 0).toString(16);}
      return color;
    }

    export default {
    name: "CarPartsSelect",
    data(){
      return {
        debug:false,

        width:0,
        height:0,

        parts:[
          {id:1,name:'前保险杠',hotArea:[[0,0.38,0.23,0.2]],img:require('../images/carPartsSelect/part1.png')},
          {id:2,name:'右后视镜',hotArea:[[0.05,0.63,0.15,0.05],[0.4,0.58,0.05,0.05]],img:require('../images/carPartsSelect/part2.png')},
          {id:3,name:'右前叶子板',hotArea:[[0.16,0.77,0.18,0.05],[0.24,0.7,0.06,0.15]],img:require('../images/carPartsSelect/part3.png')},
          {id:4,name:'右前轮',hotArea:[[0.28,0.76,0.2,0.08]],img:require('../images/carPartsSelect/part4.png')},
          {id:5,name:'右前门',hotArea:[[0.39,0.7,0.25,0.1]],img:require('../images/carPartsSelect/part5.png')},
          {id:6,name:'右后门',hotArea:[[0.49,0.7,0.25,0.1]],img:require('../images/carPartsSelect/part6.png')},
          {id:7,name:'右后轮',hotArea:[[0.59,0.75,0.2,0.08]],img:require('../images/carPartsSelect/part7.png')},
          {id:8,name:'右后叶子板',hotArea:[[0.75,0.77,0.18,0.05],[0.6,0.7,0.06,0.15]],img:require('../images/carPartsSelect/part8.png')},
          {id:9,name:'后保险杠',hotArea:[[0.79,0.38,0.23,0.2]],img:require('../images/carPartsSelect/part9.png')},
          {id:10,name:'左后叶子板',hotArea:[[0.75,0.03,0.18,0.05],[0.6,0.23,0.06,0.15]],img:require('../images/carPartsSelect/part10.png')},
          {id:11,name:'左后轮',hotArea:[[0.59,0.03,0.22,0.08]],img:require('../images/carPartsSelect/part11.png')},
          {id:12,name:'左后门',hotArea:[[0.49,0.03,0.25,0.1]],img:require('../images/carPartsSelect/part12.png')},
          {id:13,name:'左前门',hotArea:[[0.39,0.03,0.25,0.1]],img:require('../images/carPartsSelect/part13.png')},
          {id:14,name:'左前轮',hotArea:[[0.28,0.03,0.2,0.08]],img:require('../images/carPartsSelect/part14.png')},
          {id:15,name:'左前叶子板',hotArea:[[0.16,0.03,0.19,0.05],[0.24,0.23,0.06,0.15]],img:require('../images/carPartsSelect/part15.png')},
          {id:16,name:'左后视镜',hotArea:[[0.05,0.2,0.15,0.05],[0.4,0.36,0.05,0.05]],img:require('../images/carPartsSelect/part16.png')},
          {id:17,name:'前机器盖',hotArea:[[0.24,0.4,0.19,0.13]],img:require('../images/carPartsSelect/part17.png')},
          {id:18,name:'车顶',hotArea:[[0.45,0.42,0.14,0.17]],img:require('../images/carPartsSelect/part18.png')},
          {id:19,name:'后备箱盖',hotArea:[[0.69,0.4,0.19,0.05]],img:require('../images/carPartsSelect/part19.png')},
        ],
        chosen:[]
      }
    },
    methods:{
      bgClick(e){
        let point = {
          x:e.layerX,
          y:e.layerY
        }

        let part = this.parts.find(part=>{
          return part.hotArea.some(area=>{
            return point.x >= area[1] && point.x<= (area[1]+area[2]) && point.y>=area[0] && point.y <= (area[0]+area[3])
          })
        })

        if(part)this.choosePart(part)
      },
      choosePart(part){
        let index = this.chosen.findIndex(item=>item.id===part.id)
        if(index>-1){
          this.chosen.splice(index,1)

          this.$emit('sub',{
            current_part_id:part.id,
            ids:this.chosen.map(part=>part.id)
          })
        }else{
          this.chosen.push(part)

          this.$emit('add',{
            current_part_id:part.id,
            ids:this.chosen.map(part=>part.id)
          })
        }

        this.$emit('change',{
          current_part_id:part.id,
          ids:this.chosen.map(part=>part.id)
        })
      }
    },
    mounted(){
      this.width = this.$refs.container.offsetWidth
      this.height = this.width*1.1293333
      this.$refs.container.style.height = this.height+'px'

      this.parts.forEach(part=>{
        if(this.debug)part.color = randomColor()
        part.hotArea.forEach(area=>{
          area[0] = this.height*area[0]
          area[1] = this.width*area[1]
          area[2] = this.width*area[2]
          area[3] = this.height*area[3]
        })
      })
    }
  }
</script>

<style lang=less scoped>
.CarPartsSelect{
    width: 100%;
    background: url('../images/carPartsSelect/bg.png') no-repeat center;
    background-size: 100%;
    position: relative;

    .part-img{
        position: absolute;
        top:0;
        left:0;
        display: block;
        width: 100%;
        height: 100%;
    }

    .event-layer{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
    }

    .hot-group{
        .hot-area{
            position: absolute;
            opacity: 0.4;
        }
    }
}
</style>