// pages/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerData:{
      imgs: [],
      indicatorDots: true,//是否显示面板指示点
      imgHeight: '340rpx',
      autoplay: true, //是否自动轮播
      interval: 5000, //自动切换时间间隔
      duration: 500, //滑动动画时长
      circular: true //	是否采用衔接滑动
    },
    imgHost: app.globalData.imgHost,
    footerData:{
      active: 1,
      shoppingCartCount: 0
    },
    goodsList_2:{
      currentPage: 1,
      numPerPage: 10
    },
    toTopShow: false,
    alertAdv: true
  },
  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        wx.navigateTo({
          url: res.result,
        })
      }
    })
  }, 
  search: function (e) {
    var that = this;
    var searchName = e.detail.value || 'swisse';
    wx.navigateTo({
      url: '/web/searchProduct/searchProduct?goodsName=' + searchName,
    })
  },
  getMoreData: function(){
    var that = this;
    var currentPage = that.data.goodsList_2.currentPage;
    var numPerPage = that.data.goodsList_2.numPerPage;
    var oldData = that.data.goodsListData_2 || [];
    var totalPages = that.data.goodsList_2.totalPages || 1000;
    var data = {
      upShelves: 1,
      currentPage: currentPage,
      numPerPage: numPerPage,
      pageType: 'index'
    }
    if (currentPage <= totalPages){
      app.getSearchListData(that, data, oldData);
      currentPage++;
      that.setData({
        'goodsList_2.currentPage': currentPage
      })
    }
  },
  defaultScroll: function(e){
    var top = e.detail.scrollTop;
    var that = this;
    if(top > 300){
      that.setData({
        toTopShow: true
      })
    } else {
      that.setData({
        toTopShow: false
      })
    }
  },
  toTop: function(){
    var that = this;
    that.setData({
      scrollHeight: 0
    });
  },
  toOpenStore: function () {
    var that = this;
    wx.navigateTo({
      url: '/separate/joinUs/joinUs',
    })
    that.setData({
      alertAdv: false
    })
  },
  alertAdvCancel: function(){
    var that = this;
    that.setData({
      alertAdv: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.shopDetailQuery(that);
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
    var data = {};
    app.getIndexData(that, data);
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
    var that = this;
    var shopId = app.globalData.shopId || 2;
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    return {
      title: that.data.shopInfoData.name,
      path: url + '?scene=shopId%3D' + shopId,
      imageUrl: ''
    }
  }
})