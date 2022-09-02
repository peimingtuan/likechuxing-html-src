class Like{
    getPlatform(){
        var platform = navigator.userAgent;
        if(/android/i.test(platform)){
            return 'android'
        }else if(/(iPhone|iPad|iPod|iOS)/i.test(platform)){
            return 'ios'
        }else{
            return 'web'
        }
    }
    getDownLoadUrl(){
        if(this.getPlatform()=='ios'){
            return 'https://itunes.apple.com/cn/app/id1245529926?mt=8'
        }else{
            return 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
        }
    }
}
export default new Like()