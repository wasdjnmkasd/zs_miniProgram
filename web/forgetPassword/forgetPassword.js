const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerData: {
      type: 'title',
      title: '修改密码',
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
    password: {
      value: '',
      status: 0
    },
    confirmPassword: {
      value: '',
      status: 0
    },
  },
  accountBlur: function (e) {
    var that = this;
    var account = e.detail.value;
    var isPhone = (/^1(3|4|5|7|8)\d{9}$/gi).test(account);
    var data = {
      account: account,
      status: 0
    }
    if (isPhone) {
      app.userCheck(that, data);
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
  accountClear: function () {
    var that = this;
    that.setData({
      'account.value': ''
    });
  },
  getValidation: function () {
    var that = this;
    var phone = that.data.account.value;
    var isPhone = (/^1(3|4|5|7|8)\d{9}$/gi).test(phone);
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
  passwordBlur: function (e) {
    var that = this;
    var password = e.detail.value;
    var confirmPassword = that.data.confirmPassword.value;
    if (password.length > 5) {
      that.setData({
        'password.value': password,
        'password.status': 0
      });
      if (confirmPassword != "") {
        if (confirmPassword != password) {
          wx.showToast({
            title: '两次输入密码不一致',
            icon: 'none',
            duration: 1000
          });
          that.setData({
            'password.status': 1,
            'confirmPassword.status': 1,
          });
        } else {
          that.setData({
            'password.status': 0,
            'confirmPassword.status': 0,
          });
        }
      }
    } else {
      that.setData({
        'password.value': password,
        'password.status': 1
      });
    }
  },
  confirmPasswordBlur: function (e) {
    var that = this;
    var confirmPassword = e.detail.value;
    var password = that.data.password.value;
    if (confirmPassword.length > 5) {
      that.setData({
        'confirmPassword.value': confirmPassword,
        'confirmPassword.status': 0
      });
      if (password != "") {
        if (confirmPassword != password) {
          wx.showToast({
            title: '两次输入密码不一致',
            icon: 'none',
            duration: 1000
          });
          that.setData({
            'password.status': 1,
            'confirmPassword.status': 1,
          });
        } else {
          that.setData({
            'password.status': 0,
            'confirmPassword.status': 0,
          });
        }
      }
    } else {
      that.setData({
        'confirmPassword.value': confirmPassword,
        'confirmPassword.status': 1
      });
    }
  },
  toforgetPassword: function(){
    var that = this;
    var account = that.data.account.value;
    var password = that.data.password.value;
    var validation = that.data.validation.value;
    var confirmPassword = that.data.confirmPassword.value;
    var isPhone = (/^1(3|4|5|7|8)\d{9}$/gi).test(account);
    var isPwd = password && confirmPassword && (password == confirmPassword);
    if (isPhone && isPwd && validation) {
      var data = {
        userName: account,
        password: password,
        code: validation,
      }
      app.userPwdChange(that, data);
    }
    if (!isPhone) {
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
    if (!isPwd) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        'password.status': 1,
        'confirmPassword.status': 1
      })
      return;
    }
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