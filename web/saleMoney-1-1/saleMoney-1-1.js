const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outMoney: null
  },
  changeOutMoney: function(e){
    var that = this;
    var value = e.detail.value;
    var alreadyCheck = that.data.rebateManageData.alreadyCheck || 0;
    if (value > alreadyCheck){
      that.setData({
        outMoney: alreadyCheck
      })
    }else{
      that.setData({
        outMoney: value
      })
    }
  },
  getAllMoney: function(){
    var that = this;
    var alreadyCheck = that.data.rebateManageData.alreadyCheck || 0;
    that.setData({
      outMoney: alreadyCheck
    })
  },
  chooseCard: function(){
    wx.navigateTo({
      url: '/web/saleMoney-4/saleMoney-4?isChoose=true',
    })
  },
  submitMoney: function(){
    var that = this;
    var startMoney = that.data.rebateManageData.alreadyCheck || 0;
    var outMoney = that.data.outMoney;
    var bankListData = that.data.bankListData;
    var cardBankId = that.data.cardBankId;
    var data = {
      startMoney: startMoney,
      outMoney: outMoney,
      cardNo: '',
      cardName: '',
      cardBank: ''
    }
    bankListData.forEach(function(v,i){
      if (v.id == cardBankId){
        data.cardNo = v.cardNum;
        data.cardName = v.cardName;
        data.cardBank = v.cardBank;
      }
    });
    if (cardBankId){
      if (outMoney > 0){
        app.outMoney(that, data);
      }else{
        wx.showToast({
          title: '提现金额必须大于0元',
          icon: 'none',
          duration: 1500
        })
      }
    }else{
      wx.showToast({
        title: '请选择银行卡',
        icon: 'none',
        duration: 1500
      })
    }
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
    var that = this;
    app.getRebateManageData(that);
    app.getBankListData(that);
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