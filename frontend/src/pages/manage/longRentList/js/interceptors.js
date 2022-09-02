import axios from 'axios';
let pending = [];
let cancelToken = axios.CancelToken
function removePending(item){
    let arr =  pending;
    for (let i = 0; i < arr.length; i++) {
        if(arr[i]['pid'] === item['url'] + item['method'] ){
            arr[i].cancel()
            arr.splice(i,1)
        }
        
    }
}
axios.interceptors.request.use(postInfo=>{
    removePending(postInfo);
    postInfo.cancelToken = new cancelToken(cancel=>{
        pending.push({pid:postInfo.url+postInfo.method,cancel:cancel})
    })
    return postInfo
},err=>{
    return Promise.reject(err)
})
axios.interceptors.response.use(res=>{
    removePending(res.config)
    return res
},err=>{
    return Promise.reject(err)
})

export default axios