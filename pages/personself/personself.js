// pages/personself/personself.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:"",
    myRank:1,
    myIntegral:'100.000'
  
  },
  sellRank:function(e){
      console.log("用户要购买积分了");
      //获取用户是否授权登录过
      var userId = wx.getStorageSync('userId');
      //获取个人中心的信息
      wx.request({
        url: app.API.POST.CERTIFYURL,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: { user_id: userId },
        success: function (res) { 
          console.log(res);
          wx.requestPayment({ 
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'md5',
            'paySign': res.data.data.paySign,
            'success':function(res){
            },
            'fail':function(res){
            }
          })
        }
      })

  },
  setting:function(e){
     console.log("点击了设置")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户是否授权登录过
    var userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.navigateTo({
        url: '../login/login'
      })
    }; 
    if (userId){
      //获取个人中心的信息
      wx.request({
        url: app.API.POST.USERINDEX,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {user_id: userId },
        success: function (res) {
         console.log('下面是个人中心请求的数据');
          console.log(res);
          
        }
      })
    } 
   
  },
  toInfo:function(){
    wx.navigateTo({
      url: '../info/infoMess/infoMess'
    })
  },
  ranks:function(){
    wx.navigateTo({
      url: '../info/rank/rank'
    })
  },
  publish:function(){
    wx.navigateTo({
      url: '../info/publish/publish'
    })
  },
  suggestion:function(){
    wx.navigateTo({
      url: '../info/suggestion/suggestion'
    })
  },
  match: function () {
    wx.navigateTo({
      url: '../info/myMatch/myMatch'
    })
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
   this.setData({
     userinfo: app.globalData.userInfo
   })
   
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
    return {
      title: '微信小程365',
      desc: '最具人气的小程序365!',
      path: '/page/user?id=123'
    }
  }
})