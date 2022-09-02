<template>
    <div class="container">
        <div class="list">
            <div class="item" v-for="item in accidentImg" :key="item.id">
                <div class="finished" >
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg(item.id)">查看</div>
                        <div class="btn" @click="reGetImage(item.id)">重拍</div>
                    </div>
                </div>
            </div>
            <div class="item" v-show="accidentImg.length<5">
                <div class="df"  @click="getImage()">
                    <div class="icon"></div>
                    <div class="des">{{accidentImg.length}}/5</div>
                </div>
            </div>
        </div>
        <FooterBtn txt="提交" :active="isActvie" @press="postUrl"/>
        <ImgView :url="url" :show="isShow" @closeImgview="closeImgview"/>
    </div>
</template>
<script>
import FooterBtn from '../components/footerBtn'
import ImgView from '../components/imgView'
import { DDBase,DD as dd } from '../../../../../other_modules/like-manageOrder/ddSDK'
import { mapState } from 'vuex'
export default {
    name:'updateResponsibilityImages',
    components:{
        FooterBtn,
        ImgView
    },
    data(){
        return{
            url:'',
            isShow:false
        }
    },
    computed:{
        ...mapState('accountability',[
            'accidentImg'
        ]),
        isActvie(){
            let imgLength = this.$store.state.accountability.accidentImg.length
            if(imgLength > 0){
                return true
            }else{
                return false
            }
        }
    },
    created(){
        dd.init()
        DDBase.setWebTitle('上传定责照片')
    },
    methods:{
        getImage(){
            // let res = ['https://www.likechuxing.com/images/website_main/about_img_1.jpg']
            // let arr = this.accidentImg.slice();
            // let index = this.accidentImg.length+1
            // let arrItem = {
            //     id:'item'+index,
            //     url:res[0]
            // }
            // arr.push(arrItem)
            // this.$store.commit('accountability/setAccidentImg',arr)
            let self = this;
            dd.uploadImage({
                max:1
            }).then(res=>{
                let arr = self.accidentImg.slice();
                let index = self.accidentImg.length+1
                let arrItem = {
                    id:'item'+index,
                    url:res[0]
                }
                arr.push(arrItem)
                self.$store.commit('accountability/setAccidentImg',arr)
            }).catch(err=>{
                console.log(err)
            })
        },
        reGetImage(id){
            // let res = ['https://www.likechuxing.com/images/website_main/about_img_1.jpg']
            // let arr = this.accidentImg.slice();
            // arr.map(item=>{
            //     if(id===item.id){
            //         item.url = res[0]
            //     }
            // })
            // this.$store.commit('accountability/setAccidentImg',arr)
            let self = this;
            dd.uploadImage({max:1}).then(res=>{
                let arr = self.accidentImg.slice();
                arr.map(item=>{
                    if(id===item.id){
                        item.url = res[0]
                    }
                })
                self.$store.commit('accountability/setAccidentImg',arr)
      
                }).catch(err=>{
                    console.log(err)
                })
        },
        previewImg(id){
            this.accidentImg.map(item=>{
                if(id===item.id){
                    this.url = item.url
                }
            })
            this.isShow = true
        },
        closeImgview(){
            this.isShow = false
        },
        postUrl(){
            if(this.isActvie){
                let urlData = this.accidentImg.slice();
                let arr = []
                urlData.map(item=>{
                    arr.push(item.url)
                })
                this.$store.commit('accountability/setAccidentImgUrl',arr)
                this.$router.go(-1)
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #fff;
        padding-bottom: .8rem;
        padding-top: .37rem;
        .header{
            height: .47rem;
            padding: .15rem;
            .fb();
            .desc{
                .fco(.12rem,#333)
            }
        }
        .list{
            padding: 0 .35rem;
            .fb();
            flex-wrap: wrap;
            .item{
                width: 1.25rem;
                height: 1.25rem;
                margin-bottom: .15rem;
                background: #FFFFFF;
                .df{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    border: 1px dashed #DEDEDE;
                    border-radius: 2px;
                    .icon{
                        width:.32rem;
                        height: .26rem;
                        background: url('../images/icon_cremea.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    .des{
                        font-family: PingFangSC-Light;
                        font-size: .14rem;
                        color: #333333;
                        text-align: center;
                        margin-top: .06rem;
                    }
                }
                .finished{
                    width: 100%;
                    height: 100%;
                    background: #FBFBFB;
                    padding-top: 28.5%;
                    border: 1px solid #DEDEDE;
                    border-radius: 2px;
                    .info{
                        .fco(.17rem,#333);
                        text-align: center;
                    }
                    .btn-group{
                        .fb();
                        padding: 13.3% 17.6% 0;
                    }
                    .btn{
                        .fco(.12rem,#44A8EC)
                    }
                }
            }
        }
    }
</style>

