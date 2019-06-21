const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost
  },
  locationTo: function(){
    wx.navigateTo({
      url: '/web/saleMoney-4-1/saleMoney-4-1',
    })
  },
  touchstart: function (e) {
    var that = this;
    var allData = that.data.bankListData;
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      bankListData: allData
    })
  },
  touchmove: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;//当前索引
    var startX = that.data.startX;//开始X坐标
    var startY = that.data.startY;//开始Y坐标
    var touchMoveX = e.changedTouches[0].clientX;//滑动变化坐标
    var touchMoveY = e.changedTouches[0].clientY;//滑动变化坐标
    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });//获取滑动角度
    var allData = that.data.bankListData;
    allData.forEach(function (v, i) {
      v.isTouchMove = false;
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) { return }
      if (i == index) {
        if (touchMoveX > startX) {
          v.isTouchMove = false;  //右滑
        } else {
          v.isTouchMove = true;   //左滑
        }
      }
    })
    //更新数据
    that.setData({
      bankListData: allData
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  bankDelete: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var data = {
      id: id
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否确认删除该银行卡？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          app.deleteBank(that, data);
        }
      }
    })
  },
  chooseCardBank: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var isChoose = that.data.isChoose;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (isChoose){
      prevPage.setData({
        cardBankId: id
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.isChoose){
      that.setData({
        isChoose: true
      })
    }
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
    var that = this;
    app.getBankListData(that);
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

  }
})