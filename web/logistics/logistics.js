const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData: {
      type: 'title',
      title: '物流跟踪',
      leftIcon: 'back',
      rightIcon: false
    }
  },
  watch:{
    orderListData: function(newVal, oldVal){
      var that = this;
      var orderExpressList = [];
      newVal.forEach(function(v1,i1){
        console.log(v1.orderExpressList);
        if(v1.orderExpressList.length > 0){
          newVal[0].orderExpressList.forEach(function(v2,i2){
            let d = {
              expressId: v2.expressId,
              expressName: v2.expressName
            }
            orderExpressList.push(d);
          });
          that.setData({
            orderExpressList: orderExpressList
          });
        }else{
          wx.showToast({
            title: '暂无物流信息',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }
      });
    },
    orderExpressList: function (newVal, oldVal) {
      var that = this;
      if (newVal && newVal.length > 0){
        newVal.forEach(function(v,i){
          app.getLogisticsData(that, v);
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    var data = {
      numPerPage: 5,
      currentPage: 1,
      orderId: orderId,
      type: 'getData'
    }
    app.setWatcher(that);
    app.getOrderListData(that, data);
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