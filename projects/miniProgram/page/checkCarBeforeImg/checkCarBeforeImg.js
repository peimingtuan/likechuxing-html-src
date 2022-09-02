import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        imgList:[],
        rental_id:'',
        parts:[],
        partsImg:[],
        pageIsShow:false
    },
    onLoad(query) {
        this.setData({
            rental_id:query.rental_id||25503,
            parts:[],
            imgList:[
            {
                class:"area1",
                isShow:false
            },
            {
                class:"area7",
                isShow:false 
            },
            {
                class:"area14",
                isShow:false 
            },
            {
                class:"area15",
                isShow:false 
            },
            {
                class:"area16",
                isShow:false 
            },
            {
                class:"area17",
                isShow:false 
            },
            {
                class:"area18",
                isShow:false 
            },
            {
                class:"area19",
                isShow:false 
            },
            {
                class:"area5",
                isShow:false 
            },
            {
                class:"area13",
                isShow:false 
            },
            {
                class:"area12",
                isShow:false 
            },
            {
                class:"area11",
                isShow:false 
            },
            {
                class:"area10",
                isShow:false 
            },
            {
                class:"area9",
                isShow:false 
            },
            {
                class:"area8",
                isShow:false 
            },
            {
                class:"area6",
                isShow:false 
            },
            {
                class:"area2",
                isShow:false 
            },
            {
                class:"area3",
                isShow:false 
            },
            {
                class:"area4",
                isShow:false 
            }
        ]
        })
        this.getParts()
    },
    getParts() {
        let { uuid,sign } = app.globalData;
        let  { rental_id } = this.data;
        let _this = this;
        http.post({
            url:api.apiGetCheckImg(),
            data:{
                uuid:uuid,
                sign:sign,
                rental_id:rental_id 
            }
        }).then((res)=>{
            if(res.status==0) {
                let imgObj = res.data.images||{};
                let partsImg = [];
                let parts = [];
                for(var key in imgObj) {
                    if(imgObj.hasOwnProperty(key)) {
                        partsImg.push(imgObj[key]);
                    }   
                }
                if(res.data.parts) {
                    let partArr = res.data.parts.split('^');
                    parts = partArr.slice(1,partArr.length-1);
                    for(let i = 0;i<parts.length;i++){
                        parts[i]  = parseInt(parts[i])-1
                    }
                }
                let imgList = this.data.imgList.slice();

                for(let i = 0;i<parts.length;i++) {
                    imgList[parts[i]].isShow = true
                }
                _this.setData({
                    parts:parts,
                    partsImg: partsImg,
                    imgList:imgList,
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    preview(e) {
        let { partsImg } = this.data;
        let index = e.target.dataset.index;
        my.previewImage({
          urls: partsImg, // 要预览的图片链接列表
          current:index
        });
    }
})