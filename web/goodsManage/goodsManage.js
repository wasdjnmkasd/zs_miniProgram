const app = getApp();
const FileSystemManager = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHost: app.globalData.imgHost,
    icon_type: 'bottom_0',
    dataId: null,
    inputShow: false,
    searchValue: null,
    goodsName: '',
    sortName: 'sale_num',
    sortRule: 'asc',
    currentPage: 1,
    numPerPage: 10,
    scrollTop: 0, 
    alertShare: false,
    hidden: true,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true
  },
  watch: {
    tagId: function (newVal, oldVal) {
      var that = this;
      var data = {
        currentPage: 1,
        numPerPage: 10,
        sortName: that.data.sortName,
        sortRule: that.data.sortRule,
        scrollTop: 0
      };
      var goodsName = that.data.goodsName || '';
      var first = that.data.first || null;
      var tagId = newVal || null;
      goodsName && (data.goodsName = goodsName);
      first && (data.first = first);
      tagId && (data.tagId = tagId);
      app.getGoodsManageData(that, data);
    }
  },
  chooseItem: function(e){
    var that = this;
    var newId = e.currentTarget.dataset.id;
    var oldId = that.data.dataId;
    var inputShow = that.data.inputShow;
    var first = that.data.first;
    var tagId = that.data.tagId;
    var type;
    var data = {
      goodsName: that.data.goodsName,
      currentPage: 1,
      numPerPage: 10
    };
    first && (data.first = first);
    tagId && (data.tagId = tagId);
    if (!inputShow){
      that.setData({
        goodsName: ''
      })
      data.goodsName = '';
    }
    if (newId == 0) {
      data.sortName = 'sale_num';
    }else if(newId == 1){
      data.sortName = 'rebate';
    }else if(newId == 2){
      data.sortName = 'fxqty';
    }else if(newId == 3){
      data.sortName = 'update_time';
    }
    that.setData({
      sortName: data.sortName,
      scrollTop: 0,
      currentPage: 1,
      numPerPage: 10
    });
    
    if (that.data.icon_type){
      type = that.data.icon_type.split('_')[0];
    }
    if (newId == oldId){
      if(type == 'top'){
        data.sortRule = 'asc';
        that.setData({
          icon_type: 'bottom_' + newId,
          sortRule: 'asc'
        });
      } else if (type == 'bottom'){
        data.sortRule = 'desc';
        that.setData({
          icon_type: 'top_' + newId,
          sortRule: 'desc'
        });
      }
    }else{
      data.sortRule = 'desc';
      that.setData({
        icon_type: 'top_' + newId,
        dataId: newId,
        sortRule: 'desc'
      });
    }
    app.getGoodsManageData(that, data);
  },
  showSearch: function(){
    var that = this;
    var inputShow = that.data.inputShow;
    that.setData({
      inputShow: !inputShow
    })
  },
  getMoreData: function(){
    var that = this;
    var goodsName = that.data.goodsName || '';
    var sortName = that.data.sortName;
    var sortRule = that.data.sortRule;
    var currentPage = that.data.currentPage;
    var numPerPage = that.data.numPerPage;
    var totalPages = that.data.totalPages;
    var oldData = that.data.goodsManageData;
    var first = that.data.first;
    var tagId = that.data.tagId;
    if (currentPage < totalPages){
      currentPage ++;
      that.setData({
        currentPage: currentPage
      })
      var data = {
        goodsName: goodsName,
        sortName: sortName,
        sortRule: sortRule,
        currentPage: currentPage,
        numPerPage: numPerPage
      }
      first && (data.first = first);
      tagId && (data.tagId = tagId);
      app.getGoodsManageData(that, data, oldData);
    }
  },
  searchProduct: function(e){
    var that = this;
    var goodsName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value;
    var first = that.data.first;
    var tagId = that.data.tagId;
    that.setData({
      goodsName: goodsName
    })
    var data = {
      goodsName: goodsName,
      sortName: that.data.sortName,
      sortRule: that.data.sortRule,
      currentPage: that.data.currentPage,
      numPerPage: that.data.numPerPage
    }
    first && (data.first = first);
    tagId && (data.tagId = tagId);
    app.getGoodsManageData(that, data);
  },
  toGoodsDetail: function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/web/goodsDetail/goodsDetail?goodsId=' + goodsId,
    })
  },
  toBuy: function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/web/goodsDetail/goodsDetail?goodsId=' + goodsId,
    })
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
        }
      }
    })
  },
  saveImg: function (url) {
    var that = this;
    var data = wx.base64ToArrayBuffer(url.slice(22, -1));
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
  share: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    var data = {
      goodsId: goodsId
    };
    app.getShareImg(that, data);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  },
  toNavList: function(){
    wx.navigateTo({
      url: '/web/goodsManage-nav/goodsManage-nav',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setWatcher(that);
    var data = {
      goodsName: '',
      sortName: 'sale_num',
      sortRule: 'asc',
      currentPage: 1,
      numPerPage: 10,
      scrollTop: 0,
    }
    app.getGoodsManageData(that, data);
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
    var that = this;
    that.setData({
      first: null,
      tagId: null
    })
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
  onShareAppMessage: function (res) {
    var that = this;
    var img = res.target.dataset.img || (that.data.imgHost + '/images/platform/account/default_img.jpg');
    var title = res.target.dataset.goodsname;
    var shopId = app.globalData.shopId;
    var goodsId = res.target.dataset.goodsid;
    if(res.from == 'button'){
      return {
        title: title,
        path: 'web/goodsDetail/goodsDetail?scene=goodsId%3D' + goodsId + '%26shopId%3D' + shopId + '%26isShare%3Dtrue',
        imageUrl: img
      }
    }
  }
})