const app = getApp()
const amapFile = require('../../libs/amap-wx.js')
const config = require('../../libs/config.js')
const myAmapFun = new amapFile.AMapWX({
  key: config.Config.key
})
/** 时间函数用参数 */
let myTimes = {
  /**countTooGetLocation:Number 函数执行了多久*/
  countTooGetLocations: 0,

  /**totalMicroSecond:Number 运行总时间 */
  totalMicroSeconds: 0,

  /**areaTime:Number 判断是否执行getArea */
  areaTimes: 0,

  /** navigationState:Number 判断是否重新规划导航 */
  navigationStates: 0,

  /** _myRun:Number 判断是否执行run事件 */
  _myRun: 0,

  /** _myState:Number 判断是否执行getState事件 */
  _myState: 0,

  /** _mySetmark:Number 判断是否执行setMark事件 */
  _mySetmark: 0
}
/**starRun:Number 0 OR 1 是否执行setTime函数 */
var starRun = 0;
/** 判断是否进入搜索模式 */
let searchState = false;
/** 目标地点经纬度 */
let mylocation = {}

var oriMeters = 0.0;

/** 中国所有赛事 */
let competitionArea

/** 判断状态用总里程 */
let stateJournye = 0

//****************************************************************************************
//****************************************************************************************
/**
 * 小程序包
 * 
 * 
 *
 * latitude: Number 纬度,
 * longitude: Number 经度,
 * integration: String 积分
 * updateIntegration: Number 已上传积分
 * map: anyObject 地图属性{
 *  stuts: String 按钮标示
 *  scale: Number 地图显示大小
 *  showlocation:Boolean 是否显示原点箭头
 * }
 * time: String "0: 00: 00", 时间格式化
 * polyline: objectArray 路径{
 *  points: objectArray 路程点{
 *    longitude: Number 经度
 *    latitude: Number 纬度
 *  },
 *  color: String 路径颜色
 *  width: Number 路径显示宽度
 * }
 * Interval: Any 轮询事件-开始计算
 * mapCtx: Any 地图控件
 * control: numberObject { 控制参数
 *  interval: Number轮询间隔时间
 *  areaMultiple: Number 区域多倍积分倍数
 *  errorInterval:Number 异常处罚积分倍数
 * }
 * journey: String 总距离:保留三位小数点，单位KM
 * judge: anyObject { 判断参数
 *  gameState: Boolean 是否参加比赛
 *  punishment: Boolean 是否惩罚过
 *  speed: Number 超速速度
 * }
 * area: stringObject { 区域
 *    info: String( 'city' || 'district' || 'nation' || 'province' || street) 判断区域大小划分
 *    scope: String 判断区域
 * }
 * chinaCompetitionArea: objArray 赛事区域
 */
