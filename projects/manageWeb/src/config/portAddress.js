/**
 * Created by garvey on 2017/6/23.
 */
import CONFIG from './main.js'

// todo 改成正式接口地址
let HOST = 'http://123.57.217.108:8892/index.php?r='

if (CONFIG.IS_DEV) {
  HOST = 'http://123.57.217.108:8892/index.php?r='
}

const PORT = {
  common: {
    getCarStatusList: HOST + 'm-index/carstatuslist'
  }
}

export default PORT
