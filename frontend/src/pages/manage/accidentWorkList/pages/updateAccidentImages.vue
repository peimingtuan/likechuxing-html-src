<template>
    <div class="container">
        <div class="header">
            <div class="desc">可选择拍照上传或者相册上传</div>
        </div>
        <div class="list">
            <div class="item" >
                <div class="df item1" v-show="!accidentImg['item1']" @click="getImage('item1')">
                    <div class="des">侧前方</div> 
                </div>
                <div class="finished" v-show="accidentImg['item1']">
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg('item1')">查看</div>
                        <div class="btn" @click="getImage('item1')">重拍</div>
                    </div>
                </div>
            </div>
            <div class="item" >
                <div class="df item2" v-show="!accidentImg['item2']" @click="getImage('item2')">
                    <div class="des">侧后方</div>
                </div>
                <div class="finished" v-show="accidentImg['item2']">
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg('item2')">查看</div>
                        <div class="btn" @click="getImage('item2')">重拍</div>
                    </div>
                </div>
            </div>
            <div class="item" >
                <div class="df item3" v-show="!accidentImg['item3']" @click="getImage('item3')">
                    <div class="des">碰撞部位</div>
                </div>
                <div class="finished" v-show="accidentImg['item3']">
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg('item3')">查看</div>
                        <div class="btn" @click="getImage('item3')">重拍</div>
                    </div>
                </div>
            </div>
            <div class="item" >
                <div class="df item4" v-show="!accidentImg['item4']" @click="getImage('item4')">
                    <div class="des">本方车辆全景</div>
                </div>
                <div class="finished" v-show="accidentImg['item4']">
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg('item4')">查看</div>
                        <div class="btn" @click="getImage('item4')">重拍</div>
                    </div>
                </div>
            </div>
            <div class="item" >
                <div class="df item5" v-show="!accidentImg['item5']" @click="getImage('item5')">
                    <div class="des">对方车辆全景</div>
                </div>
                <div class="finished" v-show="accidentImg['item5']">
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg('item5')">查看</div>
                        <div class="btn" @click="getImage('item5')">重拍</div>
                    </div>
                </div>
            </div>
            <div class="item" >
                <div class="df item6" v-show="!accidentImg['item6']" @click="getImage('item6')">
                    <div class="des">其他现场照片</div>
                </div>
                <div class="finished" v-show="accidentImg['item6']">
                    <div class="info">已上传</div>
                    <div class="btn-group">
                        <div class="btn" @click="previewImg('item6')">查看</div>
                        <div class="btn" @click="getImage('item6')">重拍</div>
                    </div>
                </div>
            </div>
        </div>
        <FooterBtn txt="确认上传" :active="isActvie" @press="postUrl"/>
        <ImgView :url="url" :show="isShow" @closeImgview="closeImgview"/>
    </div>
</template>
<script>
import FooterBtn from '../components/footerBtn'
import ImgView from '../components/imgView'
import { DDBase,DD as dd } from '../../../../../other_modules/like-manageOrder/ddSDK'
import { mapState, mapActions } from 'vuex'
export default {
    name:'imagePreview',
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
            let imgLength = Object.keys(this.$store.state.workDetail.accidentImg)
            if(imgLength.length===4 || imgLength.length > 4){
                return true
            }else{
                return false
            }
        }
    },
    created(){
        dd.init();
        DDBase.setWebTitle('上传事故照片')
    },
    methods:{
        ...mapActions('workDetail',[
            'updateAccidentImg'
        ]),
        getImage(index){
            // let res = ['https://www.likechuxing.com/images/website_main/about_img_1.jpg']
            // let data = Object.assign({},this.accidentImg)
            // data[index] = res[0]
            // this.$store.commit('workDetail/setAccidentImg',data)
            let self = this;
            dd.uploadImage({max:1}).then(res=>{
                let data = Object.assign({},self.accidentImg)
                data[index] = res[0]
                self.$store.commit('workDetail/setAccidentImg',data)
            }).catch(err=>{
                console.log(err)
            })
        },
        previewImg(key){
            this.url = this.accidentImg[key]
            this.isShow = true
        },
        closeImgview(){
            this.isShow = false
        },
        postUrl(){
            if(this.isActvie){
                let urlData = Object.assign({},this.accidentImg)
                let arr = []
                for(let key in urlData){
                    arr.push(urlData[key])
                }
                this.$store.commit('workDetail/setAccidentImgUrl',arr)
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
        background: #f6f6f6;
        padding-bottom: .8rem;
        .header{
            height: .47rem;
            padding: .15rem;
            .fb();
            .desc{
                .fco(.12rem,#333)
            }
        }
        .list{
            padding: 0 .15rem;
            .fb();
            flex-wrap: wrap;
            .item{
                width: 1.65rem;
                height: 1.5rem;
                background: #fff;
                margin-bottom: .15rem;
                .df{
                    width: 100%;
                    height: 100%;
                    padding-top: .12rem;
                    padding-left: .4rem;
                }
                .finished{
                    width: 100%;
                    height: 100%;
                    background: #FBFBFB;
                    border: 1px solid #E2E2E2;
                    padding-top: 28.5%;
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
            .item1{
                background: url('../images/icon_selectPhotoItem1.png') no-repeat;
                background-size: 100% 100%;
            }
            .item2{
                background: url('../images/icon_selectPhotoItem2.png') no-repeat;
                background-size: 100% 100%;
            }
            .item3{
                background: url('../images/icon_selectPhotoItem3.png') no-repeat;
                background-size: 100% 100%;
            }
            .item4{
                background: url('../images/icon_selectPhotoItem4.png') no-repeat;
                background-size: 100% 100%;
            }
            .item5{
                background: url('../images/icon_selectPhotoItem5.png') no-repeat;
                background-size: 100% 100%;
            }
            .item6{
                background: url('../images/icon_selectPhotoItem6.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
</style>

