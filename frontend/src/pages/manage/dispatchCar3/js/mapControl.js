/**
 * Created by garvey on 2017/8/11.
 */
const MARKER = {
  START_POINT: new AMap.Icon({
    image: require('../images/yong.png'),
    size: new AMap.Size(41, 45),
    imageSize: new AMap.Size(41, 45)
  }),

  // anchor：new BMap.Size(11, 31),
  END_POINT: new AMap.Icon({
    image: require('../images/huan.png'),
    size: new AMap.Size(41, 45),
    imageSize: new AMap.Size(41, 45)
  }),

  // anchor：new BMap.Size(17, 34),
  SAME_POINT: new AMap.Icon({
    image: require('../images/all.png'),
    size: new AMap.Size(41, 45),
    imageSize: new AMap.Size(41, 45)
  }),
}

const getMarker = function (type) {
  if (type === 1) {
    return MARKER.START_POINT
  } else if (type === 2) {
    return MARKER.END_POINT
  } else {
    return MARKER.SAME_POINT
  }
}

let mapControl = {
  map: null,
  branch: null,
  name: null,

  initMap(selector) {
    this.map = new AMap.Map(selector, {
      resizeEnable: true,
      zoom: 13,
      center: [113.264360, 23.129080]
    });
  },

  drawBranch(data) {
    if (this.branch) {
      this.branch.eachLayer(item => {
        item.setMap(null)
      })
    }
    this.branch = new AMap.LayerGroup(data.map(item => {
      return new AMap.Marker({
        position: [item.lng, item.lat],
        map: this.map,
        icon: getMarker(item.type),
        offset: new AMap.Pixel(-20, -40),
        zIndex: 100
      })
    }).concat(data.map(item => {
      let className = 'point_car_cnt'
      if(item.type===3){
        className+=' same'
      }
        return new AMap.Marker({
          content: '<div class="'+className+'">' + item.return_num + '</div>',
          position: [item.lng, item.lat],
          offset: new AMap.Pixel(-25, -47),
          map: this.map,
          zIndex: 101
        });
      })
    ).concat(data.map(item=>{
      let className = 'point_car_cnt'
      if(item.type===3){
        className+=' same'
      }
      return new AMap.Marker({
        content: '<div class="'+className+'">' + item.fetch_num + '</div>',
        position: [item.lng, item.lat],
        offset: new AMap.Pixel(6, -47),
        map: this.map,
        zIndex: 101
      });
    })))
    this.map.setFitView()
  },

  drawName(data,show) {
    if(this.name){
      this.name.eachLayer(item => {
        item.setMap(null)
      })
    }
    this.name = new AMap.LayerGroup(data.map(item=>{
      let str = "("
      if(item.type===1){
        str+='用'+item.getIndex+")"
      }else if(item.type===2){
        str+='还'+item.returnIndex+')'
      }else{
        str+='还'+item.returnIndex+'用'+item.getIndex+')'
      }
      return new AMap.Marker({
        content: '<div class="branch_name">' + item.branch_name+str + '</div>',
        position: [item.lng, item.lat],
        offset: new AMap.Pixel(0, 0),
        map: this.map,
        zIndex: 101
      });
    }))
    if(show){
      this.showName()
    }else{
      this.hideName()
    }
  },

  showName(){
    if(this.name){
      this.name.show()
    }
  },

  hideName(){
    if(this.name){
      this.name.hide()
    }
  }

}

module.exports = mapControl