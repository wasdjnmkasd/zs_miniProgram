const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData:{
      type: 'search',
      leftIcon: 'scan',
      rightIcon: 'news'
    },
    sexArr: ['男性','女性'],
    imgHost: app.globalData.imgHost,
    sexIndex: 0
  },
  bindSexChange: function (e) {
    var that = this;
    var sex = e.detail.value;
    var infoData = that.data.infoData;
    if (!infoData.userDetail){
      infoData.userDetail = {};
    }
    infoData.userDetail.sex = sex;
    this.setData({
      sexIndex: sex,
      infoData: infoData
    });
  },
  nickNameChange: function(e){
    var that = this;
    var val = e.detail.value;
    var infoData = that.data.infoData;
    if (!infoData.userDetail) {
      infoData.userDetail = {};
    }
    infoData.userDetail.nickName = val;
    that.setData({
      infoData: infoData
    });
  },
  nameChange:function(e){
    var that = this;
    var val = e.detail.value;
    var infoData = that.data.infoData;
    if (!infoData.userDetail) {
      infoData.userDetail = {};
    }
    if (!val){
      wx.showToast({
        title: '真实姓名不能为空',
        icon: 'none',
        duration: 1000
      })
    }
    infoData.userDetail.name = val;
    that.setData({
      infoData: infoData
    });
  },
  locationChange: function(e){
    var that = this;
    var val = e.detail.value;
    var infoData = that.data.infoData;
    if (!infoData.userDetail) {
      infoData.userDetail = {};
    }
    infoData.userDetail.location = val;
    that.setData({
      infoData: infoData
    });
  },
  idCodeChange: function(e){
    var that = this;
    var val = e.detail.value;
    var infoData = that.data.infoData;
    if (!infoData.userDetail) {
      infoData.userDetail = {};
    }
    var isTrue = (/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i).test(val);
    if (!isTrue){
      wx.showToast({
        title: '身份证号码有误',
        icon: 'none',
        duration: 1000
      })
    }
    infoData.userDetail.idNum = val;
    that.setData({
      infoData: infoData
    });
  },
  createInfo: function(){
    var that = this;
    var infoData = that.data.infoData;
    var userDetail = infoData.userDetail;
    var isTrue = (/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i).test(userDetail.idNum);
    var isOk = true;
    if (!userDetail){
      userDetail = {};
    }
    if (!userDetail.name){
      isOk = false;
      wx.showToast({
        title: '真实姓名不能为空',
        icon: 'none',
        duration: 1000
      })
    }
    if (!userDetail.idNum || !isTrue){
      isOk = false;
      wx.showToast({
        title: '身份证号码有误',
        icon: 'none',
        duration: 1000
      })
    }
    if (isOk){
      userDetail.headImg = '/images/platform/personal/headPortrait.jpg';
      app.createUserDetail(that, userDetail);
    }
  },
  saveInfo: function(){
    var that = this;
    var infoData = that.data.infoData;
    var userDetail = infoData.userDetail;
    var isTrue = (/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i).test(userDetail.idNum);
    var isOk = true;
    if (!userDetail) {
      userDetail = {};
    }
    if (!userDetail.name) {
      isOk = false;
      wx.showToast({
        title: '真实姓名不能为空',
        icon: 'none',
        duration: 1000
      })
    }
    if (!userDetail.idNum || !isTrue) {
      isOk = false;
      wx.showToast({
        title: '身份证号码有误',
        icon: 'none',
        duration: 1000
      })
    }
    if (isOk) {
      userDetail.headImg = '/images/platform/personal/headPortrait.jpg';
      app.saveUserDetail(that, userDetail);
    }
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getUserDetail(that, {});
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