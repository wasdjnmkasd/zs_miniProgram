const app = getApp();
Component({
  properties: {
    activityData_4: Object
  },
  data: {
    imgHost: app.globalData.imgHost
  },
  methods: {
    statistics: function(e){
      var data = {
        type: '小程序本周特卖',
        userId: wx.getStorageSync('userId') || 0,
        shopId: wx.getStorageSync('shopId') || 2,
        goodsId: e.currentTarget.dataset.goodsid,
        logsName: 'statistics'
      }
      app.setStatistics(data);
    }
  }
});