// pages/login/login.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //（储存本地）
    testnum: "",//设置测试参数

    userInfo:{
      nickName:"",
      avatarUrl:'',
      gender:'',
      city:''
    },

    //用setStorage（储存本地）
    test: function () {
      var Num = this.data.testnum;
      wx.setStorage({//存储到本地
        key: "testNum",
        data: Num
      })
    },
    //用getStorageSync（获取本地缓存）
    onLoad: function (option) {
      var num = wx.getStorageSync('testNum');//wx.getStorageSync(key)，获取本地缓存
      this.setData({
        testnum: testnum
      })
    }
  
  },
  onGotUserInfo:function(e){
    var that=this;
   console.log(e);
    if (e.detail.errMsg =='getUserInfo:ok'){
      that.setData({
        userInfo: e.detail.userInfo
      });
      app.globalData.userInfo= e.detail.userInfo;
   }
    console.log(that.data.userInfo);
  //w微信授权登录


  wx.login({
    success:function(res){ 
      if (res.code) {
        //发起网络请求
        wx.request({
          url: app.API.API + '/login/index',
          method: 'POST',
          header: {
            'content-type': 'application/json'// 默认值
          },
          data: {
            code: res.code,
            appid: app.globalData.appid,
            secret: app.globalData.secret,
            us_name: that.data.userInfo.nickName,
            us_img: that.data.userInfo.avatarUrl,
            us_sex: that.data.userInfo.gender,
            us_city: that.data.userInfo.city,
          },
          success: function (res) {
            console.log(res.data);
            //如果成功就将相应的数据存储在storage里，同时跳转到个人中心
            wx.setStorageSync('userId', res.data.errData.id);
            wx.setStorageSync('ussecretKey', res.data.errData.us_safety_secret_key);

            // //储存信息到本地
            // wx.setStorage({
            //   key: "key",
            //   data: 'value'
            // })
            // // 获取本地信息.为了验证是否已获取用户信息
            // wx.getStorage({
            //   key: 'key',
            //   success: function (data) {
            //     console.log(data)
            //     console.log(11111111111)
            //   }
            // }) 
            wx.switchTab({
              //url: '../../pages/personself/personself',
              url: '/pages/index/index',
            })
          },
          fail: function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})