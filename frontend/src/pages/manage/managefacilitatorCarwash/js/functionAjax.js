import $ from 'jquery'
var FoundationTools = {
    /**
     * 获取url参数
     * @param name
     * @returns {*}
     */
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return "";
    },
    /**
     * 获取时间标准格式
     * @returns {*}
     */
    getFormatDate: function (date) {
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    /**
     * 设置与获取浏览器cookie
     * @returns {*}
     */
    setCookie: function (c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },
    setCookie1: function setCookie(name, value, time) {
        var exp = new Date();
        exp.setTime(exp.getTime() + time * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return (unescape(arr[2]));
        else
            return null;
    },
    //删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    //异步事件
    asyncEvent: function (param, url) {
        var result = null;
        $.ajax({
            async: true,
            type: "post",
            url: url,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            data: param,
            success: function (data) {
                result = data;
            },
            error: function (data) {
                result = data;
            }
        });
        return result;
    },
    //同步事件
    syncEvent: function (param, url) {
        //获取钉钉返回的手机设备信息
        if (typeof param == "object") {
            param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
        }
        return this.syncRequest(param, url);
    },

    syncRequest: function (param, url) {
        var result = null;
        $.ajax({
            timeout: 5000,
            type: "post",
            url: url,
            //dataType: "json",
            //contentType: "application/json",
            data: param,
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (data) {
                result = data;
            }
        });
        return result;
    },
    httpsSyncRequest: function (param, url) {
        var result = null;
        $.ajax({
            timeout: 5000,
            type: "post",
            url: url,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (data) {
            }
        });
        return result;
    },
    getUrlvue (linkUrl) {//截取链接
        var str, arr, newArr, num, num2, i, j, newJson
        if (linkUrl) {
            str = decodeURIComponent (linkUrl.split('?')[1])
            arr = str.split('&')
            num = arr.length
            newJson = {}
            for (i = 0; i < num; i++) {
                newArr = arr[i].split('=')
                num2 = newArr.length
                newJson[newArr[0]] = newArr[1]
            }
            return newJson
        } else {
            return {}
        }
    }
}
export default FoundationTools