/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: umeng
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-20-18:29
 * Description:
 *
 *************************************************/
import Umeng from '../../../../../other_modules/like-tool/Umeng'
import env from '../../../../../other_modules/like-env'

export const umeng = env.isProduction ? new Umeng(1272836877) : new Umeng(1275259068)


 