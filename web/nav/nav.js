// web/nav/nav.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTotalData: {},
    navRightData: {},
    firstActive: '',
    headerData: {
      type: 'search',
      leftIcon: 'scan',
      rightIcon: 'news'
    },
    footerData: {
      active: 2,
      shoppingCartCount: 0
    }
  },
  
  chooseItem: function (e) {
    var that = this;
    var firstActive = e.currentTarget.id;
    var navTotalData = that.data.navTotalData;
    for (var i = 0; i < navTotalData.length; i++) {
      if (navTotalData[i].id == firstActive) {
        that.setData({
          navRightData: navTotalData[i].dictList,
          firstActive: firstActive
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = {};
    app.getNavData(that, data);
    app.shopDetailQuery();
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideTabBar({});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      app.getShoppingCartCount(that, {});
    } else {
      that.setData({
        'footerData.shoppingCartCount': 0
      });
    }
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