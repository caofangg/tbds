//app.js

const amapFile = require('libs/amap-wx.js')
const config = require('libs/config.js')
const myAmapFun = new amapFile.AMapWX({ key: config.Config.key })

App({
  onLaunch: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // let res = {
        //   name: 'login',
        //   data: res,
        //   url: this.globalData.api.POST.USERINDEX,
        //   method: 'POST'
        // }
        // res = this.reQuest(this.globalData.api.POST.USERINDEX)
        // console.log(res)
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo,
            this.globalData.Mess = [];
            console.log(res);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          },
          fail: () => {
            // throw Error('getUserInfo错误')
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    appid: 'wx95233ad7f199f8ad',
    secret: '7345b2c8df31c41fef2b7ed929595401'
  },


  API: {
    API: 'https://www.yd365.net/api/',
    URL: 'https://www.yd365.net/',
    GET: {
      HOMEINDEX: 'https://www.yd365.net/api/home/index',
      COMPETITIONBANNER: 'https://www.yd365.net/api/competition/banner',
      COMPETITIONININFO: 'https://www.yd365.net/api/foot/competition_info'  
    },
    POST: {
      COMPETITIONINDEX: 'https://www.yd365.net/api/competition/index',
      COMPETITIONDETAIL: 'https://www.yd365.net/api/competition/competition_detail',
      USERINDEX: 'https://www.yd365.net/api/user/index',
      USERINFO: 'https://www.yd365.net/api/user/information',
      USERUPDATE: 'https://www.yd365.net/api/user/information_update',
      COMPETITIONINTEGRAL: 'https://www.yd365.net/api/foot/increase_integral',
      CERTIFYURL:'https://www.yd365.net/api/pay/pre_certify',
      CERTIFYCHECKURL: 'https://www.yd365.net/api/certify/check',
      CERTIFYUPDATEURL: 'https://www.yd365.net/api/certify/update',
    }
  },
  /**
   * 获取接口
   * address{
   *  name: string,
   *  url: string,
   *  method: GET||POST
   *  [,
   *    data: Object/String/ArrayBuffer,
   *    header: Object,
   *    dataType: String,
   *    responseType: String,
   *    success: Function
   *    fail: Function(),
   *    complete: Function(),
   *    any: any
   *  ]
   * }
   * 
   * @return false || res: Object
   */
  reQuest: function (address, that = this, retransmission = false) {
    let _message
    let _address = {}
    //optional
    if (!retransmission) {
      optional()
    } else {
      _address = address
    }
    wx.request({
      url: _address.url,
      method: _address.method,
      data: _address.data,
      header: _address.header,
      dataType: _address.dataType,
      responseType: _address.responseType,
      success: function(res) {
        _address.success(res, that)
      },
      fail: function() {
        _address.fail()
        wx.showModal({
          title: _address.name + '获取信息失败',
          content: '是否重新发送',
          confirmText: '重新发送',
          success: function(data) {
            if (data.confirm) {
              this.reQuest(_address, that, true,)
            } else {
              throw Error(' 拒绝操作 ')
            }
          },
          complete: function() {
            _message = false
          }
        })
      },
      complete: function() {
        _address.complete()
      }
    })

    function optional() {
      _address.name = address.name
      _address.url = address.url
      _address.method = address.method
      _address.data = address.data || ''
      _address.header = address.header || {}
      _address.dataType = address.dataType || 'json'
      _address.responseType = address.responseType || 'text'
      _address.success = address.success || function() {}
      _address.fail = address.fail || function() {}
      _address.complete = address.complete || function() {}
      initializeMethod()
    }

    function initializeMethod() {
      if (!_address.method || _address.method === 'GET' || _address.method === 'get') {
        _address.method = 'GET'
      } else if (_address.method === 'post' || _address.method === 'POST') {
        _address.method = 'POST'
        _address.data.ir_user_id = wx.getStorageSync('userId');  //正式环境换成获取Storage中的用户id
      } else {
        throw Error('reQuest() method参数错误 ')
      }
    }
  },

  orAuth: function() {
    var userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.navigateTo({
        url: '../login/login'
      })
    };
  },

  /**
   * console.log函数
   *
   * @param fnc:String 所在函数
   * @param res:any 需要打印的参数
   */
  log(fnc, res) {
    function reslog(res) {
    //   let resType = Object.prototype.toString.call(res)
    //   switch (resType) {
    //     case "[object Array]":
    //       for (let index in res) {
    //         reslog(res[value])
    //       }
    //       return
    //     case "[object Object]":
    //       Object.keys(res)
    //       for (let value of res) {
    //         reslog(res[value])
    //       }
    //       return
    //     default:
    //       console.log(res)
    //   }
      console.log(res)
    }
    if(res)
      reslog(res)
    console.log(`------ ${fnc} end ------`)
  }
})