
//nowyue.js
//获取应用实例
const app = getApp()

/** 分页表变量*/
let _myPage = 1


// pages/yuesai/nowyue/nowyue.js
Page({
  /**
   * 页面的初始数据
   * imgUrls: stringArray
   * alldata: arrObject{
   *  matchname: string
   *  imgsrc: string
   *  ordertype: string
   *  startTime: string
   *  endTime: string
   *  orderlocation: string
   *  id: number
   * }
   */ 
  data:{
    imgUrls:[],
    alldata:[]
  },

  /** 获取banner图 */
  getBanner:function(){
    const that = this
    let data = {
      name: '赛事banner',
      url: app.API.GET.COMPETITIONBANNER,
      method: 'GET',
      success: function(res){
        that.setData({
          imgUrls: res.data
        })
      }
    }
  },
  
 /** 获取赛事数据 */
 getGamedata:function () { 
    wx.showLoading({
      title: '拼命加载中',
    })
    const that = this
    let address = {
      name: '赛事',
      url: 'https://www.yd365.net/api/competition/index',
      method: 'POST',
      header: {
        "Content-Type": "application/ x - www - form - urlencoded"

      },
      data: {
        page: _myPage
      }, 
      success: function (res) {
        that.setData({
          alldata: res.data.errData
        })
      }
    }
    app.reQuest(address)
  },

  getMusicInfo: function (message) {
    
    var that = this
    var data = {
      page: that.data.paging.page
    }
    network.requestLoading('https://route.showapi.com/213-1', data, message, function (res) {
      console.log(res)
      var contentlistTem = that.data.contentlist
      if (res.showapi_res_code == 0) {
        if (that.data.page == 1) {
          contentlistTem = []
        }
        var contentlist = res.showapi_res_body.pagebean.contentlist
        if (contentlist.length < that.data.pageSize) {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: false
          })
        } else {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: true,
            page: that.data.page + 1
          })
        }
      } else {
        wx.showToast({
          title: res.showapi_res_error,
        })
      }

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
  },
  goback: function() {
    wx.navigateTo({
      url: '../../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const that = this 
    that.getBanner()
    that.getGamedata()
    setTimeout(function() {
      wx.hideLoading();
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    _myPage += 1
    this.getMusicInfo('正在刷新数据')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getMusicInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

    return {
      title: '微信小程序联盟',
      desc: '最具人气的小程序开发联盟!',
      path: '/page/user?id=123'
    }
  },
  //跳转报名
  goSign: function(e) {
    wx.navigateTo({
      url: '../yueDetail/yuedetail?id=' + e.currentTarget.dataset.id,
    })
  },

  Error: function(e) {
    wx.showModal({
      title: '该比赛已经开始',
      content: '谢谢您的关注，还请选择其他赛事',
      showCancel: false,
      confirmText: '确认',
      confirmColor: '#000000'
    })
  }
})