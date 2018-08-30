// pages/yuesai/yueDetail/yuedetail.js
Page({

  /**
   * 页面的初始数据
   */

shi:function (){

},


  data: {
    imgUrls: [//轮播数据
      '../../../img/s-banner1.png',
      '../../../img/s-banner1.png',
      '../../../img/s-banner1.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    alldata:[
      {
        matchname:"青城山",
        matchtype:"跑步",
        matchpath:"青城山脚下----青城山上",
        matchtime:"2018-1-12",
        matchGuiZe:"赛事规则赛事规则赛事规则赛事规则赛事规则赛事规则赛事规则赛事规则赛事规则",
        matchstuats:"0",//报名状态  模拟 0 现在不能报名 1 现在可以报名
        contactNumber:"17808323874",
        startTime: "2018-08-01 15:02",
        endTime: "2018-08-02 15:02"
      }
    ]//获取的数据
  },
  getContactNum(e){//拨打对方联系号码
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.number
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000,
      mask: true
    });


//页面加载时，数据赋值,利用传过来的id
    wx.request({
      url: "",
      data:{
        id:options.id
      },
      method:"get",
      success:function(res){
        that.setData({
          alldata:res.data,
          imgUrls: res.data.url
        })

        // hide
        wx.hideToast();
      }
    })
    
  },
  sureorder(){//报名
  var that = this;
  if (that.data.alldata[0].matchstuats=="0"){//不能报名
    this.showfail();
  } else if (that.data.alldata[0].matchstuats=="1"){//可以报名
    this.showModal();
    // 存在数据库
    // wx.request({
    //   url: "",
    //   data:"",
    //   success:function(){

    //   }
    // })
  }
    

  },
  showModal(){//提示成功
    wx.showToast({
      title: '成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    });
    setTimeout(function () {
      wx.navigateBack();
    }, 2000)
  },
  showfail(){//条件不足
    wx.showModal({
      title: '提示',
      content: '报名时间有误，暂时不能报名',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          setTimeout(function () {
            wx.navigateBack();
          }, 2000)
        }
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