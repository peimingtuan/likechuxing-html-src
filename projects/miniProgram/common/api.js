export default class api{
    //定义环境
    static environment= 0;

    //配置地址
    static _host='https://api.likechuxing.com/';
    static _devHost='https://apitest.likechuxing.com/';

    //切换环境
    static _hostUrl(){
        switch(this.environment){
            case 0:
            return this._devHost
            case 1:
            return this._host
            default:
            return this._host
        }
    }

    //发送支付宝auth_code
    static apiPostAuthCode() {
        return this._hostUrl()+'alipay-login/auth';
    }

    //获取芝麻信用是否够700
    static apiGetZhiMa() {
        return this._hostUrl()+'deposit/zm-auth';
    }

    //获取时间戳
    static apiGetTimeStamp() {
        return this._hostUrl()+'time/get';
    }

    //获取城市id
    static apiGetCityId() {
        return this._hostUrl()+'describe/get-cityid';
    }

    //登录获取验证码
    static apiLoginGetCode() {
        return this._hostUrl()+'login/get-code';
    }

    //支付宝绑定手机获取验证码
    static apiAliLoginGetCode() {
        return this._hostUrl()+'alipay-login/get-code';
    }

    //登录
    static apiLogin() {
        return this._hostUrl()+'login/verify-code';
    }

    //支付宝账号绑定手机号登录
    static apiAliLogin() {
        return this._hostUrl()+'alipay-login/verify-code';
    }

    //保证金查询
    static apiQueryBail() {
        return this._hostUrl()+'deposit/query';
    }

    //保证金历史
    static apiBailHistory() {
        return this._hostUrl()+'deposit/history';
    }
    
    //支付宝测试字符串
    static apiGetAlipayStr() {
        return this._hostUrl()+'pay/index';
    }

    //上传认证照片
    static apiUploadLicenseImage() {
        return this._hostUrl()+'license/submit';
    }

    
    //个人中心获取用户信息
    static apiGetProfile() {
        return this._hostUrl()+'user/personal-center';
    }

    //获取用户信息，驾照审核失败原因
    static apiGetUserInfo() {
        return this._hostUrl()+'user/information';
    }

    //获取邀请好友分享码
    static apiGetShareCode() {
        return this._hostUrl()+'user/share-code';
    }

    //登出接口
    static apiLogout() {
        return this._hostUrl()+'login/out';
    }

    //优惠券列表
    static apiGetCouponList() {
        return this._hostUrl()+'coupon/list';
    }

    //行程当中使用优惠券列表
    static apiRentalCouponList() {
        return this._hostUrl()+'rental/coupon-list';
    }

    //兑换优惠券
    static  apiConvertCoupon() {
        return this._hostUrl()+'coupon/convert';
    }

    //获取附近网点
    static  apiBranchList() {
        return this._hostUrl()+'branch/list';
    }

    //获取网点车辆
    static  apiCarList() {
        return this._hostUrl()+'car/list';
    }

    //下单
    static  apiOrder() {
        return this._hostUrl()+'rental/create';
    }

    //鸣笛找车
    static  apiFindCar() {
        return this._hostUrl()+'rental/find-car';
    }

    //取消原因列表
    static  apiGetCancelList() {
        return this._hostUrl()+'rental/remain-cancle-time';
    }

    //取消订单
    static  apiCancelOrder() {
        return this._hostUrl()+'rental/cancel';
    }

    //更改还车地点
    static  apiUpdateReturnAddr() {
        return this._hostUrl()+'branch/modify-end-branch';
    }
    
    //用车前后上传照片
    static  apiUploadCarImg() {
        return this._hostUrl()+'upload/car-before-photo';
    }

    //用车前后上传车伤部位
    static  apiUploadCarBeforeParts() {
        return this._hostUrl()+'upload/car-before-parts';
    }

    //获取行程信息
    static  apiGetCurrentOrder() {
        return this._hostUrl()+'rental/current-info';
    }

    //打开车门
    static  apiOpenDoor() {
        return this._hostUrl()+'rental/open-door';
    }
    
    //关门
    static  apiCloseDoor() {
        return this._hostUrl()+'rental/close-door';
    }

    //还车网点检查
    static  apiGetFinishCheckBranch() {
        return this._hostUrl()+'rental/finish-check-branch';
    }

    //还车检查修改还车网点
    static apiGetNearbyBranch() {
        return this._hostUrl()+'branch/get-nearby-branch';
    }

    //还车
    static  apiFinish() {
        return this._hostUrl()+'rental/finish-order';
    }
    
    //查看验车单
    static  apiGetCheckImg() {
        return this._hostUrl()+'rental-history/car-before-photo-detail';
    }

    //订单费用
    static  apiTotal() {
        return this._hostUrl()+'user/rental-detail';
    }

    //确认订单
    static apiConfirmOrder() {
        return this._hostUrl()+'rental/confirm-order';
    }

    //支付费用
    static apiPayOrder() {
        return this._hostUrl()+'rental/pay-amount';
    }

    //结束行程费用详情
    static apiTripDetail() {
        return this._hostUrl()+'rental-history/fee-detail';
    }

    //行车轨迹
    static apiCarLine() {
        return this._hostUrl()+'rental-history/detail';
    }
    
    //立刻收银台
    static apiPayAmount() {
        return this._hostUrl()+'rental/pay-amount';
    }
    
    //评价
    static apiComment() {
        return this._hostUrl()+'rental-history/comment';
    }

    //是否有有资格领券
    static apiisCanReceive() {
        return this._hostUrl()+'alipay-coupon/info';
    }

    //领券
    static apiReceiveCoupon() {
        return this._hostUrl()+'alipay-coupon/take-coupon';
    }

    //webview
    static apiWebviewUrl() {
        return 'https://h5test.likechuxing.com/appMini/getCoupon/index.php?id=';
    }

    //充值额度列表
    static apiGetChargeDesc() {
        return this._hostUrl()+'charge/desc';
    }

    //行程列表
    static apiGetRentalList() {
        return this._hostUrl()+'user/rental-list';
    }
}
