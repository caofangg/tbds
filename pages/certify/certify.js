// certify.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  
  },


  setCertify: function (e) {
    console.log("用户要认证了"); 
    var userId = wx.getStorageSync('userId'); 
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
          'success': function (res) {
          },
          'fail': function (res) {
          }
        })
      }
    })

  }

})