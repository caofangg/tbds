const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
let qqmapsdk
/**
 * markers: 标记点
 * polyline: 路程点
 * controls: 控件
 * Interval: 轮询事件-开始计算
 * mapCtx: 地图控件
 * control: {控制参数
 *  interval: 轮询间隔时间
 *  areaMultiple: 区域多倍积分倍数
 * }
 * journey: 总距离
 * judge: { 判断参数
 *  punishment: boolean 是否惩罚过
 *  speed: number 超速速度
 * }
 * area: { 区域
 *    info: string( 'city' || 'district' || 'nation' || 'province' || street) 判断区域大小划分
 *    scope: string 判断区域
 * }
 */
Page({
  data: {
    markers: [{
      iconPath: "../resources/icons8-50.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 20,
      height: 20
    }],
    polyline: [{
      points: [{
        longitude: 104.06326,
        latitude: 30.66074
      }],
      color: "#33FF33DD",
      width: 5,
      dottedLine: false
    }],
    controls: [{
      id: 1,
      iconPath: '../resources/icons8-50.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    Interval: '',
    mapCtx: '',
    journey: 0,
    control: {
      interval: 1000,
      areaMultiple: 1
    },
    judge: {
      punishment: false,
      speed: 10
    },
    area: {
      info: 'nation',
      scope: '中国'
    }
  },
  onLoad: function () {
    const that = this
    /** 
     * 地图类
     **/
    qqmapsdk = new QQMapWX({
      key: 'PK5BZ-VPFK6-YQXSI-MSTHY-4XFFV-FRB23'
    });

    that.mapCtx = wx.createMapContext('restaurantMap')
    that.getLocation(that.setMark)
    that.getArea()
  },
  onReady: function () {

  },
  onShow: function () { },

  zanding: function () {
    clearInterval(this.Interval)
  },
  shuaxin: function () {
    this.Interval = setInterval(this.addMark, this.data.interval)
  },
  addMark() {
    const that = this
    const points = that.data.polyline[0].points
    let longitude = Number((points[points.length - 1].longitude + 0.0001).toFixed(5))
    let latitude = Number((points[points.length - 1].latitude + 0.0001).toFixed(5))
    // console.log(longitude + ' + ' + latitude)
    let mark = {
      longitude,
      latitude
    }
    let distance = that.getDistance(mark)
    let speed = that.getSpeed(distance)
    console.log(`${distance} + ${speed}`)
    points.push(mark)
    that.setData({
      'markers[0].latitude': latitude,
      'markers[0].longitude': longitude,
      'polyline[0].points': points
    })
    that.mapCtx.moveToLocation();
  },
  xianshi() {
    console.log()
  },
  regionchange(e) {
    // console.log(e.type)
  },
  /**
   * 状态判断
   * 返回应该执行状态
   */
  stateJudge(speed) {
    const that = this
    if (speed > that.data.judge.speed) {
      return that.errorState
    } else {
      return that.normalState
    }
  },

  /**
   * 正常状态
   */
  normalState() {
    const that = this
    that.setData({
      "polyline[0].color": '#33FF33DD'
    })
  },

  /**
   * 异常状态
   */
  errorState() {
    const that = this
    if (that.data.judge.punishment) {
      that.punishment()
    }
    that.setData({
      "polyline[0].color": '#FF3333DD'
    })
  },
  /**
   * 区域判断
   */
  getArea(fnc) {
    fnc = fnc || function () { }
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        fnc(res)
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 惩罚方法
   */
  punishment() {

  },

  /**
   * 时间方法
   */
  getTime() {

  },

  /**
   * 积分方法
   */
  getIntegral() {

  },

  /**
   * 获取坐标
   */
  getLocation(fnc) {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        res.longitude = Number(res.longitude.toFixed(5))
        res.latitude = Number(res.latitude.toFixed(5))
        fnc(res)
      }
    })
  },
  /**
   * 设置坐标
   */
  setMark(res) {
    const that = this
    that.setData({
      'markers[0].latitude': res.latitude,
      'markers[0].longitude': res.longitude,
      'polyline[0].points[0].latitude': res.latitude,
      'polyline[0].points[0].longitude': res.longitude
    })
  },
  /**
   * 获取距离
   * newCoordinates: Object{
   *    latitude,
   *    longitude
   * }
   * return 距离单位为米
   */
  getDistance(newCoordinates) {
    const that = this
    const oldCoordinates = {
      latitude: that.data.markers[0].latitude,
      longitude: that.data.markers[0].longitude
    }
    let rad1 = newCoordinates.latitude * Math.PI / 180.0
    let rad2 = oldCoordinates.latitude * Math.PI / 180.0
    let lon1 = newCoordinates.longitude * Math.PI / 180.0
    let lon2 = oldCoordinates.longitude * Math.PI / 180.0

    let a = rad1 - rad2
    let b = lon1 - lon2
    const r = 6378137;
    let s = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
    s = Math.round(s * 10000) / 10000.0;
    return s
  },
  /**
   * 速度判断
   * 返回秒速
   */
  getSpeed(distance) {
    const that = this
    let time = that.data.interval / 1000
    let speed = distance / time
    return Number(speed.toFixed())
  },
  /**
   * 总路程
   * 返回KM
   */
  getJourney(distance) {
    const that = this
    return Number(distance.toFixed()) / 100
  }
})