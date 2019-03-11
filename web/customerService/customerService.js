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
    customerData:{
      companyName: '宁波鑫海通达跨境电子商务有限公司',
      companyAddress: '浙江省宁波市北仑区保税区港东大道5号进口商品市场317室',
      companyPhone: '010-59423991',
      companyEmail: '1917761259@qq.com',
      companyQQ: '1917761259',
      companyWx: 'zggxhwg2018'
    }
  },

  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.customerData.companyPhone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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