Page({
  data: {
    latitude: 30.66074,
    longitude: 104.06326,
    integration: '0.000',
    updateIntegration: 0,
    map: {
      stuts: "开始",
      scale: 18,
      showlocation: true
    },
    time: "0: 00: 00",
    polyline: [{
      points: [{
        latitude: 0,
        longitude: 0
      }],
      color: "#33FF33DD",
      width: 5,
      dottedLine: false
    }],
    Interval: '',
    mapCtx: '',
    journey: '0.000',
    control: {
      interval: 1000,
      areaMultiple: 1,
      errorInterval: 1
    },
    judge: {
      gameState: false,
      punishment: false,
      speed: 3
    },
    area: {
      info: 'nation',
      scope: '中国'
    },
    chinaCompetitionArea: ''
  },

  //****************************
  onLoad: function(options) {
    const that = this;
    //获取用户是否授权登录过 dev
    // app.orAuth()
    // 页面初始化 options为页面跳转所带来的参数 

    initializationParameter()

    // 初始化参数
    function initializationParameter() {

      that.mapCtx = wx.createMapContext('restaurantMap')
      that.getLocation(
        function setAddress(res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            'polyline[0].points[0].latitude': res.latitude,
            'polyline[0].points[0].longitude': res.longitude
          })
        }
      )
      that.areaJudge(that.getArea)
    }
  },

  onShow() {
    const that = this
    console.log(wx.getStorageInfoSync())
    let search = wx.getStorageSync('search')
    if (search) {
      searchState = true
      that.searchState()
    }
  },

  onHide() {
    searchState = false
    wx.removeStorageSync('search')
  },

  /**
   * 搜索模式初始化
   * 
   * searchState = true
   * location = 目标地点经纬度
   */
  searchState() {
    console.log(`searchState 触发了`)
    const that = this
    let keys = wx.getStorageInfoSync().keys
    for (let key of keys) {
      if (key === 'search') {
        searchState = true
        mylocation = wx.getStorageSync('search')

        that.route(mylocation, that)

        wx.removeStorageSync('search')
      }
    }
  },

  /** 获取路径
   * 目标地点经纬度
   * 
   */
  route() {
    console.log(`route 触发了`)
    const that = this
    const data = that.data
    let longitude = data.longitude
    let latitude = data.latitude
    myAmapFun.getWalkingRoute({
      origin: longitude + ',' + latitude,
      destination: mylocation.longitude + ',' + mylocation.latitude,
      success: function(data) {
        console.log(data)
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          'polyline[0].points': points,
          'polyline[0].color': starRun ? '33FF33DD' : '#87CEFA'
        });
        // if (data.paths[0] && data.paths[0].distance) {
        //   that.setData({
        //     distance: data.paths[0].distance + '米'
        //   });
        // }
        // if (data.taxi_cost) {
        //   that.setData({
        //     cost: '打车约' + parseInt(data.taxi_cost) + '元'
        //   });
        // }

      }
    })
  },

  /**
   * 数据初始化
   */
  initializeData() {
    const that = this
    let keys = Object.keys(myTimes)
    for (let key of keys) {
      myTimes[key] = 0
    }
    starRun = 0
    searchState = false
    stateJournye = 0
    mylocation = {}
    that.setData({
      integration: '0.000',
      updateIntegration: 0,
      map: {
        stuts: "开始",
        scale: 18,
        showlocation: true
      },
      time: "0: 00: 00",
      polyline: [{
        points: [{
          latitude: this.data.latitude,
          longitude: this.data.longitude
        }],
        color: "#33FF33DD",
        width: 5,
        dottedLine: false
      }],
      Interval: '',
      mapCtx: '',
      journey: '0.000',
      control: {
        interval: 1000,
        areaMultiple: 1,
        errorInterval: 1
      },
      judge: {
        gameState: false,
        punishment: false,
        speed: 3
      },
      area: {
        info: 'nation',
        scope: '中国'
      }
    })

  },

  /**
   * 开始暂停按钮事件控制
   * @see 根据按钮stuts切换状态
   * 
   * @param e: Object 按钮状态
   * 
   */
  toggleStatus(e) {
    switch (e.target.dataset.stuts) {
      case '开始':
        this.starRun()
        this.setData({
          "map.stuts": "暂停"
        })
        break
      case '暂停':
        this.stopRun();
        this.setData({
          "map.stuts": "开始"
        })
        break
    }
  },

  /**搜索按钮事件
   * 
   */
  openlocalSearch: function() {
    wx.navigateTo({
      url: 'navigation/navigation'
    })
  },

  /**
   * 开始按钮事件
   */
  starRun: function() {
    const that = this
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    if (myTimes.totalMicroSeconds !== 0) {
      this.getArea()
    }
    that.shuaxin(this)
  },

  /**
   * 暂停按钮事件
   */
  stopRun: function() {
    const that = this
    starRun = 0;
    that.zanding(that)
    that.initializeData()
  },

  /**
   * 转发监听
   */
  onShareAppMessage: function() {
    return {
      title: '微信小程365',
      desc: '最具人气的小程序365!',
      path: '/page/user?id=123'
    }
  },
  /**
   * 活动事件
   * 
   * @see zanding:function 暂停事件
   * @see shuaxin:function 活动事件
   */
  zanding: function(that) {
    that.updateIntegration()
  },
  shuaxin: function(that) {
    that.setTime()
  },

  /**
   * 获取状态
   * 
   * @param speed:number 速度
   * @return state:String 状态名
   */
  getState(_getStateTime) {
    const that = this
    let speed = stateJournye / _getStateTime //30秒
    let state = that.stateJudge(speed)
    console.log(`getState----状态:${state}------stateJournye:${stateJournye}--------speed:${speed}`)
    stateJournye = 0
    return state
  },

  /**
   * 状态判断
   * 
   * @param speed:Number 速度
   * @return state:String 返回应该执行状态
   */
  stateJudge(speed) {
    const that = this
    if (speed > that.data.judge.speed) {
      return that.errorState(speed)
    } else {
      return that.normalState()
    }
  },

  /**
   * 正常状态
   * 
   * @return 'normal':String 正常
   */
  normalState() {
    const that = this
    that.data.control.errorInterval = 1
    that.setData({
      "polyline[0].color": '#33FF33DD'
    })
    return 'normal'
  },

  /**
   * 异常状态
   * 
   * @param speed:Number 速度
   * @return 'error':String 异常
   */
  errorState(speed) {
    const that = this
    that.data.judge.punishment = true
    that.punishment(speed)
    that.setData({
      "polyline[0].color": '#FF3333DD'
    })

    return 'error'
  },

  /**
   * 惩罚方法
   */
  punishment(speed) {
    if (speed > 13) {
      this.data.control.errorInterval = -1
    } else {
      this.data.control.errorInterval = -2
    }
  },


  /**
   * 获取积分
   * 
   * @param distance:Number 距离
   * @return integra:Number 获得积分
   */
  getIntegral(distance) {
    if (this.data.control.errorInterval > 0) {
      return distance * this.data.control.areaMultiple 
    } else {
      return distance * this.data.control.errorInterval 
    }
  },

  /**
   * 上传积分
   * 
   * @param updateIntegration:Number that.data.updateIntegration
   */
  updateIntegration() {
    const that = this 
    let journey = that.data.journey
    let totalMicroSecond = myTimes.totalMicroSeconds / 1000
    let integration = that.data.updateIntegration.toFixed(3)
    Number(integration) / 1000
    let information = '徒步' + (that.data.judge.punishment ? '惩罚' : '') + (that.data.judge.gameState ? competitionArea : '')
    that.data.updateIntegration = 0
    let data = {
      ir_information: information,
      ir_integral: integration,
      ir_mileage: journey,
      ir_elapsed_time: totalMicroSecond, 
    }
    console.log(data)
    let request = {
      name: 'updateIntegration()',
      url: app.API.POST.COMPETITIONINTEGRAL,
      method: 'POST',
      data: data,
      success: function(res) {
        // console.log(res)
      },
      fail: function() {
        console.log(`失败`)
      }
    }
    app.reQuest(request)
  },

  /**
   * 获取区域
   * 
   * @param fnc: Function 成功执行函数
   */
  getArea(fnc = () => {}) {
    const that = this
    // console.log(fnc)
    myAmapFun.getRegeo({
      success: function(res) {
        wx.setStorageSync('addRess', res[0])
        let chinaCompetitionArea = that.data.chinaCompetitionArea
        for (let myCompetitionArea of chinaCompetitionArea) {
          switch (myCompetitionArea.co_line_num) {
            case 1:
              break;
            case 2:
              if (myCompetitionArea.co_province == res[0].regeocodeData.addressComponent.province ){
                let multiple = Number(myCompetitionArea.co_integral_multiple)
                that.setData({
                  "judge.gameState": true,
                  "control.areaMultiple" : multiple
                })
                competitionArea = myCompetitionArea.co_province
              }
              break;
            case 3:
              if (myCompetitionArea.co_province == res[0].regeocodeData.addressComponent.province
                && myCompetitionArea.co_city_three == res[0].regeocodeData.addressComponent.city) {
                let multiple = Number(myCompetitionArea.co_integral_multiple)
                that.setData({
                  "judge.gameState": true,
                  "control.areaMultiple": multiple
                })
                competitionArea = myCompetitionArea.co_city_three
              }
              break;
            case 4:
              if (myCompetitionArea.co_province == res[0].regeocodeData.addressComponent.province
                && myCompetitionArea.co_city_three == res[0].regeocodeData.addressComponent.city
                && myCompetitionArea.co_area == res[0].regeocodeData.addressComponent.district) {
                let multiple = Number(myCompetitionArea.co_integral_multiple)
                that.setData({
                  "judge.gameState": true,
                  "control.areaMultiple": multiple
                })
                competitionArea = myCompetitionArea.co_area
              }
              break;
          }
        }
        fnc(res)
        app.log('getArea.success', res[0])
      },
      fail: function(res) {
        // console.log(res);
      }
    })
  },
  /**
   * 获取活动区域
   * 
   * @return Boolean 是否是活动区域
   */
  areaJudge(fnc = ()=>{} ) {
    const that = this
    let request = {
      name: 'areaJudge()',
      url: app.API.GET.COMPETITIONININFO,
      method: 'GET',
      success: function(res) {
        that.setData({
          chinaCompetitionArea : res.data.errdata
        })
        fnc()
      }
    }
    app.reQuest(request,that)
  },

  /**
   * 
   */

  /**
   * 获取坐标
   * 
   * @param fnc success执行方法
   * @return coordinates: Object
   */
  getLocation(fnc = () => {}) {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        res.longitude = Number(res.longitude.toFixed(6))
        res.latitude = Number(res.latitude.toFixed(6))

        // app.log('getLocation',res)

        fnc(res)
        return res
      }
    })
  },
  /**
   * 设置坐标
   * 
   * @param res:any 坐标
   */
  setMark(res) {
    const that = this
    const points = that.data.polyline[0].points
    let newCoor = {
      latitude: res.latitude,
      longitude: res.longitude
    }

    // dev
    points.push(newCoor)
    that.setData({
      'polyline[0].points': points,
    })
    // app.log('setMark1', that.data.polyline[0].points)
    // app.log('setMark2', points)
  },

  /**
   * 获取距离
   * @param newCoordinates: Object{
   *    latitude,
   *    longitude
   * }
   * @return 距离单位为米
   */
  getDistance(newCoordinates) {
    const that = this
    const oldPolyline = that.data
    const oldCoordinates = {
      latitude: oldPolyline.latitude,
      longitude: oldPolyline.longitude
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
    return Number(s.toFixed(3))
  },
  /**
   * 速度判断,返回秒速
   * 
   * @param distance:Number 
   * @return speed: Number
   */
  getSpeed(distance) {
    const that = this
    let time = that.data.control.interval / 1000.000
    let speed = distance / time
    return Number(speed.toFixed(3))
  },
  /**
   * 格式化总路程,单位为小数点后三位的千米
   * 
   * @param distance: number
   * @return Journey: String
   */
  getJourney(distance) {
    const that = this
    return (distance / 100).toFixed(3)
  },

  /**
   * 时间函数
   * 
   * @return  String
   */
  setTime() {
    const that = this

    if (starRun == 0) {
      return
    }

    /** 输出时间格式化 */
    if (myTimes.countTooGetLocations = 500) {
      myTimes.countTooGetLocations = 0
      var times = date_format(myTimes.totalMicroSeconds);
      updateTime(times);
    }

    /** 从新规划路线
     * 正式环境为 300000 毫秒
     */
    if (myTimes.navigationStates > 30000 && searchState === true) {
      myTimes.navigationStates = 0
      that.route()
    }

    /** 根据函数运行事件判断是否需要重新读取
     * 正式环境为 1800000 毫秒
     */
    if (myTimes.areaTimes > 60000) {
      myTimes.areaTimes = 0
      that.getArea()
    }

    /**
     * 是否执行运动事件
     */
    if (myTimes._myRun > 5000) {
      myTimes._myRun = 0
      run()
    }

    // /**
    //  * 是否执行改变状态事件
    //  * 
    //  * 注意传参
    //  */
    // if (myTimes._myState > setTimeMyState*2) {
    //   myTimes._myState = 0
    //   that.getState(setTimeMyState*2 / 1000)
    // }

    /**
     * 是否执行设置路标事件
     */
    if (myTimes._mySetmark > 10000) {
      myTimes._mySetmark = 0
      let location = {
        latitude: that.data.latitude,
        longitude: that.data.longitude
      }
      if (!searchState) {
        console.log(`setMark触发了`)
        that.setMark(location)
      }
    }

    setTimeout(function() {
      // myTimes.countTooGetLocations += 100;
      // myTimes.totalMicroSeconds += 100;
      // myTimes.areaTimes += 100
      // myTimes.navigationStates += 100
      // myTimes._myRun += 100
      // myTimes._myState += 100
      let keys = Object.keys(myTimes)
      for (let key of keys) {
        myTimes[key] += 100
      }
      that.setTime();
    }, 100)


    /**
     * 更新时间
     * 
     * @param time:String 格式化后的时间
     */
    function updateTime(time) {
      that.setData({
        time: time,
      })
    }

    /** 
     * 时间格式化输出，如03:25:19 86。每10ms都会调用一次
     * 
     * @param micro_second 运行总时间
     * @return time:String 格式化后的时间
     */
    function date_format(micro_second) {

      function fill_zero_prefix(num) {
        return num < 10 ? "0" + num : num
      }
      // 秒数
      var second = Math.floor(micro_second / 1000);
      // 小时位
      var hr = Math.floor(second / 3600);
      // 分钟位
      var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
      // 秒位
      var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;


      return hr + ": " + min + ": " + sec + " ";
    }

    /**
     * 运动事件
     */
    function run() {
      that.getLocation(success) //获取坐标
      function success(location) {
        let test = { //test getDistance的测试数据
          latitude: that.data.latitude + 0.0005,
          longitude: that.data.longitude + 0.0005
        }
        location = test
        

        let distance = that.getDistance(location) //获取距离 米
        // let speed = that.getSpeed(distance) //获取速度 秒速
        // let state = that.stateJudge(speed) //获得状态 
        let integra = that.getIntegral(distance) //获得积分 

        stateJournye += distance


        let setTimeMyState = 10000
        /**
         * 是否执行改变状态事件
         * 
         * 注意传参
         */
        if (myTimes._myState > setTimeMyState ) {
          myTimes._myState = 0
          that.getState(setTimeMyState / 1000)
        }

        let updateIntegration = Number((that.data.updateIntegration + integra /1000).toFixed(3)) //需上传积分
        let integration = (Number(that.data.integration) + integra / 1000).toFixed(3) //展示积分
        let journey = (Number(that.data.journey) + distance / 1000).toFixed(3) //展示路程
        console.log(`distance = ${distance} integra = ${integra}`)
        // if (!searchState) {
        //   console.log(`setMark触发了`)
        //   that.setMark(location)
        // }
        that.setData({
          latitude: location.latitude,
          longitude: location.longitude,
          integration: integration,
          updateIntegration: updateIntegration,
          journey: journey
        })
      }
    }
  }

})



//**************************** 之前人写的
// getLocation: function() {
//   var that = this
//   wx.getLocation({

//     type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
//     success: function(res) {
//       console.log("res----------")
//       console.log(res)

//       //make datas 
//       var newCover = {
//         latitude: res.latitude,
//         longitude: res.longitude,
//         iconPath: '../../img/redPoint.png',
//       };
//       var orimarkers = that.data.markers;

//       console.log("oriMeters----------")
//       console.log(oriMeters);
//       var len = orimarkers.length;
//       var lastCover;
//       if (len == 0) {
//         orimarkers.push(newCover);
//       }
//       len = orimarkers.length;
//       var lastCover = orimarkers[len - 1];

//       console.log("orimarkers----------")
//       console.log(orimarkers, len);

//       var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;

//       if (newMeters < 0.0015) {
//         newMeters = 0.0;
//       }

//       oriMeters = oriMeters + newMeters;
//       console.log("newMeters----------")
//       console.log(newMeters);


//       var meters = new Number(oriMeters);
//       var showMeters = meters.toFixed(2);

//       orimarkers.push(newCover);

//       that.setData({
//         latitude: res.latitude,
//         longitude: res.longitude,
//         markers: orimarkers,
//         meters: showMeters,
//       });
//     },
//   })
// },