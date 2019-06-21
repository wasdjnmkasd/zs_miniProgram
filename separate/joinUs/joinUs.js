const app = getApp();
var tcity = require("../../utils/citys.js");
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
    checkNum: '',
    userPhone: '',
    userAddress: '',
    userCompany: '',
    userContent: '',
    submit: true,
    alertShare: false,
    hidden: true,
    vNum: 60, 
    isOk: true,
    vClick: false,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
    nodeHost: app.globalData.nodeHost,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    condition: false,
    shopStatus: 0
  },
  watch: {
    infoData: function(newVal, oldVal){
      var that = this;
      that.setData({
        userPhone: newVal.phone
      })
      var data = {
        phone: newVal.phone
      }
      app.getShopCheck(that, data);
    },
    shopStatus: function(newVal, oldVal){
      var that = this;
      var data = {
        phone: that.data.infoData.phone
      }
      var isReSubmit = wx.getStorageSync('isReSubmit');
      if (isReSubmit){
        that.setData({
          isReSubmit: isReSubmit
        })
      }
      if (newVal == 2 || newVal == 3){
        app.getApplyShopData(that, data);
      }
    },
    reId: function(newVal, oldVal){
      var that = this;
      var shopStatus = that.data.shopStatus;
      wx.setStorageSync('shopId', newVal);
      app.globalData.shopId = newVal;
      if (shopStatus == 3) {
        wx.redirectTo({
          url: '/web/shopSetting/shopSetting',
        })
      }
    }
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
    var shopId = app.globalData.shopId;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: that.data.nodeHost + '/Data/img/upLoad?shopId=' + shopId,
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function(res){
            var r = JSON.parse(res.data);
            that.setData({
              cardImg: app.globalData.imgUrl + r.downUrl
            });
            // if(type == 1){
            //   that.setData({
            //     cardImg1: that.data.imgHost + r.downUrl
            //   });
            // } else if (type == 2){
            //   that.setData({
            //     cardImg2: that.data.imgHost + r.downUrl
            //   });
            // } else if (type == 3) {
            //   that.setData({
            //     companyImg: that.data.imgHost + r.downUrl
            //   });
            // }
          }
        })
      }
    })
  },
  listSubmit: function(){
    var that = this;
    var openId = wx.getStorageSync('openId');
    var userName = that.data.userName;
    var userPhone = that.data.userPhone;
    var userAddress = that.data.userAddress;
    var userContent = that.data.userContent;
    var province = that.data.province;
    var city = that.data.city;
    var county = that.data.county;
    var cardImg = that.data.cardImg;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(userPhone);
    var data = {
      wechat: openId,
      personInCharge: userName,
      phone: userPhone,
      province: province,
      city: city,
      district: county,
      address: userAddress,
      remark: userContent,
      idCardPicPath: cardImg,
      parentId: wx.getStorageSync('shopId') || 2
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
        title: '请输入您的详细地址',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if(cardImg == null){
      wx.showToast({
        title: '请上传身份证正面照片',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (that.data.submit) {
      if (that.data.isOk){
        var isReSubmit = wx.getStorageSync('isReSubmit');
        if (isReSubmit){
          data.id = that.data.reId;
          app.shopReApply(that, data);
        }else{
          app.shopApply(that, data);
        }
        that.setData({
          submit: false
        })
        setTimeout(function () {
          that.setData({
            submit: true
          })
        }, 10000);
      }else{
        wx.showToast({
          title: '手机验证码错误',
          icon: 'none',
          duration: 1500
        })
      }
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
  bindChange: function (e) {
    var that = this;
    var val = e.detail.value;
    var v = that.data.value;
    var cityData = that.data.cityData[86];
    var provinces = that.data.provinces;
    var citys = that.data.citys;
    var countys = that.data.countys;
    var newCitys = [];
    var newCountys = [];
    if (val[0] != v[0]) {
      let d1 = cityData[provinces[val[0]].code];
      for (let k1 in d1) {
        let data = {};
        data.code = k1;
        data.name = d1[k1];
        newCitys.push(data);
      }
      let d2 = cityData[newCitys[0].code];
      for (let k2 in d2) {
        let data = {};
        data.code = k2;
        data.name = d2[k2];
        newCountys.push(data);
      }
      val[1] = 0;
      val[2] = 0;
      that.setData({
        province: provinces[val[0]].name,
        citys: newCitys,
        city: newCitys[0].name,
        countys: newCountys,
        county: newCountys[0].name,
        value: val
      });
    }
    if (val[1] != v[1]) {
      let d3 = cityData[citys[val[1]].code];
      for (let k3 in d3) {
        let data = {};
        data.code = k3;
        data.name = d3[k3];
        newCountys.push(data);
      }
      val[2] = 0;
      that.setData({
        city: citys[val[1]].name,
        countys: newCountys,
        county: newCountys[0].name,
        value: val
      });
    }
    if (val[2] != v[2]) {
      that.setData({
        county: countys[val[2]].name,
        value: val
      });
    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  getValidation: function(){
    var that = this;
    var phone = that.data.userPhone;
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
  validationBlur: function(e){
    var that = this;
    var phone = that.data.userPhone;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(phone);
    var checkNum = e.detail.value;
    var data = {
      phone: phone,
      code: checkNum
    }
    if (isPhone && checkNum != ''){
      app.checkVerify(that, data);
    }
  },
  reSubmit: function(){
    var that = this;
    that.setData({
      shopStatus: 0
    })
    wx.setStorageSync('isReSubmit', true);
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
    app.setWatcher(that);
    var userId = wx.getStorageSync('userId');
    var openId = wx.getStorageSync('openId');
    var shopStatus = wx.getStorageSync('shopStatus');
    var province = '';
    var city = '';
    var county = '';
    tcity.init(that);//三级联动数据初始化
    var cityData = that.data.cityData[86];//获取三级联动数据
    var d1 = {};
    var d2 = {};
    const provinces = [];
    const citys = [];
    const countys = [];
    for (var k1 in cityData) {
      if (k1 == 100000) {
        for (var k2 in cityData[k1]) {
          let data = {};
          data.code = k2;
          data.name = cityData[k1][k2];
          provinces.push(data);
        }
      }
    }
    if (province) {
      provinces.forEach(function (v, i) {
        if (province && v.name == province) {
          d1 = cityData[v.code];
        }
      });
    } else {
      d1 = cityData[provinces[0].code]
    }
    for (var k in d1) {
      let data = {};
      data.code = k;
      data.name = d1[k];
      citys.push(data);
    }
    if (city) {
      citys.forEach(function (v, i) {
        if (city && v.name == city) {
          d2 = cityData[v.code];
        }
      });
    } else {
      d2 = cityData[citys[0].code];
    }
    for (var k in d2) {
      let data = {};
      data.code = k;
      data.name = d2[k];
      countys.push(data);
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': province || provinces[0].name,
      'city': city || citys[0].name,
      'county': county || countys[0].name
    });
    if(userId){
      app.shopDetailQuery();
      that.setData({
        isOk: true,
        showChekNum: false
      });
    }else{
      that.setData({
        isOk: false,
        showChekNum: true
      });
    }
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
    var userId = wx.getStorageSync('userId');
    var openId = wx.getStorageSync('openId');
    if(userId){
      app.getUserDetail(that); 
      that.setData({
        showChekNum: false
      });
    }else{
      that.setData({
        showChekNum: true
      });
    }
    if(!openId){
      wx.navigateTo({
        url: '/web/authorizedLogin/authorizedLogin',
      })
    }
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