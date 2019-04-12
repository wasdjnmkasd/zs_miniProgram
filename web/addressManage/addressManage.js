const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // headerData: {
    //   type: 'title',
    //   title: '管理收货地址',
    //   leftIcon: 'back',
    //   rightIcon: false
    // },
    imgHost: app.globalData.imgHost
  },
  setDefaultAddress: function(e){
    var that = this;
    var data = {};
    var id = e.currentTarget.dataset.id;
    var addressListData = that.data.addressListData;
    addressListData.forEach(function(v,i){
      if(v.id == id){
        v.setDefault = 1;
        data = v;
      }
    });
    data.type = 'setDefault';
    app.updateAddressMsg(that, data);
  },
  addressDelete: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var data = {
      id: id
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否删除收货地址？',
      success: function (res) {
        if (res.confirm) {
          app.deteleAddressMsg(that, data);
        }
      }
    })  
  },
  addNewAddress: function(){
    wx.navigateTo({
      url: '/web/addressEdit/addressEdit',
    })
  },
  addressChange: function(e){
    wx.navigateTo({
      url: '/web/addressEdit/addressEdit?id=' + e.currentTarget.dataset.id,
    })
  },
  chooseItem: function(e){
    var id = e.currentTarget.dataset.id;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      addressId: id
    })
    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var btnHide = e.btnHide;
    if (btnHide){
      that.setData({
        btnHide: btnHide
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    app.shopDetailQuery(that);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getAddressData(that,{});
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