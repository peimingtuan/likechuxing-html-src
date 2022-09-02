import appArguments from '../../../../other_modules/app-arguments'
import {appMutual} from '../../../../other_modules/app-mutual'

if(Number(appArguments.type) === 0){
  appMutual.jump.deposit({
    destroy_current:1
  })
}else{
  appMutual.jump.license({
    destroy_current:1
  })
}





