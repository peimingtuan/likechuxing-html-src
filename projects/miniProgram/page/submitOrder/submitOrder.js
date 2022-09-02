import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        couponInfo:{},
        info:{},
        disabled:false,
        totalNum:0,
        fee_acutal:0,//用户实付
        money:0,//是否使用变动的余额
        overage:0,//余额
        isShow:false,//是否显示明细
        coupon:{},//优惠券信息
        couponVal:'',//使用优惠券的额度
        couponKey:'',//优惠券对应的index
        hongbao:{},//红包信息
        hongbaoVal:'',//使用红包的额度
        hongbaoKey:'',//红包对应的index
        payNum:0,//实付金额,
        useOverage:0,//使用了多少余额
        isUsed:true,//是否使用余额
        rental_no:'',
        leftNum:'',
        leftNumSource:'',
        pageIsShow:false,
        price_insurance:0,
        rental_actual_fee:0,
        fee_total_insurance:0, // 不计免赔费用
    },
    onLoad(query) {
        this.setData({
            rental_no:query.rental_no
        })
        this.getTotal();
        this.getFee()
    },
    onShow(){
      console.log(Number(this.data.fee_acutal), Number(this.data.fee_acutal), Number(this.data.fee_acutal))
      if (Number(this.data.fee_acutal) <= Number(this.data.couponVal) && Number(this.data.hongbaoVal)){
        console.log(Number(this.data.fee_acutal), Number(this.data.fee_acutal), Number(this.data.fee_acutal))
        this.setData({
          hongbao: {},
          hongbaoVal: '',
          hongbaoKey: '',
        })
        my.showToast({
          type: 'none',
          content: '所选优惠已超应付金额',
          duration: 3000
        });
      }
    },
    openDetail() {
        this.setData({
            isShow:!this.data.isShow
        })
    },
    getTotal() {
        let { uuid,sign } = app.globalData;
        let _this = this;

        http.post({
            url:api.apiTotal(),
            data:{
                uuid,
                sign,
                rental_no:_this.data.rental_no
            }
        }).then((res)=>{
            if(res.status==0) {

                if(res.data.voucher.left_coupon_sum_cnt==-1){
                    _this.setData({
                      leftNum: parseInt(res.data.voucher.left_coupon_cash_cnt) + parseInt(res.data.voucher.left_coupon_cnt) - _this.checkCouponNum(),
                      leftNumSource: parseInt(res.data.voucher.left_coupon_cash_cnt) + parseInt(res.data.voucher.left_coupon_cnt) - _this.checkCouponNum()
                    })
                }else{
                    _this.setData({
                      leftNum: res.data.voucher.left_coupon_sum_cnt - _this.checkCouponNum(),
                      leftNumSource: res.data.voucher.left_coupon_sum_cnt - _this.checkCouponNum()
                    })
                }
                _this.setData({
                    couponInfo:res.data,
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })

    },
    getFee(callback) {
        let { uuid,sign } = app.globalData;
        let { coupon,hongbao,isUsed }  = this.data;
        let _this = this;
        let postData = {}
        if(coupon.hasOwnProperty('id')){
            postData.coupon_id = coupon.id
        }
        if(hongbao.hasOwnProperty('id')){
            postData.coupon_cash_id = hongbao.id;
        }
        if(isUsed){
            postData.use_balance = 1
        }else{
            postData.use_balance = 0
        }
        

        http.post({
            url:api.apiFee(),
            data:{
                uuid,
                sign,
                rental_no:_this.data.rental_no,
                ...postData
            }
        }).then((res)=>{
            if(res.status==0) {

                _this.setData({
                    info:res.data,
                    money:utils.switchNum(res.data.money),
                    overage:utils.switchNum(res.data.money),
                    totalNum:utils.switchNum(res.data.fee_total_sum),
                    fee_acutal: parseFloat(res.data.fee_acutal).toFixed(2),
                    price_insurance: Number(res.data.price_insurance) > 0 ? res.data.price_insurance : Number(res.data.price_insurance),
                    rental_actual_fee:utils.switchNum(res.data.rental_actual_fee),
                    fee_total_insurance: parseFloat(res.data.fee_total_insurance)
                })
                if(res.data.time>=60){
                    _this.setData({
                        h:parseInt(res.data.time/60),
                        m:res.data.time % 60
                    })
                }else{
                    _this.setData({
                        h:0,
                        m:res.data.time
                    })
                }
                _this.calcNum()
                callback && callback()
            }
        }).catch((err)=>{
            console.log(err)
        })
        console.log(1)

    },
    SwitchBtn(e) {
        let isChecked = e.detail.value;
        this.setData({
            isUsed:isChecked
        })
        this.getFee()
    },
    selectCoupon() {
        let { leftNum, couponKey } = this.data;
        if(leftNum!=0 || couponKey!==''){
            my.navigateTo({
              url: '/page/selectCoupon/selectCoupon?key=' + this.data.couponKey + '&fee_total=' + this.data.totalNum + '&chooseNum=' + this.checkCouponNum()
            });
        }
    },
    selectHongbao(){
        let { leftNum, hongbaoKey } = this.data;
        if(leftNum!=0 || hongbaoKey!==''){
            my.navigateTo({
              url: '/page/selectHongbao/selectHongbao?key=' + this.data.hongbaoKey + '&fee_total=' + this.data.totalNum + '&chooseNum=' + this.checkCouponNum()
            });
        } 
    },
    checkCouponNum(){
      let chooseNum = 0
      if (this.data.couponVal && this.data.hongbaoVal){
        chooseNum = 2
      } else if (this.data.couponVal){
        chooseNum = 1
      } else if (this.data.hongbaoVal) {
        chooseNum = 1
      }else {
        chooseNum = 0
      }
      return chooseNum
  
    },
    calcNum() {

        let money = parseFloat(this.data.money);
        let isUsed = this.data.isUsed;
        let couponNum = parseFloat(this.data.couponVal)||0;
        let fee_acutal = parseFloat(this.data.fee_acutal);
        let totalNum = parseFloat(this.data.totalNum);
        let hongbaoNum = parseFloat(this.data.hongbaoVal)||0;
        let discount = couponNum + hongbaoNum //总优惠
        let fee_total_insurance = this.data.fee_total_insurance
        if(discount) {
            if(fee_acutal<discount||fee_acutal==discount) {
                if(fee_total_insurance<money){
                    if(isUsed){
                        this.setData({
                            payNum:utils.switchNum(0),
                            useOverage:utils.switchNum(fee_total_insurance),
                        })
                    }else{
                        this.setData({
                            payNum:utils.switchNum(fee_total_insurance),
                            isUsed:false,
                            useOverage:utils.switchNum(0),
                        })
                    }
                    
                }else{
                    if(money==0){
                        this.setData({
                            payNum:utils.switchNum(fee_total_insurance-money),
                            isUsed:false,
                            useOverage:utils.switchNum(0)
                        })
                    }else{
                        this.setData({
                            payNum:utils.switchNum(fee_total_insurance-money),
                            isUsed:true,
                            useOverage:utils.switchNum(money)
                        })
                    }
                    
                }
                
            }else{
                if(isUsed) {
                    if(fee_acutal-discount+fee_total_insurance<money||fee_acutal-discount+fee_total_insurance==money) {
                        this.setData({
                            payNum:utils.switchNum(0),
                            isUsed:true,
                            useOverage:utils.switchNum(fee_acutal-discount+fee_total_insurance)
                        })
                    }else{

                        this.setData({
                            payNum:utils.switchNum(fee_acutal-discount+fee_total_insurance-money),
                            isUsed:true,
                            useOverage:utils.switchNum(money)
                        })
                    }
                }else{
                    this.setData({
                        payNum:utils.switchNum(fee_acutal-discount+fee_total_insurance),
                        isUsed:false,
                        useOverage:0
                    })
                }
            }
        }else{
            if(money) {
                if(isUsed) {
                    if(totalNum<money||totalNum==money) {
                        this.setData({
                            payNum:utils.switchNum(0),
                            isUsed:true,
                            useOverage:utils.switchNum(totalNum)
                        })
                    }else{
                        this.setData({
                            payNum:utils.switchNum(totalNum-money),
                            isUsed:true,
                            useOverage:utils.switchNum(money)
                        })
                    }
                }else{
                    this.setData({
                        payNum:utils.switchNum(totalNum),
                        isUsed:false,
                        useOverage:0
                    })
                }
            }else{
                this.setData({
                    payNum:utils.switchNum(totalNum),
                    disabled:true,
                    isUsed:false,
                    useOverage:0
                })
            }
        }
        let { leftNum, hongbaoKey, couponKey, leftNumSource } = this.data
        if(leftNumSource==1){
            console.log(couponKey,hongbaoKey)
            if(couponKey==='' && hongbaoKey===''){
                this.setData({
                    leftNum:1
                })
            }else{
                this.setData({
                    leftNum:0
                })
            }
        }
    },
    postOrder() {
        let { payNum,couponInfo,coupon,hongbao,isUsed,money,totalNum,rental_no }  = this.data;
        let couponNum = parseFloat(this.data.couponVal)||0;
        let hongbaoNum = parseFloat(this.data.hongbaoVal)||0;
        let discount = couponNum + hongbaoNum //总优惠
        let { uuid,sign,city_id,sys_string } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            city_id:city_id,
            user_sys_version:sys_string,
            rental_no:couponInfo.rental_no,
            client_total:totalNum,
            client_amount:utils.switchNum(payNum)
        }
        if(couponNum) {
            data.coupon_id = coupon.id;
            data.client_coupon = coupon.money;
        }else{
            data.coupon_id = 0;
            data.client_coupon = '0.00';
        }
        if(hongbaoNum) {
            data.coupon_cash_id = hongbao.id;
            data.client_coupon_cash = hongbao.money;
        }else{
            data.coupon_cash_id  = 0;
            data.client_coupon_cash = '0.00';
        }
        if(isUsed) {
            data.use_balance = 1;
            if(payNum>0) {
                data.client_balance = totalNum - discount - payNum
            }else{
                data.client_balance = totalNum - discount
            }  
        }else{
            data.use_balance = 0;
            data.client_balance = '0.00';
        }
        my.showLoading({
            content:'结算中...'
        })
        http.post({
            url:api.apiConfirmOrder(),
            data
        }).then((res)=>{
            
            // console.log(res);
            switch(res.status) {
                case 0:
                my.redirectTo({
                    url: '/page/tripDetail/tripDetail?rental_no='+rental_no,
                });
                break;
                case 1001:
                my.redirectTo({
                    url: '/page/payOrder/payOrder?rental_no='+rental_no,
                });
                break;
                case 1014:
                my.showToast({
                    content:res.msg
                });
                break;
                default:
                my.showToast({
                    content:res.msg
                });
            }
        }).catch((err)=>{
            my.hideLoading();
            console.log(err)
        })
    }
})