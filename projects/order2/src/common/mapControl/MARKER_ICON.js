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
export default {
  USER: new AMap.Icon({
    image: require('../../assets/images/user_poi.png'),
    size: new AMap.Size(20, 19),
    imageSize: new AMap.Size(20, 19)
  }),
  CAR: new AMap.Icon({
    image: require('../../assets/images/icon_car_gray.png'),
    size: new AMap.Size(32, 32),
    imageSize: new AMap.Size(32, 32)
  }),
  BRANCH: {
    B: {
      L: {
        // B网点-普通图-有车
        H: new AMap.Icon({
          image: require('../../assets/images/branch/LIKE有车@3x.png'),
          size: new AMap.Size(43, 48),
          imageSize: new AMap.Size(43, 48)
        }),
        // B网点-普通图-无车
        N: new AMap.Icon({
          image: require('../../assets/images/branch/LIKE无车@3x.png'),
          size: new AMap.Size(43, 48),
          imageSize: new AMap.Size(43, 48)
        })
      },
      XL: {
        // B网点-大图-有车
        H: new AMap.Icon({
          image: require('../../assets/images/branch/LIKE有车@3x.png'),
          size: new AMap.Size(61, 67),
          imageSize: new AMap.Size(61, 67)
        }),
        // B网点-大图-无车
        N: new AMap.Icon({
          image: require('../../assets/images/branch/LIKE无车@3x.png'),
          size: new AMap.Size(61, 67),
          imageSize: new AMap.Size(61, 67)
        })
      }
    },
    BP: {
      L: {
        // B+网点-普通图-有车
        H: new AMap.Icon({
          image: require('../../assets/images/branch/立刻还有车@3x.png'),
          size: new AMap.Size(43, 48),
          imageSize: new AMap.Size(43, 48)
        }),
        // B+网点-普通图-无车
        N: new AMap.Icon({
          image: require('../../assets/images/branch/立刻还无车@3x.png'),
          size: new AMap.Size(43, 48),
          imageSize: new AMap.Size(43, 48)
        })
      },
      XL: {
        // B+网点-大图-有车
        H: new AMap.Icon({
          image: require('../../assets/images/branch/立刻还有车@3x.png'),
          size: new AMap.Size(61, 67),
          imageSize: new AMap.Size(61, 67)
        }),
        // B+网点-大图-无车
        N: new AMap.Icon({
          image: require('../../assets/images/branch/立刻还无车@3x.png'),
          size: new AMap.Size(61, 67),
          imageSize: new AMap.Size(61, 67)
        })
      }
    },
    START: new AMap.Icon({
      image: require('../../assets/images/branch/getCarPoint.png'),
      size: new AMap.Size(43, 48),
      imageSize: new AMap.Size(43, 48)
    }),
    END: new AMap.Icon({
      image: require('../../assets/images/branch/returnCarPoint.png'),
      size: new AMap.Size(43, 48),
      imageSize: new AMap.Size(43, 48)
    }),
  },
  RENTAL_DETAIL:{
    // anchor：new BMap.Size(11, 31),
    START_POINT: new AMap.Icon({
      image: require('../../assets/images/rentalDetail/start_point.png'),
      size: new AMap.Size(22, 34),
      imageSize: new AMap.Size(22, 34)
    }),

    // anchor：new BMap.Size(11, 31),
    END_POINT:new AMap.Icon({
      image: require('../../assets/images/rentalDetail/end_point.png'),
      size: new AMap.Size(22, 34),
      imageSize: new AMap.Size(22, 34)
    }),

    // anchor：new BMap.Size(17, 34),
    SAME_POINT:new AMap.Icon({
      image: require('../../assets/images/rentalDetail/start_end_point.png'),
      size: new AMap.Size(34, 34),
      imageSize: new AMap.Size(34, 34)
    }),

    // anchor: new BMap.Size(20, 42),
    GET_CAR_POINT:new AMap.Icon({
      image: require('../../assets/images/rentalDetail/getCatPoint.png'),
      size: new AMap.Size(41, 45),
      imageSize: new AMap.Size(41, 45)
    })
  }
}
