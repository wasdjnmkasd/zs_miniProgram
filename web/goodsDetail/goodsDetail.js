const app = getApp();
const FileSystemManager =  wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerData: {
      imgs: [],
      imgHeight: '560rpx',//图片高度
      imgWidth: '560rpx',
      indicatorDots: true,//是否显示面板指示点
      autoplay: true, //是否自动轮播
      interval: 5000, //自动切换时间间隔
      duration: 500, //滑动动画时长
      circular: true //	是否采用衔接滑动
    },
    imgHost: app.globalData.imgHost,
    alertShow: false,
    attrValueList: [],
    quantity: 1,
    alertShare: false,
    hidden: true,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
    activeType: 0
  },
  showShare: function(){
    var that = this;
    that.setData({
      alertShare: true
    });
  },
  hideShare: function(){
    var that = this;
    that.setData({
      alertShare: false
    });
  },
  goHome: function(){
    wx.switchTab({
      url: '/web/index/index',
    })
  },
  goShopCart: function () {
    wx.switchTab({
      url: '/web/shoppingCart/shoppingCart',
    })
  },
  imageLoad: function (e) {
    var that = this;
    var detailList = that.data.goodsDetailData.detailList;
    var index = e.currentTarget.dataset.index;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = wx.getSystemInfoSync().windowWidth,
      viewHeight = viewWidth / ratio;
    detailList[index].width = viewWidth + 'px';
    detailList[index].height = viewHeight + 'px';
    that.setData({
      'goodsDetailData.detailList': detailList
    });
  },
  numAdd: function(e){
    var that = this;
    if (JSON.stringify(e.currentTarget.dataset) == '{}'){
      return;
    }
    var maxNum = e.currentTarget.dataset.max || 999999;
    var stock = e.currentTarget.dataset.stock;
    var itemId = e.currentTarget.dataset.itemid;
    var quantity = that.data.quantity;
    if (quantity < maxNum && quantity < stock) {
      quantity++;
      that.setData({
        quantity: quantity
      });
    } else {
      wx.showToast({
        title: '已超过最大购买数量',
        icon: 'none',
        duration: 1000
      });
    }
  },
  numMinus: function(e){
    var that = this;
    if (JSON.stringify(e.currentTarget.dataset) == '{}') {
      return;
    }
    var minNum = e.currentTarget.dataset.min || 1;
    var stock = e.currentTarget.dataset.stock;
    var itemId = e.currentTarget.dataset.itemid;
    var quantity = that.data.quantity;
    if (quantity > minNum) {
      quantity--;
      that.setData({
        quantity: quantity
      });
    } else {
      wx.showToast({
        title: '购买数量不得低于最小购买量',
        icon: 'none',
        duration: 1000
      });
    }
  },
  numChange: function(e){
    var that = this;
    if (JSON.stringify(e.currentTarget.dataset) == '{}') {
      that.setData({
        quantity: 1
      });
    }
    var maxNum = e.currentTarget.dataset.max || 999999;
    var minNum = e.currentTarget.dataset.min || 1;
    var stock = e.currentTarget.dataset.stock;
    var itemId = e.currentTarget.dataset.itemid;
    var num = e.detail.value;
    var quantity = 1;
    if (num < minNum) {
      quantity = minNum;
      wx.showToast({
        title: '购买数量不得低于最小购买量',
        icon: 'none',
        duration: 1000
      });
    }
    if (num >= minNum && num <= stock && num <= maxNum) {
      quantity = num;
    }
    if (num > stock) {
      if (stock > maxNum) {
        quantity = maxNum;
        wx.showToast({
          title: '购买数量不得超过最大购买量',
          icon: 'none',
          duration: 1000
        });
      } else {
        quantity = stock;
        wx.showToast({
          title: '购买数量不得超过最大库存量',
          icon: 'none',
          duration: 1000
        });
      }
    }
    if (num > maxNum){
      if (maxNum > stock){
        quantity = stock;
        wx.showToast({
          title: '购买数量不得超过最大库存量',
          icon: 'none',
          duration: 1000
        });
      }else{
        quantity = maxNum;
        wx.showToast({
          title: '购买数量不得超过最大购买量',
          icon: 'none',
          duration: 1000
        });
      }
    }
    if (num == maxNum){
      if (maxNum > stock) {
        quantity = stock;
        wx.showToast({
          title: '购买数量不得超过最大库存量',
          icon: 'none',
          duration: 1000
        });
      } else {
        quantity = maxNum;
      }
    }
    that.setData({
      quantity: quantity
    });
  },
  goodsToBuy: function(){
    var that = this;
    var data = {};
    var isToBuy = false;
    var userId = wx.getStorageSync('userId');
    if (that.data.alertShow == false) {
      that.setData({
        alertShow: true
      });
    } else if (that.data.alertShow) {
      if (!userId) {
        wx.navigateTo({
          url: '/web/loginChoose/loginChoose',
        })
        return;
      }
      var chooseItemData = that.data.chooseItemData;
      var goodsDetailData = that.data.goodsDetailData;
      if (goodsDetailData.goodsSpecsList.length == 1) {
        chooseItemData = goodsDetailData.goodsSpecsList[0];
      }
      if (chooseItemData) {
        data[goodsDetailData.type] = {};
        data[goodsDetailData.type][goodsDetailData.supplierId] = {};
        data[goodsDetailData.type][goodsDetailData.supplierId].type = goodsDetailData.type;
        if (goodsDetailData.type == 0){
          data[goodsDetailData.type][goodsDetailData.supplierId].typeName = "跨境";
        } else if (goodsDetailData.type == 2){
          data[goodsDetailData.type][goodsDetailData.supplierId].typeName = "一般贸易";
        }
        data[goodsDetailData.type][goodsDetailData.supplierId].supplierId = goodsDetailData.supplierId;
        data[goodsDetailData.type][goodsDetailData.supplierId].supplierName = goodsDetailData.supplierName;
        data[goodsDetailData.type][goodsDetailData.supplierId].supplierPrice = that.data.quantity * chooseItemData.priceList[0].price;
        data[goodsDetailData.type][goodsDetailData.supplierId].supplierWeight = that.data.quantity * chooseItemData.weight;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj = {};
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId] = chooseItemData;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].freePost = goodsDetailData.freePost;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].freeTax = goodsDetailData.freeTax;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].incrementTax = 0.16;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].quantity = that.data.quantity;
        if (goodsDetailData.goodsFileList){
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemImg = goodsDetailData.goodsFileList[0].path;
        }else{
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemImg ='';
        }
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemName = goodsDetailData.customGoodsName;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs = {};
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['goodsId'] = chooseItemData.goodsId;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['itemCode'] = chooseItemData.itemCode;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['itemId'] = chooseItemData.itemId;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['sku'] = chooseItemData.sku;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['info'] = chooseItemData.info;
        data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['unit'] = chooseItemData.unit;
        if (chooseItemData.info){
          var info = '';
          var d = JSON.parse(chooseItemData.info);
          for (let k in d){
            info += (d[k] + '、');
          }
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].infoStr = info;
        }
        data[goodsDetailData.type][goodsDetailData.supplierId].taxFee = 0;
        data[goodsDetailData.type][goodsDetailData.supplierId].postFee = 0;
        data[goodsDetailData.type][goodsDetailData.supplierId].exciseTaxFee = 0;
        data[goodsDetailData.type][goodsDetailData.supplierId].incrementTaxFee = 0;
        data[goodsDetailData.type][goodsDetailData.supplierId].tdq = 1;
        if (goodsDetailData.type == 0){
          if (that.data.quantity * chooseItemData.priceList[0].price > 2000){
            if (that.data.quantity == 1){
              isToBuy = true;
            }else{
              isToBuy = false;
              wx.showToast({
                title: '跨境商品订单不得超过2000元',
                icon: 'none',
                duration: 1000
              })  
            }
          }else{
            isToBuy = true;
          }
          if (isToBuy){
            wx.setStorageSync('ordersInfo', data);
            wx.navigateTo({
              url: '/web/orderSure/orderSure',
            })
          }
        } else if (goodsDetailData.type == 2){
          wx.setStorageSync('ordersInfo', data);
          wx.navigateTo({
            url: '/web/orderSure/orderSure',
          })
        }
      } else {
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 1000
        });
        return;
      }
    }
  },
  goodsAddShopCart: function(){
    var that = this;
    var data = {};
    var userId = wx.getStorageSync('userId');
    if(that.data.alertShow == false){
      that.setData({
        alertShow: true
      });
    } else if (that.data.alertShow){
      if(!userId){
        wx.navigateTo({
          url: '/web/loginChoose/loginChoose',
        })
        return;
      }
      var goodsDetailData = that.data.goodsDetailData;
      var chooseItemData = that.data.chooseItemData;
      if (goodsDetailData.goodsSpecsList.length == 1){
        chooseItemData = goodsDetailData.goodsSpecsList[0];
      }
      if (chooseItemData){
        data.goodsImg = goodsDetailData.goodsFileList && goodsDetailData.goodsFileList[0].path || '';
        data.goodsName = goodsDetailData.customGoodsName;
        data.itemId = chooseItemData.priceList[0].itemId;
        data.maxNum = chooseItemData.priceList[0].max;
        data.stock = chooseItemData.stock;
        data.quantity = that.data.quantity;
        data.supplierId = goodsDetailData.supplierId;
        data.supplierName = goodsDetailData.supplierName;
        data.type = goodsDetailData.type;
        data.unit = chooseItemData.unit;
        app.addShopCart(that, data);
      }else{
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 1000
        });
        return;
      }
    }
  },
  alertContent: function(){
    var that = this;
    that.setData({
      alertShow: !that.data.alertShow
    });
  },
  distachAttrValue: function (commodityAttr) {
    // var that = this;
    // var selectSku = [];
    // var selectStr = {};
    // var attrValueList = that.data.attrValueList;
    // for (var i = 0; i < commodityAttr.length; i++) {
    //   if (commodityAttr[i].attrValueList){
    //     for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
    //       var attrIndex = that.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
    //       if (attrIndex >= 0) {
    //         if (!that.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
    //           attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
    //         }
    //       } else {
    //         attrValueList.push({
    //           attrKey: commodityAttr[i].attrValueList[j].attrKey,
    //           attrValues: [commodityAttr[i].attrValueList[j].attrValue]
    //         });
    //       }
    //     }
    //   }
    // }
    // for (var i = 0; i < attrValueList.length; i++) {
    //   for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
    //     if (attrValueList[i].attrValueStatus) {
    //       attrValueList[i].attrValueStatus[j] = true;
    //     } else {
    //       attrValueList[i].attrValueStatus = [];
    //       attrValueList[i].attrValueStatus[j] = true;
    //     }
    //   }
    // }
    // that.setData({
    //   attrValueList: attrValueList
    // });
    // attrValueList.forEach(function(v,i){
    //   that.selectValue(attrValueList, i, v.attrKey, v.attrValues[0]);
    // });
    // for (var i = 0; i < that.data.attrValueList.length; i++) {
    //   var data = {};
    //   if (!that.data.attrValueList[i].selectedValue) {
    //     break;
    //   }
    //   data.attrKey = that.data.attrValueList[i].attrKey;
    //   data.attrValue = that.data.attrValueList[i].selectedValue;
    //   selectSku.push(data);
    // }
    // selectSku.forEach(function (v1, i1) {
    //   selectStr[v1.attrKey] = v1.attrValue
    // });
    // that.setData({
    //   chooseItemData: ''
    // });
    // var haveSku = false;
    // that.data.goodsDetailData.goodsSpecsList.forEach(function (v2, i2) {
    //   if (JSON.stringify(selectStr) == v2.info) {
    //     var _selectSku = [];
    //     selectSku.forEach(function (v, i) {
    //       _selectSku.push(v.attrValue);
    //     })
    //     that.setData({
    //       chooseItemData: v2,
    //       quantity: v2.priceList[0].min || 1,
    //       selectSku: _selectSku.join('、')
    //     });
    //   }
    // });
    var attrValueList = this.data.attrValueList;
    for (var i = 0; i < commodityAttr.length; i++) {
      if (commodityAttr[i].attrValueList) {
        for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
          var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
          if (attrIndex >= 0) {
            if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
              attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
            }
          } else {
            attrValueList.push({
              attrKey: commodityAttr[i].attrValueList[j].attrKey,
              attrValues: [commodityAttr[i].attrValueList[j].attrValue]
            });
          }
        }
      }
    }
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },
  getAttrIndex: function (attrName, attrValueList) {
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  selectAttrValue: function (e) {
    var that = this;
    var attrValueList = that.data.attrValueList;
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    var goodsDetailData = that.data.goodsDetailData;
    var selectSku = [];
    var selectStr = {};
    that.setData({
      chooseItemData: '',
      quantity: 0,
      selectSku: ''
    });
    if (e.currentTarget.dataset.status || index == that.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        that.disSelectValue(attrValueList, index, key, value);
      } else {
        that.selectValue(attrValueList, index, key, value);
      }
    }
    for (var i = 0; i < that.data.attrValueList.length; i++) {
      var data = {};
      if (!that.data.attrValueList[i].selectedValue) {
        break;
      }
      data.attrKey = that.data.attrValueList[i].attrKey;
      data.attrValue = that.data.attrValueList[i].selectedValue;
      selectSku.push(data);
    }
    selectSku.forEach(function(v1,i1){
      selectStr[v1.attrKey] = v1.attrValue
    });
    that.setData({
      chooseItemData: ''
    });
    goodsDetailData.goodsSpecsList.forEach(function(v2,i2){
      if(JSON.stringify(selectStr) == v2.info){
        var _selectSku = [];
        selectSku.forEach(function(v,i){
          _selectSku.push(v.attrKey + '：' + v.attrValue);
        })
        that.setData({
          chooseItemData: v2,
          quantity: v2.priceList[0].min || 1,
          selectSku: _selectSku.join(';')
        });
      }
    });
  },
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) {
      var commodityAttr = this.data.commodityAttr;
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;
    // for (var i = 0; i < attrValueList.length; i++) {
    //   for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
    //     attrValueList[i].attrValueStatus[j] = false;
    //   }
    // }
    for (var k = 0; k < attrValueList.length; k++) {
      for (var i = 0; i < includeGroup.length; i++) {
        for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
          if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
            for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
              if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
                attrValueList[k].attrValueStatus[m] = true;
              }
            }
          }
        }
      }
    }
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });

    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) {
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
  },
  disSelectValue: function (attrValueList, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });

    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
  }, 
  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      return r[2]
    }
    return null;
  },
  share: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    var data = {
      goodsId: goodsId
    };
    app.getShareImg(that,data);
    that.hideShare();
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var data = {
      type: '小程序商详生成分享图片',
      userId: wx.getStorageSync('userId') || 0,
      shopId: wx.getStorageSync('shopId') || 2,
      goodsId: that.data.goodsDetailData.goodsId,
      logsName: 'statistics'
    }
    app.setStatistics(data);
  },
  save: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImg(that.data.prurl);
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
          that.saveImg(that.data.prurl);
          var data = {
            type: '小程序商详保存分享图片',
            userId: wx.getStorageSync('userId') || 0,
            shopId: wx.getStorageSync('shopId') || 2,
            goodsId: that.data.goodsDetailData.goodsId,
            logsName: 'statistics'
          }
          app.setStatistics(data);
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
  saveImg: function(url){
    var that = this;
    var data = wx.base64ToArrayBuffer(url.slice(22,-1));
    FileSystemManager.writeFile({
      filePath: `${wx.env.USER_DATA_PATH}/qrcode.png`,
      data: data,
      encoding: 'binary',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: `${wx.env.USER_DATA_PATH}/qrcode.png`,
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
  toChoose: function(){
    var userId = wx.getStorageSync('userId');
    if (userId){
      wx.navigateTo({
        url: '/web/addressManage/addressManage?btnHide=1',
      })
    }else{
      wx.navigateTo({
        url: '/web/loginChoose/loginChoose?isBack=1',
      })
    }
  },
  defaultScroll: function (e) {
    var top = e.detail.scrollTop;
    var that = this;
    var top_1 = that.data.top_1;
    var top_2 = that.data.top_2;
    if (top > 300) {
      that.setData({
        toTopShow: true
      })
    }else{
      that.setData({
        toTopShow: false
      })
    }
    if (top > 0 && top <= top_1){
      that.setData({
        activeType: 0
      })
    } else if (top > top_1 && top <= top_2) {
      that.setData({
        activeType: 1
      })
    } else if (top > top_2) {
      that.setData({
        activeType: 2
      })
    }
  },
  toTop: function () {
    var that = this;
    that.setData({
      scrollHeight: 0
    });
  },
  chooseActiveType: function(e){
    var that = this;
    var activeType = e.target.dataset.id;
    that.setData({
      activeType: activeType
    })
    if (activeType == 0){
      that.setData({
        scrollHeight: 0
      })
    } else if (activeType == 1){
      that.setData({
        toView: 'goodsDetail-moreMsg'
      })
    } else if (activeType == 2){
      that.setData({
        toView: 'goodsDetail-detailMsg'
      })
    }
  },
  statistics_friend: function (e) {
    var that = this;
    var data = {
      type: '小程序商详分享给朋友',
      userId: wx.getStorageSync('userId') || 0,
      shopId: wx.getStorageSync('shopId') || 2,
      goodsId: that.data.goodsDetailData.goodsId,
      logsName: 'statistics'
    }
    app.setStatistics(data);
    that.setData({
      alertShare: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId = wx.getStorageSync('userId') || '';
    if (!options.scene){
      if (options && (options.goodsId || options.itemId)) {
        var data = {
          goodsId: options.goodsId || options.itemId,
          type: 'normal'
        };
        app.getGoodsDetailData(that, data);
      } else if (options && options.q) {
        var url = decodeURIComponent(options.q);
        var urlGoodsId;
        if(url.indexOf('goodsDetail') != -1){
          urlGoodsId = that.getQueryString(url, 'goodsId');
        }else{
          var urlArr = url.split('?')[0].split('/');
          urlGoodsId = urlArr[urlArr.length - 1].split('.')[0];
        }
        var data = {
          goodsId: urlGoodsId,
          type: 'scan'
        };
        app.getGoodsDetailData(that, data);
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    }else{
      var scene = decodeURIComponent(options.scene);
      var goodsId = null;
      var sceneArr = scene.split('&');
      sceneArr.forEach(function (v, i) {
        if (v.split('=')[0] == 'goodsId') {
          goodsId = v.split('=')[1];
        }
      });
      if (goodsId) {
        var d = {
          goodsId: goodsId,
          type: 'scan'
        };
        app.getGoodsDetailData(that, d);
      }else{
        wx.switchTab({
          url: '/web/index/index',
        })
      }
    }
    if (options.isShare){
      var data = {
        type: '小程序分享进入',
        userId: wx.getStorageSync('userId') || 0,
        shopId: wx.getStorageSync('shopId') || 2,
        goodsId: options.goodsId,
        logsName: 'statistics'
      }
      app.setStatistics(data);
    }
    wx.createSelectorQuery().select('#goodsDetail-moreMsg').boundingClientRect(function (rect) {
      that.setData({
        top_1: rect.top - 60
      });
    }).exec();
    wx.createSelectorQuery().select('#goodsDetail-detailMsg').boundingClientRect(function (rect) {
      that.setData({
        top_2: rect.top
      });
    }).exec();
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
    if (userId) {
      app.getShoppingCartCount(that, {});
    } else {
      that.setData({
        'headerData.shoppingCartCount': 0
      });
    }
    if (userId) {
      app.getAddressData(that, {});
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
    var shopId = app.globalData.shopId;
    var goodsId = that.data.goodsDetailData.goodsId;
    var goodsName = that.data.goodsDetailData.customGoodsName;
    var imageUrl = that.data.goodsDetailData.goodsFileList[0].path;
    return {
      title: goodsName,
      path: 'web/goodsDetail/goodsDetail?scene=goodsId%3D' + goodsId + '%26shopId%3D' + shopId + '%26isShare%3Dtrue',
      imageUrl: imageUrl
    }
  }
})