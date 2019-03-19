const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    addressId: '',
    remark: '',
    isClick: true,
    idNumAlert: false
  },
  watch: {
    addressId: function (newVal, oldVal) {
      var that = this;
      var addressId = newVal;
      that.getPostFee(addressId);
    },
    postFeeArr: function (newVal, oldVal){
      var that = this;
      var ordersInfo = wx.getStorageSync('ordersInfo');
      var isHave = false;
      newVal.forEach(function(v,i){
        for (let k1 in ordersInfo) {
          for (let k2 in ordersInfo[k1]) {
            if (ordersInfo[k1][k2].supplierId == v.supplierId) {
              ordersInfo[k1][k2].postFee = v.postFee.toFixed(2);
            }
          }
        }
      });
      that.setData({
        ordersInfo: ordersInfo
      });
      that.getTaxFee(ordersInfo);
    },
    addressListData: function (newVal, oldVal){
      var that = this;
      var d = wx.getStorageSync('ordersInfo');
      for (let k1 in d) {
        for (let k2 in d[k1]) {
          d[k1][k2].exciseTaxFee = (d[k1][k2].exciseTaxFee * 1).toFixed(2);
          d[k1][k2].incrementTaxFee = (d[k1][k2].exciseTaxFee * 1).toFixed(2);
          d[k1][k2].supplierPrice = (d[k1][k2].supplierPrice).toFixed(2);
          d[k1][k2].taxFee = (d[k1][k2].exciseTaxFee * 1 + d[k1][k2].incrementTaxFee * 1).toFixed(2);
          d[k1][k2].totalPrice = (d[k1][k2].supplierPrice * 1 - (d[k1][k2].supplierBargainPrice * 1 || 0) + d[k1][k2].taxFee * 1 + d[k1][k2].postFee * 1).toFixed(2);
        }
      }
      that.setData({
        ordersInfo: d
      });
      var addressId = that.data.addressId;
      that.getPostFee(addressId);
    },
    personalData: function (newVal, oldVal){
      var that = this;
      if (newVal.userDetail && newVal.userDetail.idNum && newVal.userDetail.name){
        that.setData({
          haveCode: true
        });
      }else{
        that.setData({
          haveCode: false
        });
      }
    }
  },
  hideIdNumAlert: function(){
    var that = this;
    that.setData({
      idNumAlert: false
    })
  },
  showContent: function(){
    wx.showModal({
      title: '为什么需要实名认证？',
      showCancel: false,
      content: '根据海关要求，购买跨境商品需要对购买人进行实名认证，错误信息可能导致无法正常清关。您的信息将加密保管，中国供销海外购保证信息安全，绝不对外泄露！任何身份证问题可以联系我们 010-59423991（9:00 - 18:00）',
      success: function (res) {
        
      }
    })
  },
  userNameInput: function(e){
    var that = this;
    var userName = e.detail.value;
    that.setData({
      'idNumAlert.userName': userName
    })
  },
  idNumInput: function(e){
    var that = this;
    var idNum = e.detail.value;
    that.setData({
      'idNumAlert.idNum': idNum
    })
  },
  confirmIdNum: function(){
    var that = this;
    var userName = that.data.idNumAlert.userName;
    var idNum = that.data.idNumAlert.idNum;
    if (!userName){
      wx.showToast({
        title: '真实姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i).test(idNum)){
      wx.showToast({
        title: '身份证格式有误',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var data = {
      name: userName,
      idNum: idNum
    }
    app.createUserDetail(that,data);
  },
  getPostFee: function(addressId){
    var that = this;
    var addressListData = that.data.addressListData || [];
    var postFeeArr = that.data.postFeeArr || [];
    addressListData.forEach(function(v,i){
      if (v.id == addressId){
        var ordersInfo = wx.getStorageSync('ordersInfo');
        var isCount = false;
        var isSpec = false;
        var dataArr = [];
        for (let k1 in ordersInfo){
          for (let k2 in ordersInfo[k1]){
            var data = {};
            for (let k3 in ordersInfo[k1][k2].itemObj){
              if (ordersInfo[k1][k2].supplierBargainPrice){
                if (ordersInfo[k1][k2].itemObj[k3].itemId != 100001207){
                  if (ordersInfo[k1][k2].itemObj[k3].freePost == 0) {
                    isCount = true;
                    data.weight = ordersInfo[k1][k2].supplierWeight;
                    data.price = ordersInfo[k1][k2].supplierPrice;
                    data.province = v.province;
                    data.supplierId = ordersInfo[k1][k2].supplierId;
                    dataArr.push(data);
                  }
                }
              }else{
                if (ordersInfo[k1][k2].itemObj[k3].freePost == 0) {
                  isCount = true;
                  data.weight = ordersInfo[k1][k2].supplierWeight;
                  data.price = ordersInfo[k1][k2].supplierPrice;
                  data.province = v.province;
                  data.supplierId = ordersInfo[k1][k2].supplierId;
                  dataArr.push(data);
                }
              }
            }
          }
        }
        if (isCount){
          app.getPostFee(that, dataArr);
        }else{
          that.setData({
            postFeeArr: []
          });
        }
      }
    });
  },
  getTaxFee: function (ordersInfo){
    var that = this;
    var d = ordersInfo;
    var exciseTaxFee = 0;
    var incrementTaxFee = 0;
    for(let k1 in d){
      for(let k2 in d[k1]){
        for (let k3 in d[k1][k2].itemObj) {
          if (d[k1][k2].itemObj[k3].freeTax == 0) {
            let itemTotalPrice = d[k1][k2].itemObj[k3].quantity * d[k1][k2].itemObj[k3].priceList[0].price;
            let itemPostFee = d[k1][k2].postFee * (itemTotalPrice / d[k1][k2].supplierPrice);
            let itemExciseTax = d[k1][k2].itemObj[k3].exciseTax;
            let itemIncrementTax = d[k1][k2].itemObj[k3].incrementTax;
            let itemExciseTaxFee = 0;
            let itemIncrementTaxFee = 0;
            if (d[k1][k2].supplierBargainPrice){
              if (d[k1][k2].itemObj[k3].itemId != 100001207){
                if (itemExciseTax && itemExciseTax != 0) {
                  itemExciseTaxFee = (itemTotalPrice + itemPostFee) / (1 - itemExciseTax) * itemExciseTax * 0.7;
                }
                if (itemIncrementTax && itemIncrementTax != 0) {
                  itemIncrementTaxFee = ((itemTotalPrice + itemPostFee) + (itemTotalPrice + itemPostFee) / (1 - itemExciseTax) * itemExciseTax * 0.7) * itemIncrementTax * 0.7;
                }
              }
            }else{
              if (itemExciseTax && itemExciseTax != 0) {
                itemExciseTaxFee = (itemTotalPrice + itemPostFee) / (1 - itemExciseTax) * itemExciseTax * 0.7;
              }
              if (itemIncrementTax && itemIncrementTax != 0) {
                itemIncrementTaxFee = ((itemTotalPrice + itemPostFee) + (itemTotalPrice + itemPostFee) / (1 - itemExciseTax) * itemExciseTax * 0.7) * itemIncrementTax * 0.7;
              }
            }
            exciseTaxFee += itemExciseTaxFee;
            incrementTaxFee += itemIncrementTaxFee;
          }
        }
        d[k1][k2].exciseTaxFee = exciseTaxFee.toFixed(2);
        d[k1][k2].incrementTaxFee = incrementTaxFee.toFixed(2);
        d[k1][k2].supplierPrice = (d[k1][k2].supplierPrice).toFixed(2);
        d[k1][k2].taxFee = (d[k1][k2].exciseTaxFee*1 + d[k1][k2].incrementTaxFee*1).toFixed(2);
        d[k1][k2].totalPrice = (d[k1][k2].supplierPrice * 1 - (d[k1][k2].supplierBargainPrice * 1 || 0) + d[k1][k2].taxFee * 1 + d[k1][k2].postFee * 1).toFixed(2);
        exciseTaxFee = 0;
        incrementTaxFee = 0;
      }
    }
    that.setData({
      ordersInfo: d
    });
  },
  orderSubmit: function (e) {
    var that = this;
    var ordersInfo = that.data.ordersInfo;
    var tType = e.currentTarget.dataset.type;
    var tSupplierId = e.currentTarget.dataset.supplierid;
    var data = ordersInfo[tType][tSupplierId];
    var addressId = that.data.addressId;
    var addressData = that.data.addressListData;
    var addressItem = '';
    var ids = [];
    addressData.forEach(function (v, i) {
      if (v.id == addressId) {
        addressItem = v;
      }
    });
    var d = {
      tagFun: 0,
      payType: 1,
      createType: 0,
      expressType: 0,
      orderSource: 10,
      orderFlag: tType,
      supplierId: tSupplierId,
      orderDetail: {
        payType: 1,
        taxFee: data.taxFee,
        postFee: data.postFee,
        payment: data.totalPrice,
        receiveArea: addressItem.area,
        receiveCity: addressItem.city,
        receiveName: addressItem.receiveName,
        receivePhone: addressItem.receivePhone,
        receiveZipCode: addressItem.zipCode,
        receiveAddress: addressItem.address,
        receiveProvince: addressItem.province,
      },
      orderGoodsList: [],
      redirect: '',
      remark: that.data.remark,
      tdq: data.tdq
    };
    if (data.supplierBargainPrice && data.couponIds) {
      d.createType = 1;
      d.couponIds = data.couponIds;
    }
    for (let k1 in data.itemObj) {
      var _d = {
        actualPrice: data.itemObj[k1].priceList[0].price,
        goodsId: data.itemObj[k1].itemSpecs.goodsId,
        itemCode: data.itemObj[k1].itemSpecs.itemCode,
        itemId: data.itemObj[k1].itemSpecs.itemId,
        itemImg: data.itemObj[k1].itemImg || '',
        itemInfo: data.itemObj[k1].itemSpecs.info || '',
        itemName: data.itemObj[k1].itemName,
        itemPrice: data.itemObj[k1].priceList[0].price,
        itemQuantity: data.itemObj[k1].quantity,
        sku: data.itemObj[k1].itemSpecs.sku
      }
      if (data.supplierBargainPrice && data.couponIds){
        _d.actualPrice = data.itemObj[k1].priceList[0].price * 1 - data.supplierBargainPrice * 1;
      }
      d.orderGoodsList.push(_d);
      if (data.itemObj[k1].ids) {
        ids.push(data.itemObj[k1].ids);
      }
    }
    d.ids = ids;
    if(that.data.addressListData.length > 0){
      if (tType == 0) {
        if (that.data.haveCode) {
          app.createOrder(that, d);
        } else if (!that.data.haveCode) {
          that.setData({
            idNumAlert: true
          })
        }
      } else {
        app.createOrder(that, d);
      }
    }else{
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
        duration: 1500
      })
    }
  },
  remarkBlur: function(e){
    var that = this;
    var remark = e.detail.value;
    that.setData({
      remark: remark
    });
  },
  toProtocol: function(){
    wx.navigateTo({
      url: '/web/protocol/protocol',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getAddressData(that, {});
    app.setWatcher(that);
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
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.userDetailQuery(that, {});
    app.getAddressData(that, {});
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