import api from '../../common/api';
import http from '../../common/http';
import BMap from '../../common/bmap';
import utils from '../../common/utils';
import filterBranch from '../../common/filterBranch';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        pickInfo:{},
        resList:[],
        historyList:[],
    },
    onLoad(query) {
        
        this.setData({
            pickInfo:JSON.parse(query.pageParam)
        })
        this._getReturnCarHistory()
    },
    _getReturnCarHistory() {
        let { uuid } = app.globalData;
        
        my.getStorage({
          key: 'searchHistory'+uuid, // 缓存数据的key
          success: (res) => {
            this.setData({
                historyList:res.data||[]
            })
          },
        });
    },
    _searchBranch(e) {
        let iBMap = new BMap();
        let word = utils.trimStr(e.detail.value);
        let _this  = this;
        iBMap.search({
            query:word,
            success:(res)=>{
                console.log(res)
                if(res.wxMarkerData) {
                    _this.setData({
                        resList:res.wxMarkerData
                    })
                }
            },
            fail:(err)=>{
                console.log(JSON.stringify(err))
            }
        })
    },
    _setHistory(data) {
        console.log(data)
        let { uuid } = app.globalData;
        let list = this.data.historyList;
        let dataStr = JSON.stringify(data);
        let list2 = list.slice();
        for(let i=0;i<list2.length;i++){
            list2[i] = JSON.stringify(list2[i]);
        }
        if(list2.indexOf(dataStr)==-1) {
            my.getStorage({
            key: 'searchHistory'+uuid, // 缓存数据的key,
            success:(res)=>{
                    let arr =res.data||[]
                    arr.push(data)
                    my.setStorage({
                        key: 'searchHistory'+uuid, // 缓存数据的key
                        data: arr
                    });
            }
            }); 
        }  
    },
    _select(e) {
        let index = e.target.dataset.key;
        let data = this.data.resList;

        this._setHistory(data[index]);

        let pages = getCurrentPages();
        let prevPage = pages[pages.length-2];
        prevPage.setData({
            longitude:data[index].longitude,
            latitude:data[index].latitude,
            markers:filterBranch.filterDegreeArr(data[index],prevPage.data.list)
        })   
        setTimeout(()=>{
            my.navigateBack();
        },300)
    },
    selectHistory(e) {
        let index = e.target.dataset.key;
        let data = this.data.historyList;

        let pages = getCurrentPages();
        let prevPage = pages[pages.length-2];
        prevPage.setData({
            longitude:data[index].longitude,
            latitude:data[index].latitude,
            markers:filterBranch.filterDegreeArr(data[index],prevPage.data.list)
        })
        my.navigateBack();
        
    },
    _removeSearchHistory() {
        let { uuid } = app.globalData;
        my.confirm({
            content:'确认删除',
            success: (res) => {
                console.log(res)
                if(res.confirm) {
                    my.removeStorage({
                      key: 'searchHistory'+uuid, // 缓存数据的key
                      success:()=>{
                          this._getReturnCarHistory()
                      }
                    });
                }
            },
        });
    },
    samePickAddr() {
        let { uuid ,sign } = app.globalData;
        let { pickInfo } = this.data;
        let pages = getCurrentPages();
        let indexPage = pages[pages.length-3]
        if(indexPage.data.pickAddress) {//是否是首页跳转过来
            indexPage.setData({
                returnAddress:indexPage.data.pickAddress,
                returnAddressId:indexPage.data.pickAddressId
            })
            my.navigateBack({
                delta:2
            });
        }else{
            http.post({
                url:api.apiUpdateReturnAddr(),
                data:{
                    uuid,
                    sign,
                    end_branch_id:pickInfo.id
                }
            }).then((res)=>{
                if(res.status==0){
                    indexPage._getInfo().then(()=>{
                        my.navigateBack({
                            delta:2
                        })
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    }  
})