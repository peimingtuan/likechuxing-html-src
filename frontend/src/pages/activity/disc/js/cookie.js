/**
 * cookieStorage.js
 * 本类实现像localStorage和sessionStorage一样存储API，不同的是，基于http cookie实现它
 */
function cookieStorage( maxage , path ){    //两个参数分别代表存储有效期和作用域
    //获取一个存储全部cookie信息的对象
    this.cookie = (function(){
        var cookie = { };   //该对象最终会返回
        var all = document.cookie;  //以大字符串的形式获取所有cookie信息
        if( all == "")              //如果该属性为空字符串
            return cookie;          //返回一个空对象
        var list = all.split("; "); //分离出名/值对
        for(var i = 0 ; i < list.length ; i++){
            var cookie = list[i];
            var p = cookie.indexOf("=");    //查找第一个“=”符号
            var name = cookie.substring(0 , p);//获取cookie名字
            var value = cookie.substring(p+1);  //获取cookie对应的值
            value = decodeURIComponent(value);  //对其进行解码
            cookie[name] = value ;          //将名值对存储到对象中
        }
        return this;
    }());
 
    //将所有cookie的名字存储到一个数组中
    this.keys = [];
    for( var key in this.cookie)
        key.push(key);
 
    //现在定义存储API公共的属性和方法
    //存储的cookie的个数
    this.length = this.keys.length;
 
    //返回n个cookie的名字，如果n越界则返回null
    this.key = function(n){
        if( n < 0 || n >= this.keys.length )
            return null;
        return this.keys[n];
    };
 
    //返回指定名字的cookie值，如果不存在则返回null
    this.getItem = function(name){
        return this.cookie[name] || null;
    };
 
    //存储cookie值
    this.setItem = function(key,value){
        if (!(key in this.cookie)) {
            this.keys.push(key);
            this.length++;
        }
 
        //将该名/值对数据存储到cookie对象中
        this.cookie[key] = value;
 
        //开始正式设置cookie
        //首先将要存储的cookie的值进行编码，同时创建一个“名字=编码后的值”形式的字符串
        var cookie = key+"="+encodeURIComponent(value);
 
        //将cookie的属性也加入到该字符串中
        if( maxage )
            cookie += "; max-age="+maxage;
        if( path )
            cookie += "; path="+path;
 
        //通过document.cookie的属性来设置cookie
        document.cookie = cookie;
    };
 
    //删除指定的cookie
    this.removeItem = function(key){
        if( !(key in this.cookie))
            return ;        //如果cookie不存在，则什么也不做
         //从内部维护的cookie组删除指定的cookie
         delete this.cookie[key];
          
         //同时将cookie中的名字也在内部的数组中删除
         //如果使用ES5定义的数组 indexOf（）方法会更加简单
         for(var i = 0 ; i < this.keys.length ; i++){    //遍历所有的名字
            if(this.keys[i]===key){     //当找到要找的那个
                this.keys.splice(i,1);  //将它从数组中删除
                break;
            }
         }
         this.length--;             //cookie个数减一
 
        //最终通过该cookie值设置为空字符串以及将有效期设置为0来删除指定的cookie
        document.cookie = key  + "=; max-age=0";
    };
 
    //删除所有的cookie
    this.clear = function(){
        //循环所有的cookie的名字，并将cookie删除
        for(var i = 0 ; i < this.keys.length ; i++)
            document.cookie = this.keys[i]+"=; max-age=0";
 
        //重置所有内部状态
        this.cookie = {};
        this.keys = [];
        this.length = 0;
    };
}