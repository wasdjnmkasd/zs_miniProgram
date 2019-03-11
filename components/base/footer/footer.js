const app = getApp();
Component({
  properties: {
    footerData: Object
  },
  data: {
    imgHost: app.globalData.imgHost
  },
  methods: {
    toShoppingCart: function(e){
      var that = this;
      var url = e.currentTarget.dataset.url;
      var userId = wx.getStorageSync('userId');
      if (userId){
        wx.switchTab({
          url: url,
        })
      }else{
        wx.navigateTo({
          url: '/web/loginChoose/loginChoose',
        })
      }
    }
  }
});