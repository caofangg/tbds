// pages/singup/singup/singup.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, 
    allData:[],
    heightCurrent:0,
    imgData:[
      "../../../img/p-1.png",
      "../../../img/p-2.png",
      "../../../img/p-3.png"
    ],
    myMsg: {
      userImg: "../../../img/yumao.png",
      username: "王五",
      usertype: "王者",
      userKm: "0.6",
      rank:2,
      userTm:"20小时50分"
      },
    dataRun:[
      {
        userImg:"../../../img/yumao.png",
        username:"张三",
        usertype:"王者",
        userKm:"0.6",
        rank: 1,
        userTm: "20小时50分"
      },
      {
        userImg: "../../../img/yumao.png",
        username: "王五",
        usertype: "王者12",
        userKm: "0.6",
        rank: 2,
        userTm: "20小时50分"
      },
      {
        userImg: "../../../img/yumao.png",
        username: "李二",
        usertype: "王者21",
        userKm: "0.6",
        rank: 3,
        userTm: "20小时50分"
      },
      {
        userImg: "../../../img/yumao.png",
        username: "赵四",
        usertype: "王者21",
        userKm: "0.6",
        rank: 4,
        userTm: "20小时50分"
      }
    ],//跑步
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    //获取用户是否授权登录过
    app.orAuth()
// 获取屏幕的宽高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          heightCurrent: res.screenHeight
        })
      }
    })
 

// 页面加载时请求数据
    // wx.request({
    //   url:"",
    //   data:{},
    //   method:"GET",
    //   success:function(){
    //      wx.hideToast()
    //   }
    // })
  },
  bindChange: function (e) {//滑动切换tab
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },  
  swichNav: function (e) {//点击tab切换 
    console.log(e.currentTarget.dataset.current);
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        "currentTab": e.currentTarget.dataset.current
      })
    }

    console.log(that.data.currentTab)
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