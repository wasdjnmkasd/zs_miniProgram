const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    activeId: 1,
    first: null,
    tagId: null,
    firstName: '所有分类',
    tagName: '所有标签'
  },
  showList: function(e){
    var that = this;
    var activeId_new = e.currentTarget.dataset.id;
    var activeId_old = that.data.activeId;
    if (activeId_new == activeId_old){
      that.setData({
        activeId: null
      });
    }else{
      that.setData({
        activeId: activeId_new
      });
    }
  },
  changeFirst: function(e){
    var that = this;
    var first_new = e.currentTarget.dataset.id;
    var industryName = e.currentTarget.dataset.industryname;
    var first_old = that.data.first;
    if (first_new == first_old){
      that.setData({
        first: null,
        firstName: '所有分类'
      })
    }else{
      that.setData({
        first: first_new,
        firstName: industryName
      })
    }
  },
  changeTagId: function(e){
    var that = this;
    var tagId_new = e.currentTarget.dataset.id;
    var tagName = e.currentTarget.dataset.tagname;
    var tagId_old = that.data.tagId;
    if (tagId_new == tagId_old) {
      that.setData({
        tagId: null,
        tagName: '所有标签'
      })
    } else {
      that.setData({
        tagId: tagId_new,
        tagName: tagName
      })
    }
  },
  chooseSure: function(){
    var that = this;
    var first = that.data.first;
    var tagId = that.data.tagId;
    var firstName = that.data.firstName;
    var tagName = that.data.tagName;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (first && tagId){
      prevPage.setData({
        first: first,
        tagId: tagId,
        firstName: firstName,
        tagName: tagName
      })
    } else if (first && !tagId) {
      prevPage.setData({
        first: first,
        tagId: null,
        firstName: firstName,
        tagName: tagName
      })
    } else if (!first && tagId) {
      prevPage.setData({
        first: null,
        tagId: tagId,
        firstName: firstName,
        tagName: tagName
      })
    } else if (!first && !tagId){
      prevPage.setData({
        first: null,
        tagId: null,
        firstName: firstName,
        tagName: tagName
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  chooseClear: function(){
    var that = this;
    that.setData({
      first: null,
      tagId: null,
      firstName: '所有分类',
      tagName: '所有标签'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getGoodsManageNavList(that);
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
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var first = prevPage.data.first || null;
    var tagId = prevPage.data.tagId || null;
    var firstName = prevPage.data.firstName || '所有分类';
    var tagName = prevPage.data.tagName || '所有标签';
    that.setData({
      first: first,
      tagId: tagId,
      firstName: firstName,
      tagName: tagName
    })
    wx.removeStorageSync('first');
    wx.removeStorageSync('tagId');
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