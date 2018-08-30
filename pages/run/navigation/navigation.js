// pages/navigation/navigation.js
const app = getApp()
const amapFile = require('../../../libs/amap-wx.js')
const config = require('../../../libs/config.js')
const myAmapFun = new amapFile.AMapWX({ key: config.Config.key })

/**
 * 搜索地点
 * 
 * @param address:Object
 * @see keywords:string 地点名, location:string "经度,纬度" city:number citycode success:function 需要执行的函数
 * 
 * @return address:objArray 
 * 地点信息
 */
function search(address){
  myAmapFun.getInputtips({
    keywords: address.keyword,
    location: address.location,
    city: address.city,
    success: function (data) {
      address.success(data)
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[]
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
    //dev
    // myAmapFun.getRegeo()

    //test
    myAmapFun.getRegeo({
      success: function (res) {
        wx.setStorageSync('addRess', res[0])
      },
      fail: function (res) {
        // console.log(res);
      }
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
  
  },
  goback: function(e){
    let location = {
      longitude: e.currentTarget.dataset.location.split(',')[0],
      latitude: e.currentTarget.dataset.location.split(',')[1]
    }
    wx.setStorageSync('search', location)
    wx.navigateBack({delta: 1})
  },


  bindinput: function (e) {
    // console.log(e)
  },
  bindconfirm:function(e){
    const that = this
    let city = wx.getStorageSync('addRess')
    let data = {
      keyword: e.detail.value,
      location: wx.getStorageSync('userLocation'),
      city: city.regeocodeData.addressComponent.citycode,
      success: function(data){
        that.setData({
          address: data.tips
        })
      }
    }
    search(data)
  }
})