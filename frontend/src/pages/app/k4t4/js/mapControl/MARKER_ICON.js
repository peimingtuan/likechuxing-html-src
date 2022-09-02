/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: MARKER_ICON
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/1-下午6:55
 Description:
 Param:
 Return:
 *************************************************/
let MARKER_ICON = {}
if(window.AMap){
  MARKER_ICON = {
    USER: new AMap.Icon({
      image: require('../../images/user_poi.png'),
      size: new AMap.Size(20, 19),
      imageSize: new AMap.Size(20, 19)
    }),
    BRANCH: {
      B: {
        L: {
          // B网点-普通图-有车
          H: new AMap.Icon({
            image: require('../../images/branch/LIKE有车@3x.png'),
            size: new AMap.Size(43, 48),
            imageSize: new AMap.Size(43, 48)
          }),
          // B网点-普通图-无车
          N: new AMap.Icon({
            image: require('../../images/branch/LIKE无车@3x.png'),
            size: new AMap.Size(43, 48),
            imageSize: new AMap.Size(43, 48)
          })
        },
        XL: {
          // B网点-大图-有车
          H: new AMap.Icon({
            image: require('../../images/branch/LIKE有车@3x.png'),
            size: new AMap.Size(61, 67),
            imageSize: new AMap.Size(61, 67)
          }),
          // B网点-大图-无车
          N: new AMap.Icon({
            image: require('../../images/branch/LIKE无车@3x.png'),
            size: new AMap.Size(61, 67),
            imageSize: new AMap.Size(61, 67)
          })
        }
      },
      BP: {
        L: {
          // B+网点-普通图-有车
          H: new AMap.Icon({
            image: require('../../images/branch/立刻还有车@3x.png'),
            size: new AMap.Size(43, 48),
            imageSize: new AMap.Size(43, 48)
          }),
          // B+网点-普通图-无车
          N: new AMap.Icon({
            image: require('../../images/branch/立刻还无车@3x.png'),
            size: new AMap.Size(43, 48),
            imageSize: new AMap.Size(43, 48)
          })
        },
        XL: {
          // B+网点-大图-有车
          H: new AMap.Icon({
            image: require('../../images/branch/立刻还有车@3x.png'),
            size: new AMap.Size(61, 67),
            imageSize: new AMap.Size(61, 67)
          }),
          // B+网点-大图-无车
          N: new AMap.Icon({
            image: require('../../images/branch/立刻还无车@3x.png'),
            size: new AMap.Size(61, 67),
            imageSize: new AMap.Size(61, 67)
          })
        }
      }
    }
  }
}
export default MARKER_ICON
