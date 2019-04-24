const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    showOngoing: false,
    type: 0,
    top: 0,
    bargainIndexData:{
      currentPage: 1,
      numPerPage: 20
    },
    userBargainData:{}
  },
  watch:{
    type: function (newVal, oldVal){
      var that = this;
      var userId = wx.getStorageSync('userId');
      clearInterval(app.globalData.timer);
      if (newVal == 0){
        that.setData({
          'bargainIndexData.currentPage': 1,
          'bargainIndexData.goodsList': null
        });
        var oldBargainIndexData = [];
        var data = {
          currentPage: 1,
          numPerPage: that.data.bargainIndexData.numPerPage
        };
        app.getBargainIndexData(that, data, oldBargainIndexData);
      } else if (newVal == 1) {
        if (userId) {
          var d = {
            start: 0
          }
          app.getUserBargainData(that, d);
          that.setData({
            showOngoing: false,
          })
        }
      }
    }
  },
  toBargain: function (e) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    if (!userId){
      var data = {
        type: 'wechat',
        status: 'index'
      };
      app.wxLogin(data);
      return;
    }
    var goodsRoleId = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if (type == 'create') {
      var userName = e.detail.userInfo.nickName;
      var userImg = e.detail.userInfo.avatarUrl;
      var data = {
        id: goodsRoleId,
        userName: userName,
        userImg: userImg
      };
      app.createBargainTeam(that,data);
    }else{
      wx.navigateTo({
        url: '/web/bargainGoodsDetail/bargainGoodsDetail?goodsRoleId=' + goodsRoleId,
      })
    }
  },
  toRebargain: function(e){
    var that = this;
    var goodsRoleId = e.currentTarget.dataset.id;
    var userName = e.detail.userInfo.nickName;
    var userImg = e.detail.userInfo.avatarUrl;
    var data = {
      id: goodsRoleId,
      userName: userName,
      userImg: userImg,
      where: 'list'
    };
    app.rebargainTeam(that, data);
  },
  toOdrders: function(){
    wx.navigateTo({
      url: '/web/orderList/orderList?status=null',
    })
  },
  tabChange: function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    var userId = wx.getStorageSync('userId');
    if (type == 1 && !userId){
      var data = {
        type: 'wechat',
        status: 'index'
      };
      app.wxLogin(data);
    }
    if(type != that.data.type){
      that.setData({
        type: type,
        top: 0
      });
    }
  },
  getMoreData: function(){
    var that = this;
    var type = that.data.type;
    var currentPage, numPerPage,totalPages;
    if(type == 0){
      var oldBargainIndexData = that.data.bargainIndexData.goodsList;
      currentPage = that.data.bargainIndexData.currentPage;
      numPerPage = that.data.bargainIndexData.numPerPage;
      totalPages = that.data.bargainIndexData.totalPages;
      if (currentPage < totalPages) {
        currentPage++;
        that.setData({
          'bargainIndexData.currentPage': currentPage
        });
        var data = {
          currentPage: currentPage,
          numPerPage: numPerPage,
        };
        app.getBargainIndexData(that, data, oldBargainIndexData);
      }
    }
  },
  getOngoingBarginList: function(){
    var that = this;
    var data = {
      start: 1
    }
    app.getUserBargainData(that, data);
    that.setData({
      showOngoing: true
    })
  },
  onLoad: function (options) {
    var that = this;
    app.setWatcher(that);
    wx.setNavigationBarTitle({
      title: '砍价低价拿'
    })
  },
  onReady: function () {
    var that = this;
    var type = that.data.type;
    var userId = wx.getStorageSync('userId');
    if (type == 0) {
      that.setData({
        'bargainIndexData.currentPage': 1,
        'bargainIndexData.goodsList': null
      },function(){
        var oldBargainIndexData = [];
        var data = {
          currentPage: that.data.bargainIndexData.currentPage,
          numPerPage: that.data.bargainIndexData.numPerPage
        };
        app.getBargainIndexData(that, data, oldBargainIndexData);
      });
    } else if (type == 1) {
      if (userId) {
        var d = {
          start: 0
        }
        app.getUserBargainData(that, d);
        that.setData({
          showOngoing: false,
        })
      }
    }
  },
  onShow: function () {
    var that = this;
    var type = that.data.type;
    var userId = wx.getStorageSync('userId');
    if(type == 0){
      var oldBargainIndexData = [];
      that.setData({
        'bargainIndexData.currentPage': 1,
        top: 0
      });
      var data = {
        currentPage: 1,
        numPerPage: that.data.bargainIndexData.numPerPage
      };
      app.getBargainIndexData(that, data, oldBargainIndexData);
    }else if(type == 1){
      if (userId){
        var d = {
          start: 0
        }
        app.getUserBargainData(that, d);
        that.setData({
          showOngoing: false,
        })
      }
    }
    app.shopDetailQuery(that);
  },
  onHide: function () {
    clearInterval(app.globalData.timer);
  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
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
  },
  onPageScroll:function(){
    this.$apply();
  }
})