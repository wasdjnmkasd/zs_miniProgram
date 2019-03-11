const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData: {
      type: 'title',
      title: '我的订单',
      leftIcon: 'back',
      rightIcon: false
    },
    imgHost: app.globalData.imgHost,
    waitToPayNum: 0,
    waitSendNum: 0,
    waitReceiveNum : 0,
    numPerPage: 5,
    currentPage: 1,
    status: null,
    isEnd: true
  },
  watch: {
    status: function (newVal, oldVal){
      var that = this;
      var data = {
        numPerPage: that.data.numPerPage,
        currentPage: 1,
        status: newVal,
        type: 'getData'
      }
      that.setData({
        currentPage: 1,
        orderListData: null
      },function(){
        app.getOrderListData(that, data);
      });
    }
  },
  getMoreData: function () {
    var that = this;
    var currentPage = that.data.currentPage;
    var totalPages = that.data.totalPages;
    var numPerPage = that.data.numPerPage;
    var status = that.data.status;
    if (currentPage < totalPages){
      currentPage ++;
      var data = {
        numPerPage: numPerPage,
        currentPage: currentPage,
        status: status,
        type: 'getData'
      };
      if (that.data.status){
        data.status = status;
      }
      app.getOrderListData(that, data);
      that.setData({
        currentPage: currentPage,
        isEnd: false
      })
    }else{
      that.setData({
        isEnd: true
      })
    }
  },
  changeStatus: function(e){
    var that = this;
    var status = e.currentTarget.dataset.status;
    that.setData({
      status: status
    });
  },
  toOrderDetail: function(e){
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/web/orderDetail/orderDetail?orderId=' + orderId,
    })
  },
  toLogistics: function(e){
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/web/logistics/logistics?orderId=' + orderId,
    });
  },
  toDeleteOrder: function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var data = {
      orderId: orderId
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否删除订单',
      success: function (res) {
        if (res.confirm) {
          app.deleteOrder(that, data);
        }
      }
    })
  },
  toCloseOrder: function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var data = {
      orderId: orderId
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否关闭订单',
      success: function (res) {
        if (res.confirm) {
          app.closeOrder(that, data);
        }
      }
    })
  },
  toSureOrder: function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var data = {
      orderId: orderId
    }
    app.sureOrder(that, data);
  },
  toOrderPay: function (e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var data = {
      orderId: orderId
    }
    app.orderToPay(that,data);
  },
  getAllNum: function () {
    var that = this;
    var data1 = {
      numPerPage: 5,
      currentPage: 1,
      status: 0,
      type: 'getNumber'
    };
    var data2 = {
      numPerPage: 5,
      currentPage: 1,
      status: '1,2,3,4,5,11,12',
      type: 'getNumber'
    };
    var data3 = {
      numPerPage: 5,
      currentPage: 1,
      status: 6,
      type: 'getNumber'
    };
    app.getOrderListData(that, data1);
    app.getOrderListData(that, data2);
    app.getOrderListData(that, data3);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setWatcher(that);
    var status = options.status;
    var data = {
      numPerPage: that.data.numPerPage,
      currentPage: 1,
      status: status
    }
    if (status){
      that.setData({
        status: status
      })
    }
    app.shopDetailQuery();
    wx.hideLoading();
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
    that.getAllNum();
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