// pages/issue/issueThing/issueThing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num:"1",
    tempFile:[],
    tempFilePaths:[],
    matchname:"",//赛事标题
    matchtype:"",//赛事主题
    matchLoad:"",//赛事路线
    matchtime:"",//赛事时间
    matchGuiZe:"",//赛事规则
    phone:""//联系号码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var time = new Date();
    that.setData({
      matchtime: time.getMonth() + 1+"月"
    })
    
  },
  bindDateChange: function (e) {//日期
    this.setData({
      matchtime: e.detail.value
    })
  },
  getName(e){
    this.setData({
      matchname: e.detail.value
    })
  },
  getType(e){
    this.setData({
      matchtype: e.detail.value
    })
  },
  getPath(e){
    this.setData({
      matchLoad: e.detail.value
    })
  },
  getGuize(e){
    this.setData({
      matchGuiZe: e.detail.value
    })
  },
  getNumber(e) {
    this.setData({
      phone: e.detail.value
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
  chooseImage() {
    // var tempFilePaths;
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths:res.tempFilePaths
        })
        // tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        if (that.data.tempFilePaths.length>0){
          that.setData({
            _num:2
          })
        }
        
        // 设置数据
        that.setData({
          tempFile:that.data.tempFilePaths,
        });



      }
    });
  },
  viewImg(){
// 获取图片路径
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: this.data.tempFilePaths, // 需要预览的图片http链接列表
        });
  },
  sureissue(){
    if (this.data.matchname == "" || this.data.matchtype == "" || this.data.matchtype == "" || this.data.matchLoad == "" || this.data.matchtime == "" || this.data.matchGuiZe == "" || this.data.phone == ""){
      this.showModal();
  }else{
      this.keepMessage();
  } 
  },
  showModal(){
    wx.showModal({
      title: '温馨提示',
      content: '信息未填完整，请继续完善信息',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
        } else {
          wx.showToast({
            title: '已取消发布',
            icon: 'success',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  keepMessage(){//发送请求保存数据
  var that = this;
    wx.request({
      url: "",
      data:{
        tempFilePaths: [],
        matchname: "",//赛事标题
        matchtype: "",//赛事主题
        matchLoad: "",//赛事路线
        matchtime: "",//赛事时间
        matchGuiZe: "",//赛事规则
        phone: ""//联系号码
      },
      method:"",
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
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
    return {
      title: '微信小程365',
      desc: '最具人气的小程序365!',
      path: '/page/user?id=123'
    }
  }
})