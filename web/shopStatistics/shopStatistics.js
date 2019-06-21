import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
var initChart1_0 = null;
var initChart2_0 = null;
var initChart1_1 = null;
var initChart1_2 = null;
var initChart1_3 = null;
var initChart1_4 = null;
var initChart2_1 = null;
var initChart2_2 = null;
var initChart2_3 = null;
var initChart2_4 = null;
Page({
  data: {
    ec1_0: {
      onInit: function (canvas, width, height) {
        initChart1_0 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart1_0);
        return initChart1_0;
      }
    },
    ec2_0: {
      onInit: function (canvas, width, height) {
        initChart2_0 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart2_0);
        return initChart2_0;
      }
    },
    ec1_1: {
      onInit: function (canvas, width, height) {
        initChart1_1 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart1_1);
        return initChart1_1;
      }
    },
    ec1_2: {
      onInit: function (canvas, width, height) {
        initChart1_2 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart1_2);
        return initChart1_2;
      }
    },
    ec1_3: {
      onInit: function (canvas, width, height) {
        initChart1_3 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart1_3);
        return initChart1_3;
      }
    },
    ec1_4: {
      onInit: function (canvas, width, height) {
        initChart1_4 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart1_4);
        return initChart1_4;
      }
    },
    ec2_1: {
      onInit: function (canvas, width, height) {
        initChart2_1 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart2_1);
        return initChart2_1;
      }
    },
    ec2_2: {
      onInit: function (canvas, width, height) {
        initChart2_2 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart2_2);
        return initChart2_2;
      }
    },
    ec2_3: {
      onInit: function (canvas, width, height) {
        initChart2_3 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart2_3);
        return initChart2_3;
      }
    },
    ec2_4: {
      onInit: function (canvas, width, height) {
        initChart2_4 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(initChart2_4);
        return initChart2_4;
      }
    },
    activeId_1: 1,
    activeId_2: '1_0',
    type: 0
  },
  chooseType: function(e){
    var that = this;
    var activeId_1 = e.currentTarget.dataset.id;
    var data = {}
    that.setData({
      activeId_1: activeId_1,
      activeId_2: activeId_1 + '_0',
      type: 0,
    })
    if (activeId_1 == 1){
      data.time = 7;
    }else{
      data.time = 30;
    }
    that.getStaticData(data);
  },
  getStaticData: function(data){
    var that = this;
    var host = app.globalData.host;
    var shopId = app.globalData.shopId;
    var type = that.data.type;
    wx.request({
      url: host + '/ordercenter/1.0/cache/shop/manager/statis?gradeId=' + shopId + '&time=' + data.time,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': app.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          that.setData({
            staticData: res.data.obj
          })
          if(data.time == 7){
            if (type == 0){
              initChart1_0.setOption({
                title: {
                  text: '近7天销售量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#37A2DA", "#67E0E3", "#9FE6B8", "#F8F022"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '访客量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.visitViewList
                  },
                  {
                    name: '浏览量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.pageViewList
                  },
                  {
                    name: '订单量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.orderNumList
                  },
                  {
                    name: '返佣统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.rebateList
                  }
                ]
              });
            } else if (type == 1){
              initChart1_1.setOption({
                title: {
                  text: '近7天访客量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#37A2DA"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '访客量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.visitViewList
                  }
                ]
              });
            } else if (type == 2){
              initChart1_2.setOption({
                title: {
                  text: '近7天浏览量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#67E0E3"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '浏览量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.pageViewList
                  }
                ]
              });
            } else if (type == 3) {
              initChart1_3.setOption({
                title: {
                  text: '近7天订单量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#9FE6B8"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '订单量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.orderNumList
                  }
                ]
              });
            } else if (type == 4) {
              initChart1_4.setOption({
                title: {
                  text: '近7天返佣统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#F8F022"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '返佣统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.rebateList
                  }
                ]
              });
            }
          }else if(data.time == 30){
            if (type == 0){
              initChart2_0.setOption({
                title: {
                  text: '近30天销售量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#37A2DA", "#67E0E3", "#9FE6B8", "#F8F022"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-31), that.getDay(-30), that.getDay(-29), that.getDay(-28), that.getDay(-27), that.getDay(-26), that.getDay(-25), that.getDay(-24), that.getDay(-23), that.getDay(-22), that.getDay(-21), that.getDay(-20), that.getDay(-19), that.getDay(-18), that.getDay(-17), that.getDay(-16), that.getDay(-15), that.getDay(-14), that.getDay(-13), that.getDay(-12), that.getDay(-11), that.getDay(-10), that.getDay(-9), that.getDay(-8), that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '访客量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.visitViewList
                  },
                  {
                    name: '浏览量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.pageViewList
                  },
                  {
                    name: '订单量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.orderNumList
                  },
                  {
                    name: '返佣统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.rebateList
                  }
                ]
              });
            } else if (type == 1){
              initChart2_1.setOption({
                title: {
                  text: '近30天访客量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#37A2DA"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-31), that.getDay(-30), that.getDay(-29), that.getDay(-28), that.getDay(-27), that.getDay(-26), that.getDay(-25), that.getDay(-24), that.getDay(-23), that.getDay(-22), that.getDay(-21), that.getDay(-20), that.getDay(-19), that.getDay(-18), that.getDay(-17), that.getDay(-16), that.getDay(-15), that.getDay(-14), that.getDay(-13), that.getDay(-12), that.getDay(-11), that.getDay(-10), that.getDay(-9), that.getDay(-8), that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '访客量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.visitViewList
                  }
                ]
              });
            } else if (type == 2) {
              initChart2_2.setOption({
                title: {
                  text: '近30天浏览量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#67E0E3"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-31), that.getDay(-30), that.getDay(-29), that.getDay(-28), that.getDay(-27), that.getDay(-26), that.getDay(-25), that.getDay(-24), that.getDay(-23), that.getDay(-22), that.getDay(-21), that.getDay(-20), that.getDay(-19), that.getDay(-18), that.getDay(-17), that.getDay(-16), that.getDay(-15), that.getDay(-14), that.getDay(-13), that.getDay(-12), that.getDay(-11), that.getDay(-10), that.getDay(-9), that.getDay(-8), that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '浏览量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.pageViewList
                  }
                ]
              });
            } else if (type == 3) {
              initChart2_3.setOption({
                title: {
                  text: '近30天订单量统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#9FE6B8"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-31), that.getDay(-30), that.getDay(-29), that.getDay(-28), that.getDay(-27), that.getDay(-26), that.getDay(-25), that.getDay(-24), that.getDay(-23), that.getDay(-22), that.getDay(-21), that.getDay(-20), that.getDay(-19), that.getDay(-18), that.getDay(-17), that.getDay(-16), that.getDay(-15), that.getDay(-14), that.getDay(-13), that.getDay(-12), that.getDay(-11), that.getDay(-10), that.getDay(-9), that.getDay(-8), that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '订单量统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.orderNumList
                  }
                ]
              });
            } else if (type == 4) {
              initChart2_4.setOption({
                title: {
                  text: '近30天返佣统计',
                  left: 'left',
                  textStyle: {
                    fontSize: 16
                  },
                  padding: [0, 0, 0, 30]
                },
                color: ["#F8F022"],
                grid: {
                  containLabel: true,
                  top: '18%',
                  bottom: '0',
                  left: '5%',
                  right: '6%'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [that.getDay(-31), that.getDay(-30), that.getDay(-29), that.getDay(-28), that.getDay(-27), that.getDay(-26), that.getDay(-25), that.getDay(-24), that.getDay(-23), that.getDay(-22), that.getDay(-21), that.getDay(-20), that.getDay(-19), that.getDay(-18), that.getDay(-17), that.getDay(-16), that.getDay(-15), that.getDay(-14), that.getDay(-13), that.getDay(-12), that.getDay(-11), that.getDay(-10), that.getDay(-9), that.getDay(-8), that.getDay(-7), that.getDay(-6), that.getDay(-5), that.getDay(-4), that.getDay(-3), that.getDay(-2), that.getDay(-1)],
                  // show: false
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                series: [
                  {
                    name: '返佣统计',
                    type: 'line',
                    smooth: true,
                    data: res.data.obj.rebateList
                  }
                ]
              });
            }
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '获取银行卡列表失败，请稍后再试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getDay: function(day){
    var that = this;
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = that.doHandleMonth(tMonth + 1);
    tDate = that.doHandleMonth(tDate);
    return tMonth + "-" + tDate;
  },
  doHandleMonth: function (month){
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  },
  changeCanvas: function(e){
    var that = this;
    var data = {};
    var type = e.currentTarget.dataset.id;
    var activeId_1 = that.data.activeId_1;
    that.setData({
      activeId_2: activeId_1 + '_' + type,
      type: type
    })
    if (activeId_1 == 1) {
      data.time = 7;
    } else {
      data.time = 30;
    }
    that.getStaticData(data);
  },
  locationTo: function(e){
    var goodsId = e.currentTarget.dataset.id;
    if (goodsId){
      wx.navigateTo({
        url: '/web/goodsDetail/goodsDetail?goodsId=' + goodsId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var data = {
      time: 7
    }
    that.getStaticData(data);
    app.getManagerIndexData(that);
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

  }
});