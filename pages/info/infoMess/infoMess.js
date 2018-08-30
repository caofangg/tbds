var bmap = require('../../../libs/bmap-wx.min.js');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: "",
    items: [
      { name: '男', value: '男',checked: 'true' },
      { name: '女', value: '女' },
    ],
    date:"1995-02-01",
    sex:1,
    phone:'',
    city:"",
    memberTimes:'2020-02-01',
    region: ['四川省', '成都市', '高新区'],
    customItem: '全部'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户的详细信息
    var userId = wx.getStorageSync("userId");
    console.log(userId);
    if (userId){
        wx.request({
          url: app.API.POST.USERINFO,
        })
    }

// 获取城市
    // var BMap = new bmap.BMapWX({
    //   ak: '4zPIQNLT0l0HTfXUBSO0ynjW8OU4DBWC'
    // });
    // var fail = function (data) {
    //   console.log('fail!!!!')
    // };
    // var success = function (data) {
    //   console.log('success!!!');
    //   var weatherData = data.currentWeather[0];
    //   weatherData = weatherData.currentCity;
    //   that.setData({
    //     city: weatherData
    //   });
    // }
    // BMap.weather({
    //   fail: fail,
    //   success: success
    // });


    wx.getUserInfo({
      success: function (res) {
        console.log("res", res);
        that.setData({
          userinfo: res.userInfo,
        })
      }
    })
  },
 


  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  goback:function(){
    wx.navigateBack();
  },
  saveMess:function(){
    var that = this;
    wx.request({
      url: "",
      data:{
        sex: that.data.sex,
        date: that.data.date,
        phone: that.data.phone,
        city: that.data.city

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        console.log(res)
      }
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