const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData: {
      type: 'title',
      title: '绑定手机',
      leftIcon: 'back',
      rightIcon: false
    },
    imgHost: app.globalData.imgHost,
    vClick: false,
    vNum: 60,
    account: {
      value: '',
      status: 0
    },
    validation: {
      value: '',
      status: 0
    },
  },
  accountBlur: function(e){
    var that = this;
    var account = e.detail.value;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(account);
    var data = {
      account: account,
      status: 0
    }
    if (isPhone) {
      that.setData({
        'account.value': account,
        'account.status': 0
      });
    } else {
      that.setData({
        'account.value': account,
        'account.status': 1
      })
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  getValidation: function () {
    var that = this;
    var phone = that.data.account.value;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(phone);
    if (isPhone) {
      var data = {
        phone: phone
      }
      app.getValidation(that, data);
      that.setData({
        vClick: true
      });
    }
    if (that.data.vClick) {
      var t = setInterval(function () {
        var vNum = that.data.vNum;
        if (vNum == 0) {
          clearInterval(t);
          that.setData({
            vClick: false,
            vNum: 60
          });
          return;
        }
        vNum--;
        that.setData({
          vNum: vNum
        });
      }, 1000);
    }
  },
  validationBlur: function (e) {
    var that = this;
    var validation = e.detail.value;
    if (validation) {
      that.setData({
        'validation.value': validation,
        'validation.status': 0
      });
    } else {
      that.setData({
        'validation.value': '',
        'validation.status': 1
      });
    }
  },
  toBindMobile: function(){
    var that = this;
    var account = that.data.account.value;
    var validation = that.data.validation.value;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(account);
    if (isPhone && validation){
      var data = {
        invitationCode: validation,
        phone: account,
        loginType: 5,
        status: that.data.status
      }
      app.userRegister(that, data);
    }
    if (!isPhone){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        'account.status': 1
      })
      return;
    }
    if (!validation) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        'validation.status': 1
      })
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var status = options.status;
    if (status){
      that.setData({
        status: status
      });
    }
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