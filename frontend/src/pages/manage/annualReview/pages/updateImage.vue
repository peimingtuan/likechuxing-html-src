<template>
    <div class="container">
        <div class="list">
            <div class="list-item">
                <div class="item" v-show="accidentImg.item1">
                    <div class="finished" >
                        <div class="info">已上传</div>
                        <div class="btn-group">
                            <div class="btn" @click="previewImg('item1')">查看</div>
                            <div class="btn" @click="reGetImage('item1')">重拍</div>
                        </div>
                    </div>
                    <div class="desc">年检标志</div>
                </div>
                <div class="item" v-show="!accidentImg.item1">
                    <div class="df"  @click="getImage('item1')">
                        <div class="icon"></div>
                    </div>
                    <div class="desc">年检标志</div>
                </div>
            </div>
            <div class="list-item">
                <div class="item" v-show="accidentImg.item2">
                    <div class="finished" >
                        <div class="info">已上传</div>
                        <div class="btn-group">
                            <div class="btn" @click="previewImg('item2')">查看</div>
                            <div class="btn" @click="reGetImage('item2')">重拍</div>
                        </div>
                    </div>
                    <div class="desc">驾驶舱前排照片</div>
                </div>
                <div class="item" v-show="!accidentImg.item2">
                    <div class="df"  @click="getImage('item2')">
                        <div class="icon"></div>
                    </div>
                    <div class="desc">驾驶舱前排照片</div>
                </div>
            </div>
            <div class="list-item">
                <div class="item" v-show="accidentImg.item3">
                    <div class="finished" >
                        <div class="info">已上传</div>
                        <div class="btn-group">
                            <div class="btn" @click="previewImg('item3')">查看</div>
                            <div class="btn" @click="reGetImage('item3')">重拍</div>
                        </div>
                    </div>
                    <div class="desc">驾驶舱后排照片</div>
                </div>
                <div class="item" v-show="!accidentImg.item3">
                    <div class="df"  @click="getImage('item3')">
                        <div class="icon"></div>
                    </div>
                    <div class="desc">驾驶舱后排照片</div>
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
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name:'updateImage',
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
        ...mapState('workDetail',[
            'accidentImg'
        ]),
        isActvie(){
            return this.accidentImg.hasOwnProperty('item1') && this.accidentImg.hasOwnProperty('item2') && this.accidentImg.hasOwnProperty('item3')
        }
    },
    created(){
        this.$DD.init()
    },
    methods:{
        ...mapMutations('workDetail',[
            'setAccidentImg',
            'setAccidentImgUrl'
        ]),
        ...mapActions('workDetail',[
            'updateImg'
        ]),
        getImage(key){
            // let res = ['https://www.likechuxing.com/images/website_main/about_img_1.jpg']
            // let obj = Object.assign({},this.accidentImg)
            // obj[key] = res[0]
            // this.setAccidentImg(obj)
           
            let self = this;
            this.$DD.uploadImageFromCamera({
                max:1
            }).then(res=>{
                let obj = Object.assign({},self.accidentImg)
                obj[key] = res[0]
                self.setAccidentImg(obj)
            }).catch(err=>{
                console.log(err)
            })
        },
        reGetImage(key){
            // let res = ['https://www.likechuxing.com/images/website_main/about_img_1.jpg']

            // let obj = Object.assign({},this.accidentImg)
            // obj[key] = res[0]
            // this.setAccidentImg(obj)
            let self = this;
            this.$DD.uploadImageFromCamera({max:1}).then(res=>{
                let obj = Object.assign({},self.accidentImg)
                obj[key] = res[0]
                self.setAccidentImg(obj)
    
            }).catch(err=>{
                console.log(err)
            })
        },
        previewImg(id){
            this.url = this.accidentImg[id]
            this.isShow = true
        },
        closeImgview(){
            this.isShow = false
        },
        postUrl(){
            if(this.isActvie){
                let arr =  []
                arr[0] = this.accidentImg.item1
                arr[1] = this.accidentImg.item2
                arr[2] = this.accidentImg.item3
                this.setAccidentImgUrl(arr)
                this.updateImg(this)
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
            .list-item{
                margin-bottom: .3rem; 
            }
            .item{
                width: 1.25rem;
                height: 1.25rem;
                margin-bottom: .15rem;
                background: #F4F4F4;
                .df{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    background: #F4F4F4;
                    border-radius: 3px;
                    .icon{
                        width:.32rem;
                        height: .26rem;
                        background: url('../images/icon_cremea.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .desc{
                    font-family: PingFangSC-Light;
                    font-size: .12rem;
                    color: #333333;
                    text-align: center;
                    margin-top: .05rem;
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

