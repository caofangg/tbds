// pages/info/suggestion/suggestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意见反馈',
    });
  },
  
  saveSugge:function(){
    wx.request({
      url: 'test',
      method: 'post',
      success: successFc(),
      fail: function(){
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  bindsave:function(e){
    this.setData({
      value: e.detail.value
    })
  },

  successFc: function(){
    wx.showToast({
      title: '成功',
      icon: 'succes',
      duration: 1000,
    })
    setTimeout(function () {
      wx.navigateBack();
    }, 1500)
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
    return {
      title: '微信小程365',
      desc: '最具人气的小程序365!',
      path: '/page/user?id=123'
    }
  }
})