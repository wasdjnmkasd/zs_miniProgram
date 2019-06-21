const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    numPerPage: 20
  },

  getMoreData: function(){
    var that = this;
    var currentPage = that.data.currentPage;
    var numPerPage = that.data.numPerPage;
    var totalPages = that.data.totalPages;
    var oldData = that.data.rebateListData;
    if (currentPage < totalPages) {
      currentPage++;
      that.setData({
        currentPage: currentPage
      })
      var data = {
        currentPage: currentPage,
        numPerPage: numPerPage
      }
      app.getRebateListData(that, data, oldData);
    }
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
    var that = this;
    var data = {
      currentPage: 1,
      numPerPage: 20
    }
    app.getRebateListData(that, data);
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