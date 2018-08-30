//index.js
//获取应用实例
const app = getApp()
/**address:
 * motto: String
 * userInfo: Object
 * hasUserInfo: Boolean
 * img: { imgUrls: string; index: number; }[]   轮播框图片
 * swiper: { indicatorDots: boolean; autoplay: boolean; interval: number; duration: number; }  轮播框设置
 * hotmatch: { name: string; imgsrc: string; address: string; id: number; }[]  热门赛事
 * dao: { url: string; src: string; text: string; id:number}[]  图标
 * message: { text: string; id: number; }[]  消息
 */
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiper: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
    },
    img: [],
    dao: [],
    hotmatch: [],
    message: [{
      text: '恭喜XX获得第一名',
      id: 0
    }, {
        text: '恭喜XX获得第二名',
      id: 1
    },{
        text: '恭喜XX获得第三名',
      id: 2
    }]
  },

  onLoad: function() {
    const that = this
    that.setUser()
    wx.showLoading({
      title: '拼命加载中',
    })

    console.log("默认更新一下认证状态");
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: app.API.POST.CERTIFYUPDATEURL,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: { user_id: userId },
      success: function (res) {
        console.log(res); 
      }
    })

    wx.request({
      url: app.API.POST.CERTIFYCHECKURL,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {user_id: userId },
      success: function (res) {
        console.log(res);
        if (!res.data.errCode){
          //如果没有缴纳报名费
          wx.showModal({
            title: '提示',
            content: '加入我们,获得更多特权!',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo({
                  url: '../certify/certify',
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          })
        }
      }
    })

  
  },

  onReady: function() {
    const that = this
    // wx.request({
    //   url: app.API.GET.HOMEINDEX,
    //   success: function(res){
    //     console.log(`onReady-----------`)
    //     console.log(res)
    //   }
    // })
    that.initializationData()
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
  },

  /**
   * 转发监听
   */
  onShareAppMessage: function() {
    console.log("==============");
    return {
      title: '微信小程365',
      desc: '最具人气的小程序365!',
      path: '/page/user?id=123'
    }
  },

  /**
   * 初始化数据
   */
  initializationData: function() { 
    const that = this
    let address = {
      name: '首页',
      url: app.API.GET.HOMEINDEX,
      method: 'GET',
      success: function(res) {
        console.log('index.ini()开始----------')
        let img = that.getValues(imgs, res.data.errData.ban)
        let hotmatch = that.getValues(hotmatchs, res.data.errData.hot)
        let dao = that.getValues(daos, res.data.errData.dao)
        that.setData({
          img: img,
          hotmatch: hotmatch,
          dao: dao
        })
        console.log(res)
        console.log(that.data.hotmatch)
        console.log(res.data.errData.dao)

      }
    }
    app.reQuest(address)

    function imgs(value) {
      console.log('img start----------------')
      let img={}

      img.imgUrls = app.API.URL + value.ba_img.replace(/\\/g, "/")

      img.index = value.id
      console.log(img.imgUrls)
      return img
    }
    //homathc
    function hotmatchs(value) {
      console.log('homathc start----------------')
      let hotmatch={}
      hotmatch.name = value.co_theme
      hotmatch.imgsrc = app.API.URL + value.co_img[0].replace(/\\/g, "/")
      hotmatch.address = value.co_city
      hotmatch.id = value.id
      return hotmatch
    }
    //dao
    function daos(value) {
      console.log('list start----------------')
      let dao={}
      dao.src = app.API.URL + value.hpn_icon.replace(/\\/g, "/")
      dao.url = value.id
      dao.id = value.id
      dao.text = value.hpn_link
      return dao
    }
    //message
    function message(value) {
      console.log('message start----------------')
      let message
      img.imgUrls = value.ba_img
      img.index = value.id
      that.data.img.push(img)
    }
  },

  /**
   * tem: 赋值方法
   * option: 后台数据
   */
  getValues: function(tem, option) {
    let pushObj = []
    for (let value in option) {
      pushObj.push(tem(option[value]))
    }
    return pushObj
  },
  /**
   * 获取用户信息
   */
  setUser: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  
 
})