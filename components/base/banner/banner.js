const app = getApp();
Component({
  properties: {
    bannerData: Object
  },
  data: {
    imgHost: app.globalData.imgHost
  },
  methods: {
    showContent: function () {
      wx.showModal({
        title: '跨境须知',
        showCancel: false,
        content: '★收到物品务必先验货后签收！消费者购买跨境贸易电子商务进口商品，以“个人自用、合理数量”为原则，根据财政部、海关总署及国家税务总局的要求，经国务院批准每次限值为2000元人民币，单笔订单超出2000元系统将予以退单，不管数量、单件、多种商品这些条件；消费者全国跨境城市范围内，个人年度累计消费金额超2万，自动退单；对于违反规定，超出个人自用合理数量购买的，系统将予以退单，情节严重的，将追究个人法律责任。',
        success: function (res) {}
      })
    }
  }
});