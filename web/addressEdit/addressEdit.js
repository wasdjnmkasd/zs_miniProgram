const app = getApp();
var tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    condition: false,
    name: "",
    telephone: "",
    address: "",
    setDefault: 1
  },
  changeName: function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      name: val
    })
  },
  changePhone: function(e){
    var that = this;
    var val = e.detail.value;
    var isPhone = (/^1(3|4|5|7|8|9)\d{9}$/gi).test(val);
    if (isPhone){
      that.setData({
        telephone: val
      })
    }else{
      that.setData({
        telephone: ''
      })
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  changeAddress: function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      address: val
    })
  },
  changeDefault: function(){
    var that = this;
    var setDefault = that.data.setDefault;
    if (setDefault == 1){
      that.setData({
        setDefault: 0
      });
    } else if (setDefault == 0){
      that.setData({
        setDefault: 1
      });
    }
  },
  setNewAddress: function(){
    var that = this;
    var name = that.data.name;
    var city = that.data.city;
    var county = that.data.county;
    var address = that.data.address;
    var province = that.data.province;
    var telephone = that.data.telephone;
    var setDefault = that.data.setDefault;
    if (name && city && county && address && province && telephone){
      var data = {
        city: city,
        area: county,
        address: address,
        province: province,
        setDefault: setDefault,
        receiveName: name,
        receivePhone: telephone
      }
      if (that.data.move == 'orderSure') {
        data.move = that.data.move;
      }
      app.createAddressMsg(that, data);
    }else{
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1000
      })
    }
  },
  saveAddress: function(){
    var that = this;
    var id = that.data.id;
    var name = that.data.name;
    var city = that.data.city;
    var county = that.data.county;
    var address = that.data.address;
    var province = that.data.province;
    var telephone = that.data.telephone;
    var setDefault = that.data.setDefault;
    if (name && city && county && address && province && telephone) {
      var data = {
        id: id,
        city: city,
        area: county,
        address: address,
        province: province,
        setDefault: setDefault,
        receiveName: name,
        receivePhone: telephone
      }
      app.updateAddressMsg(that, data);
    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1000
      })
    }
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
  onLoad: function (e) {
    var that = this;
    var id = e.id;
    var move = e.move;
    var province = '';
    var city = '';
    var county = '';
    if (move){
      that.setData({
        move: move
      });
    }
    if(id){
      that.setData({
        id: id
      });
      var host = app.globalData.host;
      var userId = wx.getStorageSync('userId');
      var centerId = app.globalData.centerId;
      wx.request({
        url: host + '/usercenter/1.0/user/address/' + userId + '?centerId=' + centerId + '&numPerPage=10&currentPage=1',
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json', // 默认值
          'authentication': app.globalData.authentication
        },
        success: function (res) {
          if(res.data && res.data.success){
            let data = res.data.obj;
            data.forEach(function(v,i){
              if(v.id == id){
                that.setData({
                  'provinces': provinces,
                  'citys': citys,
                  'countys': countys,
                  'province': v.province,
                  'city': v.city,
                  'county': v.area,
                  'name': v.receiveName,
                  'telephone': v.receivePhone,
                  'address': v.address,
                  'setDefault': v.setDefault
                });
              }
            });
          }
        },
        fail: function (res) { },
        complete: function (res) { }
      })
    }
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