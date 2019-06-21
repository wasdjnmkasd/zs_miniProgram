const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    shopShowList: [
      {
        src: '/images/platform/shopPromotion/promotion_1.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_2.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_3.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_4.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_5.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_6.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_7.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_8.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_9.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_10.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_11.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_12.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_13.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_14.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_15.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_16.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_17.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_18.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_19.png',
      },
      {
        src: '/images/platform/shopPromotion/promotion_20.png',
      },
    ]
  },
  imageLoad: function (e) {
    var that = this;
    var shopShowList = that.data.shopShowList;
    var index = e.currentTarget.dataset.index;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = wx.getSystemInfoSync().windowWidth,
      viewHeight = viewWidth / ratio;
    shopShowList[index].width = viewWidth + 'px';
    shopShowList[index].height = viewHeight + 'px';
    that.setData({
      'shopShowList': shopShowList
    });
  },
  toFormList: function(){
    wx.navigateTo({
      url: '/separate/joinUs/joinUs',
    })
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