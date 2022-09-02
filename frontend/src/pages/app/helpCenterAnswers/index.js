/**
 * Created by garvey on 2017/9/6.
 */
import appArguments from '../../../../other_modules/app-arguments'
import myAjax from '../../../../other_modules/like-request/withAxiosV2'
import {getApiUrl} from "../../../../other_modules/url-constructor";
import Toast from '../../../component/toast'

require('./css/common.less')

const loadAnswer = function(answer){
  let title_el = document.querySelector('.title')
  title_el.innerHTML = answer.title || ''

  let content_el = document.querySelector('.list')
  content_el.innerHTML = answer.content || ''
}

myAjax.post(getApiUrl('/help/answer-detail'),{
  uuid:appArguments.uuid,
  sign:appArguments.sign,
  id:appArguments.qid
}).then(res=>{
  if(res.status === 0){
    loadAnswer(res.data)
  }else{
    Toast(res.msg)
  }
})














