const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData: {
      type: 'search', 
      leftIcon: 'scan',
      rightIcon: 'news'
    },
    currentPage: 1,
    footerData: {
      shoppingCartCount: 0
    }
  },
  getShoppingCartCount: function(e){
    var that = this;
    that.setData({
      'footerData.shoppingCartCount': e.detail.val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var host = app.globalData.host;
    var centerId = app.globalData.centerId;
    var data = {
      currentPage: that.data.currentPage,
      numPerPage: 10
    };
    var oldData = that.data.searchListData || [];
    if (options && options.goodsName){
      that.setData({
        ['headerData.searchData']: options.goodsName
      });
      data.goodsName = options.goodsName;
    }
    if (options && options.firstCategory) {
      data.firstCategory = options.firstCategory;
    }
    if (options && options.secondCategory) {
      data.secondCategory = options.secondCategory;
    }
    if (options && options.thirdCategory) {
      data.thirdCategory = options.thirdCategory;
    }
    if (options && options.upShelves) {
      data.upShelves = options.upShelves;
    }
    if (options && options.type) {
      data.type = options.type;
    }
    if (options && options.tag) {
      data.tag = options.tag;
    }
    app.getSearchListData(that, data, oldData);
    that.setData({
      'searchListData.requestData': data
    });
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