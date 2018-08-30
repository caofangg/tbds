// pages/info/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: "",
    userMessage:[
      {
        imgNode:"../../../img/yumao.png",
        matchname:"羽毛球",
        matchPlace:"青城山",
        matchTime:"2017-6-9",
        time:"三分钟前",
        stauts:"已发布",
        id:"0"
      },
      {
        imgNode: "../../../img/yumao.png",
        matchname: "羽毛球",
        matchPlace: "青城山",
        matchTime: "2017-6-9",
        time: "2月8号",
        stauts: "未发布",
        id:"1"
      }
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log("res", res);
        that.setData({
          userinfo: res.userInfo,
        })
      }
    })
  },
  goback: function () {
    wx.navigateBack();
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