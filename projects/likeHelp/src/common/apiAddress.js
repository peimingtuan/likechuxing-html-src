/**
 * Created by garvey on 2017/6/23.
 */
import Env from '../../other_modules/like-env'

let HOST = 'http://localhost:6082'

if (Env.isProduction) {
  HOST = 'http://119.23.14.132:6082'
}

const API = {
  time: {
    get: HOST + '/time/get'
  },
  user:{
    info:HOST + '/user/info'
  },
  code:{
    status:HOST+'/code/status',
    pull:HOST+'/code/pull'
  }
}

export {API}
