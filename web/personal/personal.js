const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // headerData: {
    //   type: 'title',
    //   title: '个人中心',
    //   leftIcon: false,
    //   rightIcon: false
    // },
    footerData: {
      active: 4,
      shoppingCartCount: 0
    },
    imgHost: app.globalData.imgHost,
    alertContentShow: true
  },
  toLoginChoose: function(){
    wx.navigateTo({
      url: '/web/loginChoose/loginChoose',
    })
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
  toOrderList: function(e){
    var url = e.currentTarget.dataset.url;
    var userId = wx.getStorageSync('userId');
    if (userId){
      wx.navigateTo({
        url: url,
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '您尚未登录，是否登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/web/loginChoose/loginChoose',
            })
          }
        }
      })
    }
  },
  toAddressManage: function(e){
    var url = e.currentTarget.dataset.url;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      wx.navigateTo({
        url: url,
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您尚未登录，是否登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/web/loginChoose/loginChoose',
            })
          }
        }
      })
    }
  },
  toPersonalInfo: function(e){
    var url = e.currentTarget.dataset.url;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      wx.navigateTo({
        url: url,
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您尚未登录，是否登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/web/loginChoose/loginChoose',
            })
          }
        }
      })
    }
  },
  toCustomerService: function(e){
    var url = e.currentTarget.dataset.url;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      wx.navigateTo({
        url: url,
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您尚未登录，是否登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/web/loginChoose/loginChoose',
            })
          }
        }
      })
    }
  },
  toScan: function(e){
    var url = e.currentTarget.dataset.url;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      wx.navigateTo({
        url: url,
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您尚未登录，是否登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/web/loginChoose/loginChoose',
            })
          }
        }
      })
    }
  },
  alertContentHide: function(){
    var that = this;
    that.setData({
      alertContentShow: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    app.shopDetailQuery(that);
    if (!userId){
      that.setData({
        alertContentShow: true
      });
    }else{
      that.setData({
        alertContentShow: false
      });
    }
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
    var host = app.globalData.host;
    var userId = wx.getStorageSync('userId');
    if (userId){
      that.setData({
        isLogin: app.globalData.isLogin
      });
      app.userDetailQuery(that, {});
      app.shopDetailQuery(that, {});
      app.getShoppingCartCount(that, {});
      that.getAllNum();
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