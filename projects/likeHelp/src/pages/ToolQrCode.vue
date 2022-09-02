<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="编码" name="encode">
      <div class="Encode">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入编码内容"
              v-model="text">
            </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4" :offset="10" class="text-center"><el-button @click="createCode" class="btn" type="primary">生成二维码</el-button></el-col>
        </el-row>

        <div class="box">
          <el-row>
            <el-col :span="24">
              <div class="code text-center">
                <canvas ref="canvas" :width="size" :height="size"></canvas>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="解码" name="decode">
      <div class="Decode">
        <div class="dropArea" ref="dropArea"
             @dragenter="dragenter"
             @dragleave="dragleave"
             @drop="drop"
             @click="chooseFile"
        >{{dropText}}
          <input ref="input" :accept="dropAcceptStr" @change="getFile" type="file" class="input"/>
        </div>

        <div class="box">
          <el-row>
            <el-col :span="12">
              <div class="code text-center">
                <img class="img" :src="file_data"/>
              </div>
            </el-col>
            <el-col :span="8" :offset="2" v-if="result">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                v-model="result">
              </el-input>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import QRCode from 'qrcode'
  import QrReader from 'qrcode-reader'

  const DETAULT_TEXT = '点击或拖拽至此区域上传二维码图片(png/jpg)'

  document.ondragover = function (e) {
    e.preventDefault();  //只有在ondragover中阻止默认行为才能触发 ondrop 而不是 ondragleave
  };
  document.ondrop = function (e) {
    e.preventDefault();  //阻止 document.ondrop的默认行为  *** 在新窗口中打开拖进的图片
  };

  export default {
    name: "tool-qr-code",
    qr:null,
    data() {
      return {
        activeTab: 'encode',
        text:'',
        size:400,

        dropAcceptType:[
          'image/png','image/jpg','image/jpeg'
        ],
        dropText:DETAULT_TEXT,
        file_data:'',
        result:'',
        qr:null
      };
    },
    computed:{
      dropAcceptStr(){
        return this.dropAcceptType.join('')
      }
    },
    methods:{
      createCode(){
        let that = this
        let ctx = this.$refs.canvas.getContext('2d')

        const LOGO = new Image()
        LOGO.onload = function(){
          QRCode.toDataURL(
            that.text,
            {
              type:'image/jpeg',
              errorCorrectionLevel: 'H',
              version: 'auto',
              margin:4,
              width:that.size
            },
            function (err,url) {
              let image = new Image()
              image.onload = function(){
                ctx.drawImage(image,0,0,that.size,that.size)
                ctx.drawImage(LOGO,that.size*0.4,that.size*0.4,that.size*0.2,that.size*0.2)
              }
              image.src=url
            }
          )
        }
        LOGO.src = require('../assets/images/logo_180.png')

      },
      chooseFile(){
        this.$refs.input.click()
      },
      getFile(e){
        let that = this
        let file = e.target.files[0]

        if(file){
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            that.file_data = this.result
            that.qr.decode(this.result)
          }
        }

      },
      decodeCallback(err,result){
        if(err){
          this.result = ''
          console.warn('解码失败:'+err)
          this.$message.error('解码失败，可以放大图片中二维码部分或提高清晰度重试')
        }else{
          this.result = result.result
        }
      },
      dragenter(){
        this.dropText = '松开鼠标上传文件'
      },
      dragleave(){
        this.dropText=DETAULT_TEXT
      },
      drop(e){
        this.dropText=DETAULT_TEXT

        let file = e.dataTransfer.files[0]
        if(!file)
          return

        if(e.dataTransfer.files.length>1){
          this.$message.warning('拖拽多个文件时只会解码第一个文件:'+file.name)
        }

        if(!this.dropAcceptType.includes(file.type)){
          this.$message.error('文件格式不正确')
          return
        }

        let that = this
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          that.file_data = this.result
          that.qr.decode(this.result)
        }
      }

    },
    created(){
      this.qr = new QrReader()
      this.qr.callback=this.decodeCallback
    }
  }
</script>

<style lang=less>
  .Encode,.Decode{
    margin:10px;
  }

  .Encode{
    .el-row{
      margin:10px 0;
    }
  }

  .Decode{
    .dropArea{
      width: 100%;
      text-align: center;
      line-height: 200px;
      margin:20px 0;
      background-color: #eefaff;
      color:#999;
      cursor: pointer;
      .input{
        display:none
      }
    }
    .box{
      .img{
        width: 300px;
      }
    }
  }

</style>
