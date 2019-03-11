const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData: {
      type: 'title',
      title: '订单详情',
      leftIcon: 'back',
      rightIcon: false
    },
    imgHost: app.globalData.imgHost
  },
  toOrderPay: function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var data = {
      orderId: orderId
    }
    app.orderToPay(that, data);
  },
  toLogistics: function(e){
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/web/logistics/logistics?orderId=' + orderId,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    var data = {
      numPerPage: 5,
      currentPage: 1,
      orderId: orderId,
      type: 'getData'
    }
    app.getOrderListData(that, data);
    app.shopDetailQuery();
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

  }
})