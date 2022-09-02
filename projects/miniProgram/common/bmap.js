/**
 * @file 微信小程序JSAPI
 * @author 崔健 cuijian03@baidu.com 2017.01.10
 */

/**
 * 百度地图微信小程序API类
 *
 * @class
 */
class BMapWX {

    /**
     * 使用微信接口进行定位
     *
     * @param {string} type 坐标类型
     * @param {Function} success 成功执行
     * @param {Function} fail 失败执行
     * @param {Function} complete 完成后执行
     */
    getWXLocation(type, success, fail, complete) {
        type = type || 1,
        success = success || function () {};
        fail = fail || function () {};
        complete = complete || function () {};
        my.getLocation({
            type: type,
            success: success,
            fail: fail,
            complete:complete
        });
    }

    /**
     * POI周边检索
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi
     */
    search(param) {
        var that = this;
        param = param || {};
        let searchparam = {
            keywords:param.query,
            radius:50000,
            key:'91ed10906005ee88866f14fd9f076e8b',
            s:'rsv3'
        };
        let otherparam = {
            iconPath: param["iconPath"],
            iconTapPath: param["iconTapPath"],
            width: param["width"],
            height: param["height"],
            alpha: param["alpha"] || 1,
            success: param["success"] || function () {},
            fail: param["fail"] || function () {}
        };
        
        let locationsuccess = function (result) {
            searchparam["location"] = result["latitude"] + ',' + result["longitude"];
            
            my.httpRequest({
                url: 'http://restapi.amap.com/v3/place/around',
                headers:{
                   'Content-Type':'application/json'
                },
                data:searchparam,
                dataType:'json',
                method: 'GET',
                success(data) {

                    let res = data["data"];
                    if (res["status"] == 1) {
                        let poiArr = res["pois"];
                        // outputRes 包含两个对象，
                        // originalData为百度接口返回的原始数据
                        // wxMarkerData为小程序规范的marker格式
                        let outputRes = {};
                        outputRes["originalData"] = res;
                        outputRes["wxMarkerData"] = [];
                        for (let i = 0; i < poiArr.length; i++) {
                            poiArr[i].location = poiArr[i].location.split(',')
                            outputRes["wxMarkerData"][i] = {
                                id: i,
                                latitude: poiArr[i]["location"][1],
                                longitude: poiArr[i]["location"][0],
                                title: poiArr[i]["name"],
                                address: poiArr[i]["address"]
                            } 
                        }
                        otherparam.success(outputRes);
                    } else {
                        otherparam.fail({
                            errMsg: res["message"],
                            statusCode: res["status"]
                        });
                    }
                },
                fail(data) {
                    otherparam.fail(data);
                }
            });
        }
        let locationfail = function (result) {
            otherparam.fail(result);
        };
        let locationcomplete = function (result) {
        };
        if (!param["location"]) {
            let type = 1;
            that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
        } else {
            let longitude = param.location.split(',')[1];
            let latitude = param.location.split(',')[0];
            let errMsg = 'input location';
            let res = {
                errMsg: errMsg,
                latitude: latitude,
                longitude: longitude
            };
            locationsuccess(res);
        }
    }
}

export default BMapWX;