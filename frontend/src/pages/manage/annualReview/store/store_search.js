import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'

const module = {
    namespaced: true,
    state:{
        type:'',
        word:'',
        listData:[],
        tipListData:[],
        myList:[],
        isSearched:false
    },
    mutations:{
        setType(state,data){
            state.type = data
        },
        setWord(state,data){
            state.word = data
        },
        setList(state,data){
            state.listData = data
        },
        setTipList(state,data){
            state.tipListData = data
        },
        setMyList(state,data){
            state.myList = data
        },
        setIsShow(state,data){
            state.isSearched = data
        },
        emptyData(state){
            state.type = ''
            state.word = ''
            state.listData = []
            state.tipListData = []
            state.myList = []
            state.isSearched = false
        }
    },
    actions:{
        search({ state, commit, dispatch }){
            let { word, type } = state
            if(word==''){
                commit('setTipList',[])
                commit('setList',[])
                commit('setMyList',[])
                return
            }
            if(type==1){
                dispatch('searchTip')
                commit('setIsShow',true)
            }else if(type==2){
                dispatch('searchList')
                commit('setIsShow',true)
            }else{
                dispatch('searchMyList')
                commit('setIsShow',true)
            }
        },
        searchTip({state,rootState,commit}){
            let { mobile } = rootState
            let { word } = state
            http.post(api('/vehicle-examine/list'), {
                mobile,
                search_name:word	
            }).then(res=>{
                if(res.status == 0){
                    commit('setTipList',res.data)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        searchList({state,rootState,commit}){
            let { mobile } = rootState
            let { word } = state
            http.post(api('/vehicle-examine/user-list'), {
                mobile,
                search_name:word	
            }).then(res=>{
                if(res.status == 0){
                    commit('setList',res.data)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        searchMyList({state,rootState,commit}){
            let { mobile } = rootState
            let { word } = state
            http.post(api('/vehicle-examine/my-list'), {
                mobile,
                search_name:word	
            }).then(res=>{
                if(res.status == 0){
                    commit('setMyList',res.data)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
    }
}
export default module;