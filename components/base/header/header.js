const app = getApp();
Component({
  properties: {
    headerData: Object
  },
  data:{
    imgHost: app.globalData.imgHost,
    shopCartStatus: 'normal'
  },
  methods: {
    changeStatus: function(){
      var that = this;
      var shopCartStatus = that.data.shopCartStatus;
      var newStatus = 'normal';
      if (shopCartStatus == 'normal'){
        newStatus = 'delete';
      } else if (shopCartStatus == 'delete'){
        newStatus = 'normal';
      }
      that.triggerEvent('changeStatus', {
        shopCartStatus: newStatus
      }, {})
      that.setData({
        shopCartStatus: newStatus
      });
    },
    toBack: function(){
      wx.navigateBack({
        delta: 1
      })
    },
    toShoppingCart: function (e) {
      var that = this;
      var url = e.currentTarget.dataset.url;
      var userId = wx.getStorageSync('userId');
      if (userId) {
        wx.switchTab({
          url: url,
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您尚未登录，是否登录？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/web/login/login',
              })
            }
          }
        })
      }
    },
    scanCode: function(){
      wx.scanCode({
        success: (res) => {
          wx.navigateTo({
            url: res.result,
          })
        }
      })
    },
    toNews: function(){
      wx.showToast({
        title: '功能正在开发中，敬请期待~',
        icon: 'none',
        duration: 1500
      })
    },
    search: function(e){
      var that = this;
      var searchName = e.detail.value;
      wx.navigateTo({
        url: '/web/searchProduct/searchProduct?goodsName=' + searchName,
      })
    }
  }
});