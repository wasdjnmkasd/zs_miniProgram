const app = getApp();
Component({
  properties: {
    activityData_3: Object
  },
  data: {
    imgHost: app.globalData.imgHost,
    showMore: false
  },
  methods: {
    statistics: function (e) {
      var data = {
        type: '小程序新品推荐',
        userId: wx.getStorageSync('userId') || 0,
        shopId: wx.getStorageSync('shopId') || 2,
        goodsId: e.currentTarget.dataset.goodsid,
        logsName: 'statistics'
      }
      app.setStatistics(data);
    },
    getMore: function () {
      var that = this;
      that.setData({
        showMore: !that.data.showMore
      })
    }
  }
});