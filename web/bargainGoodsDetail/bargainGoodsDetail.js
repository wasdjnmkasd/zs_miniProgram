const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    nextHour: '00',
    nextMinute: '00',
    nextSecond: '00',
    alertShow: false,
    isShare: false,
    bargainDesc: ['砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老', '砍砍砍，轻轻松松', '一刀暴击，简简单单', '感情厚，砍到够', '看我宝刀未老']
  },
  watch:{
    bargainData: function(newVal, oldVal){
      var that = this;
      var createTime = newVal.createTime;
      createTime = Date.parse(createTime.replace(/-/g, '/'));
      var time = new Date(createTime).getTime();
      var dateTime = time + newVal.duration * 60 * 60 * 1000;
      var goodsRoleId = that.data.goodsRoleId;
      var localUserId = wx.getStorageSync('userId');
      if (newVal.userId == localUserId){
        that.setData({
          isShare: false
        });
      }else{
        that.setData({
          isShare: true
        });
      }
      var timer = setInterval(function () {
        var timestamp = Date.parse(new Date());
        if (timestamp > dateTime) {
          var data = {
            id: goodsRoleId
          }
          // app.closeBargainTeam(that,data);
          clearInterval(timer);
        } else {
          that.formatSeconds(dateTime * 1 - timestamp * 1);
        }
      }, 1000);
    }
  },
  formatSeconds: function (dateTime){
    var that = this;
    var secondTime = parseInt(dateTime) / 1000;
    var minuteTime = 0;
    var hourTime = 0;
    var nextHour = '00';
    var nextMinute = '00';
    var nextSecond = '00';
    if (secondTime >= 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime >= 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    if (parseInt(secondTime) < 10) {
      nextSecond = '0' + parseInt(secondTime);
    } else {
      nextSecond = parseInt(secondTime);
    }
    if (minuteTime < 10) {
      nextMinute = '0' + parseInt(minuteTime);
    } else {
      nextMinute = parseInt(minuteTime);
    }
    if (hourTime < 10) {
      nextHour = '0' + parseInt(hourTime);
    } else {
      if (hourTime >= 24) {
        nextHour = '00';
      } else {
        nextHour = parseInt(hourTime);
      }
    }
    that.setData({
      nextHour: nextHour,
      nextMinute: nextMinute,
      nextSecond: nextSecond
    });
  },
  showAlert: function(){
    var that = this;
    that.setData({
      alertShow: true
    });
  },
  cancelAlert: function(){
    var that = this;
    that.setData({
      alertShow: false
    });
  },
  helpBargain: function (e) {
    var that = this;
    var goodsRoleId = that.data.goodsRoleId;
    var userId = wx.getStorageSync('userId');
    if (!userId){
      var d = {
        type: 'wechat',
        status: 'goods',
        id: 'goodsRoleId'
      }
      app.wxLogin(d);
      return;
    }
    var userName = e.detail.userInfo.nickName;
    var userImg = e.detail.userInfo.avatarUrl;
    var data = {
      id: goodsRoleId,
      userName: userName,
      userImg: userImg
    };
    app.helpBargain(that, data);
  },
  toBargian: function(){
    wx.redirectTo({
      url: '/web/bargainIndex/bargainIndex',
    })
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
      where: 'detail'
    };
    app.rebargainTeam(that, data);
  },
  bargainBuy: function(){
    var that = this;
    var itemId = that.data.bargainData.itemId;
    var data = {
      itemId: itemId
    };
    app.bargainBuy(that, data);
  },
  toIndex: function(){
    wx.switchTab({
      url: '/web/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f02425',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    wx.setNavigationBarTitle({
      title: '砍价低价拿',
    })
    if (options && options.goodsRoleId){
      var data = {
        id: options.goodsRoleId
      }
      app.getBarginGoodsDetailData(that,data);
      that.setData({
        goodsRoleId: options.goodsRoleId
      });
    }
    if (options.scene){
      var scene = decodeURIComponent(options.scene);
      var goodsRoleId = null;
      var isShare = false;
      var sceneArr = scene.split('&');
      sceneArr.forEach(function (v, i) {
        if (v.split('=')[0] == 'goodsRoleId') {
          goodsRoleId = v.split('=')[1];
        }
        if (v.split('=')[0] == 'isShare') {
          if (v.split('=')[1] == true || v.split('=')[1] == 'true'){
            isShare = true;
          }else{
            isShare = false;
          }
        }
      });
      that.setData({
        isShare: isShare
      });
      if (goodsRoleId) {
        var data = {
          id: goodsRoleId
        }
        app.getBarginGoodsDetailData(that, data);
        that.setData({
          goodsRoleId: goodsRoleId
        });
      } else {
        wx.switchTab({
          url: '/web/index/index',
        })
      }
    }
    app.setWatcher(that);
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
    var that = this;
    var goodsName = that.data.bargainData.goodsName;
    var goodsRoleId = that.data.goodsRoleId;
    var desc = that.data.bargainData.desc;
    return {
      title: goodsName,
      desc: desc,
      path: 'web/bargainGoodsDetail/bargainGoodsDetail?scene=isShare%3Dtrue%26goodsRoleId%3D' + goodsRoleId
    }
  }
})