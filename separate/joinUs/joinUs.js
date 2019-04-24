const app = getApp();
const FileSystemManager = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    cardImg1: null,
    cardImg2: null,
    companyImg: null,
    userName: '',
    userPhone: '',
    userAddress: '',
    userCompany: '',
    userContent: '',
    submit: true,
    alertShare: false,
    hidden: true,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
  },
  changeName: function (e) {
    var that = this;
    var val = e.detail.value;
    that.setData({
      userName: val
    });
  },
  changePhone: function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      userPhone: val
    });
  },
  changeAddress: function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      userAddress: val
    });
  },
  changeCompany: function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      userCompany: val
    });
  },
  changeContent: function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      userContent: val
    });
  },
  upload: function(e){
    var that = this;
    var type = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: 'https://testfront.cncoopay.com/Data/img/upLoad',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function(res){
            var r = JSON.parse(res.data);
            if(type == 1){
              that.setData({
                cardImg1: that.data.imgHost + r.downUrl
              });
            } else if (type == 2){
              that.setData({
                cardImg2: that.data.imgHost + r.downUrl
              });
            } else if (type == 3) {
              that.setData({
                companyImg: that.data.imgHost + r.downUrl
              });
            }
          }
        })
      }
    })
  },
  listSubmit: function(){
    var that = this;
    var userName = that.data.userName;
    var userPhone = that.data.userPhone;
    var userAddress = that.data.userAddress;
    var userCompany = that.data.userCompany;
    var userContent = that.data.userContent;
    var cardImg1 = that.data.cardImg1;
    var cardImg2 = that.data.cardImg2;
    var companyImg = that.data.companyImg;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(userPhone);
    var data = {
      userName: userName,
      userPhone: userPhone,
      userAddress: userAddress,
      usercompany: userCompany,
      userContent: userContent,
      cardImg1: cardImg1,
      cardImg2: cardImg2,
      companyImg: companyImg,
      shopId: wx.getStorageSync('shopId') || 2
    }
    if (userName == ''){
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        duration: 1500
      })
      return ;
    }
    if (userPhone == '') {
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!isPhone){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (userAddress == '') {
      wx.showToast({
        title: '请输入您的联系地址',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (userCompany != '' && companyImg == null){
      wx.showToast({
        title: '若填写公司名称，请长传营业执照',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if(cardImg1 == null){
      wx.showToast({
        title: '请上传身份证正面照片',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (cardImg2 == null) {
      wx.showToast({
        title: '请上传身份证反面照片',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if(that.data.submit){
      app.setOpenShopData(data);
      that.setData({
        submit: false
      })
      setTimeout(function(){
        that.setData({
          submit: true
        })
      },10000);
    }else{
      wx.showToast({
        title: '请勿频繁提交，请稍后再试',
        icon: 'none',
        duration: 1500
      })
    }
    
  },
  showShare: function () {
    var that = this;
    that.setData({
      alertShare: true
    });
  },
  hideShare: function () {
    var that = this;
    that.setData({
      alertShare: false
    });
  },
  share: function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.gertMyStoreCode(that);
    that.hideShare();
  },
  save: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImg(that.data.scanImg);
            },
            fail() {
              wx.showToast({
                title: '获取用户授权失败，请重新授权',
                icon: 'none',
                duration: 1500
              })
              that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            }
          })
        } else {
          that.saveImg(that.data.scanImg);
        }
      }
    })
  },
  handleSetting: function (e) {
    let that = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      wx.showToast({
        title: '授权成功，赶紧将图片保存在相册中吧',
        icon: 'none',
        duration: 1500
      })
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  },
  saveImg: function (url) {
    var that = this;
    var data = wx.base64ToArrayBuffer(url.slice(22, -1));
    FileSystemManager.writeFile({
      filePath: `${wx.env.USER_DATA_PATH}/myStore_qrCode.png`,
      data: data,
      encoding: 'binary',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: `${wx.env.USER_DATA_PATH}/myStore_qrCode.png`,
          success(res) {
            wx.showToast({
              title: '保存图片成功，请到相册查看分享',
              icon: 'none',
              duration: 1500
            })
            that.setData({
              hidden: true,
              alertShare: false
            })
          },
          fail(res) {
            wx.showToast({
              title: '保存图片失败',
              icon: 'none',
              duration: 1500
            })
            that.setData({
              hidden: true,
              alertShare: false
            })
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          hidden: true,
          alertShare: false
        })
      }
    });
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
    var that = this;
    var shopId = app.globalData.shopId || 2;
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    var imageUrl = that.data.imgHost + '/images/platform/joinUs/joinUs01.jpg';
    return {
      title: '邀请开店',
      path: url + '?scene=shopId%3D' + shopId,
      imageUrl: imageUrl
    }
  }
})