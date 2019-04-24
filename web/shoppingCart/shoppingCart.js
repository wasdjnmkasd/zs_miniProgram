const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // headerData:{
    //   type: 'title',
    //   title: '购物车',
    //   leftIcon: false,
    //   rightIcon: 'edit'
    // },
    footerData: {
      active: 3,
      shoppingCartCount: 0
    },
    startX: 0,
    startY: 0,
    imgHost: app.globalData.imgHost,
    allChooseStatus: 'selected',
    shopCartStatus: 'normal'
  },
  shopCartBuy: function(){
    var that = this;
    var allData = that.data.shopCartData;
    var selectedData = that.getSelectedData(allData);
    var orderCount = 0;
    var orders = {}
    var isCrossOK = true;
    if (selectedData.length == 0){
      wx.showToast({
        title: '请选择需要购买的商品',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    selectedData.forEach(function (o1, n1) {
      if (o1.goodsSpecs) {
        var type = o1.type;
        var itemId = o1.itemId;
        var status = o1.goodsSpecs.status;
        var supplierId = o1.supplierId;
        var supplierName = o1.supplierName;
        var typeName = type === 0 ? "跨境" : type === 2 ? "一般" : type === 1 ? "大贸" : "";
        orders[type] = orders[type] || {};
        orders[type][supplierId] = orders[type][supplierId] || {};
        orders[type][supplierId].type = type;
        orders[type][supplierId].typeName = typeName;
        orders[type][supplierId].supplierId = supplierId;
        orders[type][supplierId].supplierName = supplierName;
        orders[type][supplierId].itemObj = orders[type][supplierId].itemObj || {};
        orders[type][supplierId].itemObj[itemId] = {};
        orders[type][supplierId].itemObj[itemId].ids = o1.id;
        orders[type][supplierId].itemObj[itemId].status = status;
        orders[type][supplierId].itemObj[itemId].selected = o1.goodsSpecs.stock > 0 && status !== 0;
        orders[type][supplierId].itemObj[itemId].goodsId = o1.goodsSpecs.goodsId;
        orders[type][supplierId].itemObj[itemId].firstCategory = o1.goodsSpecs.firstCategory;
        orders[type][supplierId].itemObj[itemId].secondCategory = o1.goodsSpecs.secondCategory;
        orders[type][supplierId].itemObj[itemId].thirdCategory = o1.goodsSpecs.thirdCategory;
        orders[type][supplierId].itemObj[itemId].type = type;
        orders[type][supplierId].itemObj[itemId].href = o1.href;
        orders[type][supplierId].itemObj[itemId].itemId = o1.itemId;
        orders[type][supplierId].itemObj[itemId].freePost = o1.freePost;
        orders[type][supplierId].itemObj[itemId].freeTax = o1.freeTax;
        orders[type][supplierId].itemObj[itemId].itemImg = o1.picPath;
        if (o1.goodsSpecs.infoStr){
          orders[type][supplierId].itemObj[itemId].infoStr = o1.goodsSpecs.infoStr;
        }
        orders[type][supplierId].itemObj[itemId].quantity = o1.quantity;
        orders[type][supplierId].itemObj[itemId].itemName = o1.goodsName;
        orders[type][supplierId].itemObj[itemId].goodsName = o1.goodsName;
        orders[type][supplierId].itemObj[itemId].itemSpecs = o1.goodsSpecs;
        orders[type][supplierId].itemObj[itemId].itemCode = o1.goodsSpecs.itemCode;
        orders[type][supplierId].itemObj[itemId].stock = o1.goodsSpecs.stock > 0 ? o1.goodsSpecs.stock : 0;
        orders[type][supplierId].itemObj[itemId].weight = o1.goodsSpecs.weight;
        orders[type][supplierId].itemObj[itemId].exciseTax = o1.goodsSpecs.exciseTax;
        orders[type][supplierId].itemObj[itemId].incrementTax = o1.goodsSpecs.incrementTax;
        orders[type][supplierId].itemObj[itemId].priceList = o1.goodsSpecs.priceList;
        orders[type][supplierId].itemObj[itemId].carton = o1.goodsSpecs.carton;
        orders[type][supplierId].itemObj[itemId].tagList = [];
        o1.goodsSpecs.tagList.forEach(function (o, i) {
          if (o.tagName === '预售') {
            orders[type][supplierId].itemObj[itemId].tagFunId = o.tagFunId;
            orders[type][supplierId].itemObj[itemId].preSaleName = o.tagName;
            orders[type][supplierId].itemObj[itemId].preSaleDesc = o.description;
          }
          orders[type][supplierId].itemObj[itemId].tagList.push(o);
        });
      }
    });
    for (let k1 in orders){
      for (let k2 in orders[k1]) {
        let tdq = 0;
        orders[k1][k2].taxFee = 0;
        orders[k1][k2].postFee = 0;
        orders[k1][k2].exciseTaxFee = 0;
        orders[k1][k2].incrementTaxFee = 0;
        orders[k1][k2].supplierPrice = 0;
        orders[k1][k2].supplierWeight = 0;
        for (let k3 in orders[k1][k2].itemObj){
          orders[k1][k2].supplierPrice += orders[k1][k2].itemObj[k3].quantity * orders[k1][k2].itemObj[k3].priceList[0].price;
          orders[k1][k2].supplierWeight += orders[k1][k2].itemObj[k3].quantity * orders[k1][k2].itemObj[k3].weight;
        }
        orders[k1][k2].supplierPrice = orders[k1][k2].supplierPrice;
        orders[k1][k2].supplierWeight = orders[k1][k2].supplierWeight;
        for (let k3 in orders[k1][k2].itemObj){
          tdq ++;
        }
        orders[k1][k2].tdq = tdq;
      }
    }
    if (that.data.allCrossPrice > 2000){
      if (that.data.allCrossCount == 1){
        isCrossOK = true;
      }else{
        isCrossOK = false;
      }
    }else{
      isCrossOK = true;
    }
    if (!isCrossOK){
      wx.showToast({
        title: '跨境商品订单不得超过2000元',
        icon: 'none',
        duration: 1500
      })
    }
    if (isCrossOK) {
      wx.setStorageSync('ordersInfo', orders);
      wx.navigateTo({
        url: '/web/orderSure/orderSure',
      })
    }
  },
  goodsItemSelected: function(e){
    var that = this;
    var itemId = e.currentTarget.dataset.itemid;
    var itemIdReturn = that.getItemIdData(itemId);
    var itemIdData = itemIdReturn.data;
    var itemIdIndex = itemIdReturn.index;
    var allData = that.data.shopCartData;
    var selectedNum = 0;
    var statusNum = 0;
    if (itemIdData.status != 'lose') {
      if (itemIdData.type == 2){
        if (itemIdData.status == 'selected') {
          itemIdData.status = '';
          that.setData({
            allChooseStatus: ''
          });
        } else {
          itemIdData.status = 'selected';
        }
      } else if (itemIdData.type == 0){
        if (itemIdData.status == 'selected') {
          itemIdData.status = '';
          that.setData({
            allChooseStatus: ''
          });
        } else {
          itemIdData.status = 'selected';
        }
      }
    }
    for (var i = 0; i < allData.length; i++) {
      if (allData[i].status == 'selected') {
        selectedNum ++;
      }
      if (allData[i].status != 'lose'){
        statusNum ++;
      }
    }
    if (selectedNum == statusNum) {
      that.setData({
        allChooseStatus: 'selected'
      });
    }
    allData[itemIdIndex] = itemIdData;
    that.setData({
      shopCartData: allData,
      selectedNum: selectedNum
    });
    that.getAllPrice(allData);
  },
  allGoodsSelected: function(){
    var that = this;
    var allStatus = '';
    var itemStatus = '';
    var allData = that.data.shopCartData;
    var allChooseStatus = that.data.allChooseStatus;
    var statusNum = 0;
    if (allChooseStatus == 'selected'){
      allStatus = '';
      itemStatus = '';
      that.setData({
        selectedNum: 0
      });
    } else {
      allStatus = 'selected';
      itemStatus = 'selected';
      for (var i = 0; i < allData.length; i++){
        if (allData[i].status != 'lose'){
          statusNum ++;
        }
      }
      that.setData({
        selectedNum: statusNum
      });
    }
    for(var i = 0; i < allData.length; i++){
      if (allData[i].status != 'lose'){
        allData[i].status = itemStatus
      }
    }
    that.setData({
      shopCartData: allData,
      allChooseStatus: allStatus
    });
    that.getAllPrice(allData);
  },
  numberAdd: function(e){
    var that = this;
    var maxNum = e.currentTarget.dataset.max || 999999;
    var itemId = e.currentTarget.dataset.itemid;
    var stock = e.currentTarget.dataset.stock;
    var itemIdReturn = that.getItemIdData(itemId);
    var itemIdData = itemIdReturn.data;
    var itemIdIndex = itemIdReturn.index;
    var allData = that.data.shopCartData;
    if (itemIdData.quantity < maxNum && itemIdData.quantity < stock){
      itemIdData.quantity ++;
      allData[itemIdIndex] = itemIdData;
      that.setData({
        shopCartData: allData
      });
       that.getAllPrice(allData);
    }else{
      wx.showToast({
        title: '已超过最大购买数量',
        icon: 'none',
        duration: 1500
      })
    }
  },
  numberMinus: function(e){
    var that = this;
    var minNum = e.currentTarget.dataset.min || 1;
    var itemId = e.currentTarget.dataset.itemid;
    var itemIdReturn = that.getItemIdData(itemId);
    var itemIdData = itemIdReturn.data;
    var itemIdIndex = itemIdReturn.index;
    var allData = that.data.shopCartData;
    if (itemIdData.quantity > 1 && itemIdData.quantity > minNum) {
      itemIdData.quantity--;
      allData[itemIdIndex] = itemIdData;
      that.setData({
        shopCartData: allData,
      });
      that.getAllPrice(allData);
    }else{
      wx.showToast({
        title: '已到达最小购买数量',
        icon: 'none',
        duration: 1500
      })
    }
  },
  numberChange: function(e){
    var that = this;
    var minNum = e.currentTarget.dataset.min || 1;
    var maxNum = e.currentTarget.dataset.max || 999999;
    var stock = e.currentTarget.dataset.stock;
    var itemId = e.currentTarget.dataset.itemid;
    var itemIdReturn = that.getItemIdData(itemId);
    var itemIdIndex = itemIdReturn.index;
    var allData = that.data.shopCartData;
    var num = e.detail.value;
    if (num < minNum) {
      allData[itemIdIndex].quantity = minNum;
      wx.showToast({
        title: '购买数量不得低于最小购买量',
        icon: 'none',
        duration: 1000
      });
    }
    if (num >= minNum && num <= stock && num <= maxNum) {
      allData[itemIdIndex].quantity = num;
    }
    if (num > stock) {
      if (stock > maxNum) {
        allData[itemIdIndex].quantity = maxNum;
        wx.showToast({
          title: '购买数量不得超过最大购买量',
          icon: 'none',
          duration: 1000
        });
      } else {
        allData[itemIdIndex].quantity = stock;
        wx.showToast({
          title: '购买数量不得超过最大库存量',
          icon: 'none',
          duration: 1000
        });
      }
    }
    if (num > maxNum) {
      if (maxNum > stock) {
        allData[itemIdIndex].quantity = stock;
        wx.showToast({
          title: '购买数量不得超过最大库存量',
          icon: 'none',
          duration: 1000
        });
      } else {
        allData[itemIdIndex].quantity = maxNum;
        wx.showToast({
          title: '购买数量不得超过最大购买量',
          icon: 'none',
          duration: 1000
        });
      }
    }
    if (num == maxNum) {
      if (maxNum > stock) {
        allData[itemIdIndex].quantity = stock;
        wx.showToast({
          title: '购买数量不得超过最大库存量',
          icon: 'none',
          duration: 1000
        });
      } else {
        allData[itemIdIndex].quantity = maxNum;
      }
    }
    that.setData({
      shopCartData: allData
    },function(){
      that.getAllPrice(allData);
    });
  },
  getItemIdData:function(itemId){
    var that = this;
    var shopCartData = that.data.shopCartData;
    var returnData = {};
    if (shopCartData && shopCartData.length > 0){
      for (var i = 0; i < shopCartData.length; i++) {
        if (shopCartData[i].goodsSpecs.priceList[0].itemId == itemId){
          returnData.data = shopCartData[i];
          returnData.index = i;
          return returnData;
        }
      }
    }
  },
  getAllPrice: function(data){
    var that = this;
    var allCrossPrice = 0;
    var allNormalPrice = 0;
    var allCrossCount = 0;
    var allNormalCount = 0;
    for (var i = 0; i < data.length; i++){
      if(data[i].status != 'lose'){
        if (data[i].type == 0 && data[i].status == 'selected') {
          allCrossPrice += data[i].goodsSpecs.priceList[0].price * data[i].quantity;
          allCrossCount += data[i].quantity;
        } else if (data[i].type == 2 && data[i].status == 'selected') {
          allNormalPrice += data[i].goodsSpecs.priceList[0].price * data[i].quantity;
          allNormalCount += data[i].quantity;
        }
      }
    }
    that.setData({
      allCrossPrice: allCrossPrice.toFixed(2),
      allNormalPrice: allNormalPrice.toFixed(2),
      allCrossCount: allCrossCount,
      allNormalCount: allNormalCount
    });
  },
  getSelectedData: function(data){
    var that = this;
    var allSelectedData = [];
    data.forEach(function(v,i){
      if (v.status == 'selected'){
        allSelectedData.push(v);
      }
    });
    return allSelectedData;
  },
  shopCartDelete: function(e){
    var that = this;
    var ids = [];
    var shopCartId = e.currentTarget.dataset.id;
    ids.push(shopCartId);
    var data = {
      ids: ids
    };
    wx.showModal({
      title: '温馨提示',
      content: '是否确认删除该商品',
      success: function (res) {
        if (res.confirm) {
          app.delShoppingCartData(that, data);
        }
      }
    })  
  },
  allShopCartDelete: function (e) {
    var ids = [];
    var that = this;
    var allData = that.data.shopCartData;
    var allSelectedData = that.getSelectedData(allData);
    allSelectedData.forEach(function(v,i){
      ids.push(v.id);
    });
    var data = {
      ids: ids
    };
    wx.showModal({
      title: '温馨提示',
      content: '是否确认删除所选商品',
      success: function (res) {
        if (res.confirm) {
          app.delShoppingCartData(that, data);
        }
      }
    })
  },
  touchstart: function (e) {
    var that = this;
    var allData = that.data.shopCartData;
    // allData.forEach(function (v, i) {
    //   if (v.isTouchMove){
    //     v.isTouchMove = false;
    //   }
    // })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      shopCartData: allData
    })
  },
  touchmove: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;//当前索引
    var startX = that.data.startX;//开始X坐标
    var startY = that.data.startY;//开始Y坐标
    var touchMoveX = e.changedTouches[0].clientX;//滑动变化坐标
    var touchMoveY = e.changedTouches[0].clientY;//滑动变化坐标
    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });//获取滑动角度
    var allData = that.data.shopCartData;
    allData.forEach(function (v, i) {
      v.isTouchMove = false;
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) {return}
      if (i == index) {
        if (touchMoveX > startX){
          v.isTouchMove = false;  //右滑
        } else {
          v.isTouchMove = true;   //左滑
        } 
      }
    })
    //更新数据
    that.setData({
      shopCartData: allData
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del: function (e) {
    var that = this;
    var allData = that.data.shopCartData;
    allData.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      shopCartData: allData
    })
  },
  changeStatus:function(e){
    var that = this;
    var allData = that.data.shopCartData;
    var statusNum = 0;
    var shopCartStatus = e.detail.shopCartStatus;
    that.setData({
      shopCartStatus: shopCartStatus
    });
    if (shopCartStatus == 'delete'){
      allData.forEach(function (v, i) {
        if (v.status != "lose"){
          v.status = '';
        }
      });
      that.getAllPrice(allData);
      that.setData({
        selectedNum: 0,
        shopCartData: allData,
        allChooseStatus: ''
      });
    }else{
      allData.forEach(function (v, i) {
        if (v.status != "lose") {
          v.status = 'selected';
        }
      });
      that.getAllPrice(allData);
      for (var i = 0; i < allData.length; i++) {
        if (allData[i].status != 'lose') {
          statusNum++;
        }
      }
      that.setData({
        selectedNum: statusNum,
        shopCartData: allData,
        allChooseStatus: 'selected'
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.shopDetailQuery(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideTabBar({});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.isLogin == false) {
      wx.navigateTo({
        url: '/web/loginChoose/loginChoose'
      })
      return;
    }
    app.getShoppingCartData(that, {});
    var userId = wx.getStorageSync('userId');
    if (userId) {
      app.getShoppingCartCount(that, {});
    } else {
      that.setData({
        'footerData.shoppingCartCount': 0
      });
    }
    that.setData({
      allChooseStatus: 'selected'
    });
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