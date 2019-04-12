const watch = require("/utils/watch.js");
App({
  globalData: {
    host: 'https://api.cncoopay.com',
    imgHost: 'https://static.cncoopay.com:8080/wechat',
    nodeHost: 'https://front.cncoopay.com',
    centerId: 2,
    platUserType: 5,
    loginType: 1,
    authentication: wx.getStorageSync('authId') || null
  },
  onLaunch: function (options) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    if(userId){
      that.globalData.isLogin = true;
    }else{
      that.globalData.isLogin = false;
    }
    var scene = decodeURIComponent(options.query.scene);
    var sceneArr = scene.split('&');
    var sceneShopId = null;
    sceneArr.forEach(function (v, i) {
      if (v.split('=')[0] == 'shopId') {
        if (v.split('=')[1] != 0) {
          sceneShopId = v.split('=')[1];
        } else {
          sceneShopId = 2;
        }
      }
    });
    var url = decodeURIComponent(options.query.q);
    var urlShopId = that.getQueryString(url,'shopId');
    var localShopId = wx.getStorageSync('shopId');
    if (localShopId == 0) {
      localShopId = 2;
      wx.setStorageSync('shopId', 2);
    }
    var shopId = (urlShopId * 1) || (sceneShopId * 1) || localShopId || 2;
    that.globalData.shopId = shopId;
    wx.setStorageSync('shopId', shopId);
  },
  onShow: function(options){
    var that = this;
    var scene = decodeURIComponent(options.query.scene);
    var sceneArr = scene.split('&');
    var sceneShopId = null;
    sceneArr.forEach(function (v, i) {
      if (v.split('=')[0] == 'shopId') {
        if (v.split('=')[1] != 0){
          sceneShopId = v.split('=')[1];
        }else{
          sceneShopId = 2;
        }
      }
    });
    var url = decodeURIComponent(options.query.q);
    var urlShopId = that.getQueryString(url, 'shopId');
    var localShopId = wx.getStorageSync('shopId');
    if (localShopId == 0) {
      localShopId = 2;
      wx.setStorageSync('shopId', 2);
    }
    var shopId = (urlShopId * 1) || (sceneShopId * 1) || localShopId || 2;
    that.globalData.shopId = shopId;
    wx.setStorageSync('shopId', shopId);
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  setWatcher(page) {
    watch.setWatcher(page);
  },
  formatSeconds: function (obj, dateTime) {
    var that = this;
    var secondTime = parseInt(dateTime) / 1000;
    var minuteTime = 0;
    var hourTime = 0;
    var nextHour = '00';
    var nextMinute = '00';
    var nextSecond = '00';
    if (secondTime >= 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime >= 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    if (parseInt(secondTime) < 10) {
      nextSecond = '0' + parseInt(secondTime);
    } else {
      nextSecond = parseInt(secondTime);
    }
    if (minuteTime < 10) {
      nextMinute = '0' + parseInt(minuteTime);
    } else {
      nextMinute = parseInt(minuteTime);
    }
    if (hourTime < 10) {
      nextHour = '0' + parseInt(hourTime);
    } else {
      if (hourTime >= 24) {
        nextHour = '00';
      } else {
        nextHour = parseInt(hourTime);
      }
    }
    obj.nextHour = nextHour;
    obj.nextMinute = nextMinute;
    obj.nextSecond = nextSecond;
  },
  getQueryString: function (url, name){
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      return r[2]
    }
    return null;
  },
  wxLogin: function(data){
    var that = this;
    var platUserType = that.globalData.platUserType;
    var centerId = that.globalData.centerId;
    var host = that.globalData.host;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: host + '/3rdcenter/auth/1.0/user/3rdLogin/wxApplet?userType=' + platUserType + '&code=' + res.code + '&centerId=' + centerId,
            method: 'GET',
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data && res.data.success) {
                wx.setStorageSync('openId', res.data.obj.openid);
                if (data && data.type == 'wechat'){
                  if(res.data.obj.isFirst){
                    if (data.status == 'index'){
                      wx.navigateTo({
                        url: '/web/bindMobile/bindMobile?status=' + data.status,
                      })
                    }else{
                      wx.navigateTo({
                        url: '/web/bindMobile/bindMobile',
                      })
                    }
                  }else{
                    var d ={
                      openId: res.data.obj.openid,
                      loginType: 5,
                      userType: platUserType,
                      isFirst: res.data.obj.isFirst
                    }
                    if(data.status){
                      d.status = data.status
                    }
                    that.userLogin('', d);
                  }
                }
              } else if (res.data && !res.data.success) {
                wx.showToast({
                  title: res.data.errorMsg,
                  icon: 'none',
                  duration: 1500
                })
              } else{
                wx.showToast({
                  title: '获取openId失败',
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
        } else {
          wx.showToast({
            title: '获取用户登录态失败！' + res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    });
  },
  userLogin: function (obj, data) {
    var that = this;
    var host = that.globalData.host; 
    var platUserType = that.globalData.platUserType;
    data.platUserType = platUserType;
    var _d = {};
    if (data.loginType == 1){
      _d = {
        platUserType: data.platUserType,
        loginType: data.loginType,
        phone: data.phone,
        userType: data.userType,
        password: data.password
      }
    } else if (data.loginType == 5){
      _d = {
        isFirst: data.isFirst,
        loginType: data.loginType,
        openId: data.openId,
        platUserType: data.platUserType,
        userType: data.userType,
        userCenterId: data.userCenterId
      }
    }
    wx.request({
      url: host + '/authcenter/auth/login',
      method: 'POST',
      data: _d,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data && res.data.success) {
          wx.setStorageSync('authId', '"Bearer "' + res.data.obj.token);
          wx.setStorageSync('userId', res.data.obj.userCenterId);
          that.globalData.authentication = '"Bearer "' + res.data.obj.token;
          that.globalData.isLogin = true;
          if(data.status == 'index'){
            wx.redirectTo({
              url: '/web/bargainIndex/bargainIndex',
            })
            wx.showToast({
              title: '微信授权登录成功',
              icon: 'none',
              duration: 1500
            })
          } else if (data.status == 'goods'){
            wx.redirectTo({
              url: '/web/bargainGoodsDetail/bargainGoodsDetail?goodsRoleId=' + goodsRoleId
            })
            wx.showToast({
              title: '微信授权登录成功',
              icon: 'none',
              duration: 1500
            })
          }else{
            if (data.loginType == 1){
              wx.navigateBack({
                delta: 2
              })
            } else if (data.loginType == 5){
              var pages = getCurrentPages()    //获取加载的页面
              var currentPage = pages[pages.length - 1]    //获取当前页面的对象
              var url = currentPage.route
              if (url == 'web/bindMobile/bindMobile'){
                wx.navigateBack({
                  delta: 2
                })
              }
              wx.navigateBack({
                delta: 1
              })
            }
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var that = this;
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'userLogin',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  userCheck: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var loginType = that.globalData.loginType;
    var platUserType = that.globalData.platUserType;
    wx.request({
      url: host + '/authcenter/auth/check',
      method: 'POST',
      data: {
        platUserType: platUserType,
        loginType: loginType,
        userName: data.account,
        phone: data.account
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data && res.data.obj == false) {
          obj.setData({
            register: false
          });
          if(data.status == 0){
            wx.showToast({
              title: '该手机号未注册',
              icon: 'none',
              duration: 1000
            })
            obj.setData({
              'account.status': 2
            });
          }
        } else {
          obj.setData({
            register: true
          });
          if (data.status == 1) {
            wx.showToast({
              title: '该手机号已注册',
              icon: 'none',
              duration: 1000
            })
            obj.setData({
              'account.status': 2
            });
          }
        }
      },
      fail: function (res) {
        var that = this;
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'userCheck',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  userRegister: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var loginType = that.globalData.loginType;
    var platUserType = that.globalData.platUserType;
    var thirdAccount = wx.getStorageSync('openId');
    var d = {};
    if (data.loginType == 1) {
      d = {
        phone: data.phone,
        centerId: centerId,
        pwd: data.password,
        userCenterId: centerId,
        loginType: data.loginType,
        userType: platUserType
      }
    } else if (data.loginType == 5) {
      d = {
        phone: data.phone,
        centerId: centerId,
        thirdAccount: thirdAccount,
        loginType: data.loginType,
        userType: platUserType
      }
    }
    if (data.shopId) {
      d.shopId = data.shopId;
    }
    wx.request({
      url: host + '/usercenter/auth/1.0/user/register/' + data.invitationCode,
      method: 'POST',
      data: d,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data && res.data.success) {
          var userCenterId = res.data.obj;
          if (data.loginType == 1) {
            wx.request({
              url: host + '/authcenter/auth/register',
              method: 'POST',
              data: {
                phone: data.phone,
                password: data.password,
                userCenterId: userCenterId,
                loginType: loginType,
                platUserType: platUserType,
                invitationCode: data.invitationCode
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                if (res.data && res.data.success) {
                  wx.setStorageSync('authId', '"Bearer "' + res.data.obj.token);
                  wx.setStorageSync('userId', res.data.obj.userCenterId);
                  that.globalData.authentication = '"Bearer "' + res.data.obj.token;
                  that.globalData.isLogin = true;
                  wx.navigateBack({
                    delta: 2
                  })
                } else if (res.data && !res.data.success) {
                  wx.showToast({
                    title: res.data.errorMsg,
                    icon: 'none',
                    duration: 1500
                  })
                } else {
                  wx.showToast({
                    title: '帐号注册失败，请稍后重试',
                    icon: 'none',
                    duration: 1500
                  })
                }
              },
              fail: function (res) {
                var that = this;
                var route = obj.route;
                var detailObj = {
                  route: route,
                  data: data
                }
                var d = {
                  'logsName': 'ajaxFail',
                  'errorCode': 'userRegister',
                  'errorMsg': res,
                  'detail': detailObj
                };
                that.setLogs(d);
                wx.showToast({
                  title: '请求失败，请检查网络是否畅通',
                  icon: 'none',
                  duration: 1500
                })
              },
              complete: function (res) { }
            })
          } else if (data.loginType == 5) {
            var _d = {
              openId: thirdAccount,
              loginType: data.loginType,
              platUserType: platUserType,
              userCenterId: userCenterId,
              status: data.status
            }
            that.userLogin(obj, _d);
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '帐号注册失败，请稍后重试',
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
  userPwdChange: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var platUserType = that.globalData.platUserType;
    wx.request({
      url: host + '/authcenter/auth/modifyPwd?code=' + data.code,
      method: 'POST',
      data: {
        userName: data.userName,
        password: data.password,
        platUserType: platUserType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data && res.data.success) {
          wx.showToast({
            title: '密码修改成功',
            icon: 'none',
            duration: 1500
          })
          wx.navigateBack({
            delta: 1
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '修改密码失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var that = this;
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'userPwdChange',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  userDetailQuery: function (obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/usercenter/1.0/user/' + centerId + '/' + userId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            personalData: res.data.obj
          },function(){
            wx.hideLoading();
          });
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'userDetailQuery',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  shopDetailQuery: function (obj, data){
    var that = this;
    var host = that.globalData.host;
    var shopId = that.globalData.shopId;
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/usercenter/auth/1.0/grade/config/' + centerId + '?shopId=' + shopId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function (res) {
        if(res.data && res.data.success){
          if (obj){
            obj.setData({
              shopInfoData: res.data.obj
            });
          }
          wx.setNavigationBarTitle({
            title: (res.data.obj && res.data.obj.name) || '中国供销海外购'
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'shopDetailQuery',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getIndexData: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    wx.request({
      url: host + '/goodscenter/auth/1.0/applet/index/7',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data.module || [];
        var goodsListData_1 = [];
        if (data == []) {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 1500
          })
        } else {
          for (var i = 0; i < data.length; i++) {
            if (data[i].code == "banner-1") {
              obj.setData({
                ['bannerData.imgs']: data[i].cont
              });
            }
            if (data[i].code == "goodsList-2") {
              goodsListData_1.push(data[i]);
            }
            // if (data[i].code == "goodsList-3") {
            //   goodsListData_2.push(data[i]);
            // }
            if (data[i].code == "activity-1"){
              obj.setData({
                ['activityData_1.own']: data[i].own,
                ['activityData_1.cont']: data[i].cont,
              });
            }
            if (data[i].code == "activity-2") {
              obj.setData({
                ['activityData_2.cont']: data[i].cont,
              });
            }
            if (data[i].code == "activity-3") {
              obj.setData({
                ['activityData_3.own']: data[i].own,
                ['activityData_3.cont']: data[i].cont,
              });
            }
          }
          goodsListData_1.forEach(function(v,i){
            if (v.own && v.own.href){
              v.own._href = v.own.href.split('?')[1];
            }
          });
          obj.setData({
            goodsListData_1: goodsListData_1
          });
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getIndexData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getNavData: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/goodscenter/auth/1.0/goods/navigation?centerId=' + centerId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.obj) {
          obj.setData({
            navTotalData: res.data.obj,
            navRightData: res.data.obj[0].dictList,
            firstActive: res.data.obj[0].id
          });
        } else {
          wx.showToast({
            title: '请求失败，请检查网络是否畅通',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getNavData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getSearchListData: function (obj, data, oldData) {
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var oldData = oldData || [];
    var requestUrl = host + '/goodscenter/auth/1.0/goods/base' + '?centerId=' + centerId + '&numPerPage=' + data.numPerPage + '&currentPage=' + data.currentPage;
    if (data.firstCategory) { requestUrl += '&firstCategory=' + data.firstCategory; }
    if (data.secondCategory) { requestUrl += '&secondCategory=' + data.secondCategory; }
    if (data.thirdCategory) { requestUrl += '&thirdCategory=' + data.thirdCategory; }
    if (data.upShelves) { requestUrl += '&upShelves=' + data.upShelves; }
    if (data.goodsName) { requestUrl += '&goodsName=' + encodeURIComponent(data.goodsName); }
    if (data.type) { requestUrl += '&type=' + data.type; }
    if (data.tag) { requestUrl += '&tag=' + data.tag; }
    if (data.sortField && data.sortRule) { requestUrl += ('&sortList[0].sortField=' + data.sortField + '&sortList[0].sortRule=' + data.sortRule)};
    wx.request({
      url: requestUrl,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data && res.data.obj) {
          var rSearchListData = res.data.obj.goodsList || [];
          var tagListArr = [];
          if (rSearchListData && rSearchListData.length > 0) {
            for (var i = 0; i < rSearchListData.length; i++) {
              if (rSearchListData[i].goodsSpecsList && rSearchListData[i].goodsSpecsList.length > 0) {
                for (var j = 0; j < rSearchListData[i].goodsSpecsList.length; j++) {
                  if (rSearchListData[i].goodsSpecsList[j].tagList && rSearchListData[i].goodsSpecsList[j].tagList.length > 0) {
                    for (var k = 0; k < rSearchListData[i].goodsSpecsList[j].tagList.length; k++) {
                      if (tagListArr.indexOf(rSearchListData[i].goodsSpecsList[j].tagList[k].tagName) == -1 && tagListArr.length < 3) {
                        tagListArr.push(rSearchListData[i].goodsSpecsList[j].tagList[k].tagName);
                      }
                    }
                  }
                }
              }
              rSearchListData[i].tagListArr = tagListArr;
              tagListArr = [];
            }
          }
          var searchListData = oldData.concat(rSearchListData);
          searchListData.forEach(function (v, i) {
            v.oneRealPrice = (v.realPrice / (v.goodsSpecsList[0].conversion || 1)).toFixed(2);
          })
          if (searchListData.length > 0){
            obj.setData({
              'searchListData.data': searchListData,
              'searchListData.totalPages': res.data.obj.pagination.totalPages
            });
          }else{
            obj.setData({
              'searchListData.data': [],
              'searchListData.totalPages': res.data.obj.pagination.totalPages
            });
          }
          if (data.pageType == 'index'){
            var indexCurrentPagre = data.currentPage;
            var totalPages = obj.data.goodsList_2.totalPages || 0;
            obj.setData({
              goodsListData_2: oldData.concat(res.data.obj.goodsList),
              'goodsList_2.totalPages': res.data.obj.pagination.totalPages
            })
          }
        } else {
          wx.showToast({
            title: '请求失败，请检查网络是否畅通',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getSearchListData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getGoodsDetailData: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var requestData = data;
    wx.request({
      url: host + '/goodscenter/auth/1.0/' + centerId + '/goods?goodsId=' + requestData.goodsId + '&isApplet=true',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.obj) {
          var data = res.data.obj[0];
          var imgsArr = [];
          var tagListArr = [];
          var priceArr = [];
          var commodityAttr = [];
          if (data && data.goodsFileList){
            for (var i = 0; i < data.goodsFileList.length; i++) {
              imgsArr.push({
                picPath: data.goodsFileList[i].path,
                href: ''
              });
            }
          }
          if (data.goodsSpecsList && data.goodsSpecsList.length > 0) {
            for (var j = 0; j < data.goodsSpecsList.length; j++) {
              var commodityAttrItem = {};
              commodityAttrItem.obj = data.goodsSpecsList[j];
              if (data.goodsSpecsList[j].tagList && data.goodsSpecsList[j].tagList.length > 0) {
                for (var k = 0; k < data.goodsSpecsList[j].tagList.length; k++) {
                  if (tagListArr.indexOf(data.goodsSpecsList[j].tagList[k].tagName) == -1) {
                    tagListArr.push(data.goodsSpecsList[j].tagList[k].tagName);
                  }
                }
              }
              if (data.goodsSpecsList[j].priceList && data.goodsSpecsList[j].priceList.length > 0){
                data.goodsSpecsList[j].priceList.forEach(function(v,i){
                  v.price = v.price.toFixed(2);
                });
              }
              priceArr.push(data.goodsSpecsList[j].priceList[0].price);
              priceArr.sort(function (a, b) {return a - b;});
              if (data.goodsSpecsList[j].info){
                var info = JSON.parse(data.goodsSpecsList[j].info);
                var infoArr = [];
                for (var key in info){
                  var d = {
                    attrKey: key,
                    attrValue: info[key]
                  };
                  infoArr.push(d);
                }
                commodityAttrItem.attrValueList = infoArr;
              }
              commodityAttr.push(commodityAttrItem);
            }
            data.tagListArr = tagListArr;
            if (priceArr.length > 1) {
              data.priceRegion = priceArr[0] + '~' + priceArr[priceArr.length - 1];
            }
          }
          var newDetailList = [];
          if (data.detailList){
            data.detailList.forEach(function (v, i) {
              let d = {
                src: v,
                width: "100%",
                height: "300rpx"
              }
              newDetailList.push(d);
            });
          }
          if (data.goodsSpecsList.length == 1) {
            obj.setData({
              quantity: data.goodsSpecsList[0].priceList[0].min || 1
            });
          }
          data.detailList = newDetailList
          obj.setData({
            'bannerData.imgs': imgsArr,
            'bannerData.type': data.type,
            'goodsDetailData': data,
            'commodityAttr': commodityAttr,
            'includeGroup': commodityAttr
          });
          obj.distachAttrValue(commodityAttr);
          // if (obj.data.commodityAttr.length == 1) {
          //   if (obj.data.commodityAttr[0].attrValueList){
          //     for (var i = 0; i < obj.data.commodityAttr[0].attrValueList.length; i++) {
          //       obj.data.attrValueList[i].selectedValue = obj.data.commodityAttr[0].attrValueList[i].attrValue;
          //     }
          //     obj.setData({
          //       attrValueList: obj.data.attrValueList
          //     });
          //   }
          // }
        } else {
          wx.showToast({
            title: '该商品已下架',
            icon: 'none',
            duration: 1500
          })
          if (requestData.type == 'normal'){
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500);
          } else if (requestData.type == 'scan'){
            setTimeout(function () {
              wx.switchTab({
                url: '/web/index/index',
              })
            }, 1500);
          }
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getGoodsDetailData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getShoppingCartData: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    var shopId = that.globalData.shopId;
    var allCrossPrice = 0;
    var allNormalPrice = 0;
    var _allNormalPrice = 0;
    var allCrossCount = 0;
    var allNormalCount = 0;
    var _allNormalCount = 0;
    wx.request({
      url: host + '/ordercenter/1.0/order/shoping-cart/' + shopId + '/' + userId + '?centerId=' + centerId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success && res.data.obj){
          var data = res.data.obj;
          var tagListStr = '';
          var infoStr = '';
          var statusNum = 0;
          for(var i = 0;i<data.length;i++){
            if (data[i].goodsSpecs.tagList && data[i].goodsSpecs.tagList.length > 0) {
              for (var j = 0; j<data[i].goodsSpecs.tagList.length; j++) {
                tagListStr += (data[i].goodsSpecs.tagList[j] + '、');
              }
            }
            if (data[i].goodsSpecs.info){
              var info = JSON.parse(data[i].goodsSpecs.info);
              for (var index in info){
                infoStr += (info[index] + '、');
              }
            }
            data[i].goodsSpecs.tagListStr = tagListStr;
            data[i].goodsSpecs.infoStr = infoStr;
            infoStr = '';
            if (data[i].goodsSpecs.status != 0){
              if (data[i].type == 0) {
                allCrossPrice += data[i].goodsSpecs.priceList[0].price * data[i].quantity;
                allCrossCount += data[i].quantity * 1;
              } else if (data[i].type == 2) {
                allNormalPrice += data[i].goodsSpecs.priceList[0].price * data[i].quantity;
                allNormalCount += data[i].quantity * 1;
              }
            }
            data[i].goodsSpecs.priceList[0].price = data[i].goodsSpecs.priceList[0].price.toFixed(2);
            if (data[i].goodsSpecs.status == 1){
              data[i].status = 'selected';
              statusNum ++;
            } else if (data[i].goodsSpecs.status == 0){
              data[i].status = 'lose';
            }
            data[i].isTouchMove = false;
          }
          obj.setData({
            shopCartData: data,
            selectedNum: statusNum,
            allCrossPrice: allCrossPrice.toFixed(2),
            allNormalPrice: allNormalPrice.toFixed(2),
            allCrossCount: allCrossCount,
            allNormalCount: allNormalCount
          });
        } else if (res.data && res.data.success && !res.data.obj){
          obj.setData({
            shopCartData: []
          });
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getShoppingCartData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  delShoppingCartData: function (obj, data) {
    var that = this;
    var host = that.globalData.host;
    var shopId = that.globalData.shopId;
    var shopCartId = data.ids.join(',');
    var allData = obj.data.shopCartData;
    var selectedNum = 0;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/ordercenter/1.0/order/shoping-cart/' + shopId + '/' + userId + '/' + shopCartId,
      method: 'DELETE',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success){
          that.getShoppingCartCount(obj, {});
          if(data.type == 'orderSure'){
            
          }else{
            var indexs = []
            data.ids.forEach(function (v1, i1) {
              allData.forEach(function (v2, i2) {
                if (v1 == v2.id) {
                  indexs.push(i2);
                }
              })
            });
            var newIndexs = indexs.map(function (val, idx) { return val - idx; })
            newIndexs.forEach(function (index) {
              allData.splice(index, 1);
            })
            for (var i = 0; i < allData.length; i++) {
              if (allData[i].status == 'selected') {
                selectedNum++;
              }
            }
            obj.setData({
              shopCartData: allData,
              selectedNum: selectedNum
            });
            obj.getAllPrice(allData);
          }
        } else if (res.data && res.data.success){
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        }else{
          wx.showToast({
            title: '删除购物车失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'delShoppingCartData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getShoppingCartCount: function (obj, data){
    var that = this;
    var host = that.globalData.host;
    var shopId = that.globalData.shopId;
    var userId = wx.getStorageSync('userId');
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/ordercenter/1.0/order/shoping-cart/count/' + shopId + '/' + userId + '?centertId=' + centerId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            'footerData.shoppingCartCount': res.data.obj,
            'headerData.shoppingCartCount': res.data.obj
          })
        } else if (res.data && !res.data.success){
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        }else{
          wx.showToast({
            title: '获取购物车数量失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getShoppingCartCount',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  addShopCart: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var shopId = that.globalData.shopId;
    var userId = wx.getStorageSync('userId');
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/ordercenter/1.0/order/shoping-cart/quantity/' + shopId + '/' + userId + '/' + data.itemId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          var maxNumber = 0;
          if ((data.maxNum || 999999) > data.stock){
            maxNumber = data.stock
          }else{
            maxNumber = (data.maxNum || 999999);
          }
          if ((res.data.obj*1 + data.quantity*1) <= maxNumber*1){
            wx.request({
              url: host + '/ordercenter/1.0/order/shoping-cart',
              method: 'POST',
              data: {
                centerId: centerId,
                goodsImg: data.goodsImg,
                goodsName: data.goodsName,
                gradeId: shopId,
                itemId: data.itemId,
                quantity: data.quantity,
                supplierId: data.supplierId,
                supplierName: data.supplierName,
                type: data.type,
                userId: wx.getStorageSync('userId')
              },
              header: {
                'content-type': 'application/json', // 默认值
                'authentication': that.globalData.authentication
              },
              success: function (res) {
                if (res.data && res.data.success) {
                  wx.showToast({
                    title: '加入购物车成功',
                    icon: 'none',
                    duration: 1000
                  })
                  that.getShoppingCartCount(obj, {});
                } else {
                  wx.showToast({
                    title: '加入购物车失败',
                    icon: 'none',
                    duration: 1000
                  })
                }
              },
              fail: function (res) {
                var route = obj.route;
                var detailObj = {
                  route: route,
                  data: data
                }
                var d = {
                  'logsName': 'ajaxFail',
                  'errorCode': 'addShopCart',
                  'errorMsg': res,
                  'detail': detailObj
                };
                that.setLogs(d);
                wx.showToast({
                  title: '请求失败，请检查网络是否畅通',
                  icon: 'none',
                  duration: 1500
                })
              },
              complete: function (res) { }
            })
          }else{
            if (maxNumber*1 - res.data.obj * 1 > 0){
              wx.request({
                url: host + '/ordercenter/1.0/order/shoping-cart',
                method: 'POST',
                data: {
                  centerId: centerId,
                  goodsImg: data.goodsImg,
                  goodsName: data.goodsName,
                  gradeId: shopId,
                  itemId: data.itemId,
                  quantity: maxNumber * 1 - res.data.obj * 1,
                  supplierId: data.supplierId,
                  supplierName: data.supplierName,
                  type: data.type,
                  userId: wx.getStorageSync('userId')
                },
                header: {
                  'content-type': 'application/json', // 默认值
                  'authentication': that.globalData.authentication
                },
                success: function (res) {
                  if (res.data && res.data.success) {
                    wx.showToast({
                      title: '加入购物车成功',
                      icon: 'none',
                      duration: 1000
                    })
                    that.getShoppingCartCount(obj, {});
                  } else {
                    wx.showToast({
                      title: '加入购物车失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                },
                fail: function (res) {
                  var route = obj.route;
                  var detailObj = {
                    route: route,
                    data: data
                  }
                  var d = {
                    'logsName': 'ajaxFail',
                    'errorCode': 'addShopCart',
                    'errorMsg': res,
                    'detail': detailObj
                  };
                  that.setLogs(d);
                  wx.showToast({
                    title: '请求失败，请检查网络是否畅通',
                    icon: 'none',
                    duration: 1500
                  })
                },
                complete: function (res) { }
              })
            }else{
              wx.showToast({
                title: '数量已达到购买上限',
                icon: 'none',
                duration: 1500
              })
            }
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '获取购物车商品数量失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'addShopCart',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
    
  },
  getAddressData: function(obj, data){
    var that = this;
    var userId = wx.getStorageSync('userId');
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/usercenter/1.0/user/address/' + userId + '?centerId=' + centerId + '&numPerPage=10&currentPage=1',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success){
          var haveDefault = false;
          obj.setData({
            addressListData: res.data.obj
          })
          res.data.obj.forEach(function(v,i){
            if (!obj.data.addressId && v.setDefault == 1) {
              haveDefault = true;
              obj.setData({
                addressId: v.id
              });
            }
          });
          if (!obj.data.addressId && !haveDefault && res.data.obj.length > 0){
            obj.setData({
              addressId: res.data.obj[0].id
            });
          }
        }else{
          wx.showToast({
            title: '获取收货地址列表失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getAddressData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  createAddressMsg: function(obj, data){
    var that = this;
    var userId = wx.getStorageSync('userId');
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/usercenter/1.0/user/address',
      method: 'POST',
      data: {
        userId: userId,
        city: data.city,
        area: data.area,
        centerId: centerId,
        address: data.address,
        province: data.province,
        setDefault: data.setDefault,
        receiveName: data.receiveName,
        receivePhone: data.receivePhone
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success){
          // if(data.move){
          //   wx.redirectTo({
          //     url: '/web/orderSure/orderSure',
          //   })
          // }else{
          wx.navigateBack({
            delta: 1
          })
          // }
        }else{
          wx.showToast({
            title: '创建收货地址失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'createAddressMsg',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  updateAddressMsg: function(obj, data){
    var that = this;
    var userId = wx.getStorageSync('userId');
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/usercenter/1.0/user/address',
      method: 'PUT',
      data: {
        id: data.id,
        userId: userId,
        city: data.city,
        area: data.area,
        centerId: centerId,
        address: data.address,
        province: data.province,
        setDefault: data.setDefault,
        receiveName: data.receiveName,
        receivePhone: data.receivePhone
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success){
          that.getAddressData(obj,{});
          if(data.type != 'setDefault'){
            wx.navigateBack({
              delta: 1
            })
          }
        }else{
          wx.showToast({
            title: '保存收货地址失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'updateAddressMsg',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  deteleAddressMsg: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/usercenter/1.0/user/address/'+ userId +'/' + data.id,
      method: 'DELETE',
      data: {
        centerId: centerId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          that.getAddressData(obj, {});
        } else {
          wx.showToast({
            title: '删除收货地址失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'deteleAddressMsg',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getPostFee: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    data.forEach(function(v,i){
      v.centerId = centerId;
    })
    wx.request({
      url: host + '/ordercenter/1.0/order/postfee?data=' + encodeURI(JSON.stringify(data)),
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success){
          obj.setData({
            postFeeArr: res.data.obj
          });
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getPostFee',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    });
  },
  getUserDetail: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId') || '';
    wx.request({
      url: host + '/usercenter/1.0/user/' + centerId + '/' + userId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success){
          var isNew = true;
          if (res.data.obj.userDetail){
            isNew = false;
          }
          if (isNew){
            obj.setData({
              infoData: res.data.obj,
              isNew: isNew,
              sexIndex: 0
            });
          }else{
            obj.setData({
              infoData: res.data.obj,
              isNew: isNew,
              sexIndex: res.data.obj.userDetail.sex
            });
          }
        }else{
          wx.showToast({
            title: '获取个人信息失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getUserDetail',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  createUserDetail: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId') || '';
    var d = data;
    d.centerId = centerId;
    d.userId = userId;
    wx.request({
      url: host + '/usercenter/1.0/user/userDetail',
      method: 'POST',
      data: d,
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route //当前页面url
        if(res.data && res.data.success){
          if (url == 'web/orderSure/orderSure'){
            obj.setData({
              idNumAlert: false,
              haveCode: true
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
        that.userDetailQuery(obj, {});
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'createUserDetail',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  saveUserDetail: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId') || '';
    var d = data;
    d.centerId = centerId;
    d.userId = userId;
    wx.request({
      url: host + '/usercenter/1.0/user/userDetail',
      method: 'PUT',
      data: d,
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          var pages = getCurrentPages();    //获取加载的页面
          var currentPage = pages[pages.length - 1];    //获取当前页面的对象
          var url = currentPage.route;    //当前页面url
          if (url != 'web/orderSure/orderSure'){
            wx.navigateBack({
              delta: 1
            })
          } else {
            obj.setData({
              idNumAlert: false,
              haveCode: true
            })
          }
          that.userDetailQuery(obj,{});
        }else{
          wx.showToast({
            title: '保存个人信息失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'saveUserDetail',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getValidation: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    wx.request({
      url: host + '/3rdcenter/auth/1.0/third-part/phone?phone=' + data.phone,
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data && res.data.success){
          wx.showToast({
            title: '验证码发送成功',
            icon: 'none',
            duration: 1500
          })
        } else if (res.data && !res.data.success){
          wx.showToast({
            title: '验证码发送频繁，请稍后重试',
            icon: 'none',
            duration: 1500
          })
        }else{
          wx.showToast({
            title: '验证码发送失败，请稍后重试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getValidation',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getOrderListData: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    var shopId = that.globalData.shopId;
    var url = host + '/ordercenter/1.0/order?centerId=' + centerId + '&shopId=' + shopId + '&userId=' + userId + '&numPerPage=' + data.numPerPage + '&currentPage=' + data.currentPage;
    if (data.status != null && data.status != 'null'){
      if (data.status.toString().indexOf(',') != -1){
        url += '&statusArr=' + data.status;
      } else {
        url += '&status=' + data.status;
      }
    }
    if (data.orderId){
      url += '&orderId=' + data.orderId;
    }
    wx.request({
      url: url,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          var d = res.data.obj.orderList;
          var oldData = obj.data.orderListData || [];
          var waitToPayNum = 0;
          var waitSendNum = 0;
          var waitReceiveNum = 0;
          d.forEach(function (v1, i1) {
            v1.orderDetail.taxFee = (v1.orderDetail.taxFee).toFixed(2);
            v1.orderDetail.payment = (v1.orderDetail.payment).toFixed(2);
            v1.orderDetail.postFee = (v1.orderDetail.postFee).toFixed(2);
            v1.orderGoodsList.forEach(function (v2, i2) {
              v2.itemPrice = (v2.itemPrice).toFixed(2);
              if (v2.itemInfo){
                var infoStr = '';
                var itemInfo = JSON.parse(v2.itemInfo);
                for (let k in itemInfo){
                  infoStr += (itemInfo[k] + '、');
                }
                v2.infoStr = infoStr;
              }
            });
          });
          if(data.type == 'getNumber'){
            if (data.status == 0) {
              obj.setData({
                waitToPayNum: res.data.obj.pagination.totalRows
              })
            } else if (data.status == '1,2,3,4,5,11,12') {
              obj.setData({
                waitSendNum: res.data.obj.pagination.totalRows
              })
            } else if (data.status == 6) {
              obj.setData({
                waitReceiveNum: res.data.obj.pagination.totalRows
              })
            }
          }
          if(data.type == 'getData'){
            obj.setData({
              orderListData: oldData.concat(res.data.obj.orderList),
              totalPages: res.data.obj.pagination.totalPages
            });
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '修改密码失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getOrderListData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getLogisticsData: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var oldData = obj.data.logisticsData || [];
    wx.request({
      url: host + '/3rdcenter/1.0/express/getRoute?carrierName=' + data.expressName + '&expressId=' + data.expressId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if(res.data && res.data.success){
          res.data.obj.expressName = data.expressName;
          res.data.obj.Traces = res.data.obj.Traces.reverse();
          obj.setData({
            logisticsData: oldData.concat(res.data.obj)
          });
        }else if(res.data && !res.data.success){
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        }else{
          wx.showToast({
            title: '请求失败，请检查网络是否畅通',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getLogisticsData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  deleteOrder: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/ordercenter/1.0/order/' + userId + '/' + data.orderId,
      method: 'DELETE',
      data: {
        centerId: centerId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            status: obj.data.status
          });
          obj.getAllNum();
        } else {
          wx.showToast({
            title: '订单删除失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'deleteOrder',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  closeOrder: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/ordercenter/1.0/order/close/' + userId + '/' + data.orderId,
      method: 'POST',
      data: {
        centerId: centerId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            status: obj.data.status
          });
          obj.getAllNum();
        } else {
          wx.showToast({
            title: '订单关闭失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'closeOrder',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  sureOrder: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/ordercenter/1.0/order/confirm/' + userId + '/' + data.orderId,
      method: 'PUT',
      data: {
        centerId: centerId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            status: 7
          });
          obj.getAllNum();
        } else {
          wx.showToast({
            title: '确认收货失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'sureOrder',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  createOrder: function(obj, data){
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    var openId = wx.getStorageSync('openId');
    var shopId = that.globalData.shopId;
    var centerId = that.globalData.centerId;
    var orderDetail = data.orderDetail;
    orderDetail.customerIdNum = obj.data.personalData.userDetail &&obj.data.personalData.userDetail.idNum;
    orderDetail.customerName = obj.data.personalData.userDetail && obj.data.personalData.userDetail.name;
    orderDetail.customerPhone = obj.data.personalData.phone;
    wx.request({
      url: host + '/ordercenter/1.0/order?type=JSAPI_WX_APPLET&openId=' + openId,
      method: 'POST',
      data: {
        centerId: centerId,
        createType: data.createType,
        expressType: data.expressType,
        orderSource: data.orderSource,
        orderFlag: data.orderFlag,
        orderDetail: data.orderDetail,
        orderGoodsList: data.orderGoodsList,
        payType: data.payType,
        redirect: data.redirect,
        remark: data.remark,
        shopId: shopId,
        supplierId: data.supplierId,
        tagFun: data.tagFun,
        tdq: data.tdq,
        userId: userId,
        couponIds: data.couponIds
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data && res.data.success) {
          if (data.ids.length > 0){
            var d = {
              ids: data.ids,
              type: 'orderSure'
            }
            that.delShoppingCartData(obj, d);
          }
          wx.requestPayment({
            timeStamp: res.data.obj.timeStamp,
            nonceStr: res.data.obj.nonceStr,
            package: res.data.obj.package,
            signType: res.data.obj.signType,
            paySign: res.data.obj.paySign,
            success(res) {
              var ordersInfo_data = obj.data.ordersInfo;
              var ordersInfo_storage = wx.getStorageSync('ordersInfo');
              delete ordersInfo_data[data.orderFlag][data.supplierId];
              delete ordersInfo_storage[data.orderFlag][data.supplierId];
              if (Object.prototype.toString.call(ordersInfo_data[data.orderFlag]) === '[object Object]') {
                if (JSON.stringify(ordersInfo_data[data.orderFlag]) == '{}'){
                  delete ordersInfo_data[data.orderFlag];
                }
              }
              if (Object.prototype.toString.call(ordersInfo_storage[data.orderFlag]) === '[object Object]') {
                if (JSON.stringify(ordersInfo_storage[data.orderFlag]) == '{}') {
                  delete ordersInfo_storage[data.orderFlag];
                }
              }
              wx.setStorageSync('ordersInfo', ordersInfo_storage);
              obj.setData({
                ordersInfo: ordersInfo_data
              });
              if (Object.prototype.toString.call(ordersInfo_storage) === '[object Object]') {
                if (JSON.stringify(ordersInfo_storage) == '{}') {
                  wx.redirectTo({
                    url: '/web/orderList/orderList?status=null',
                  })
                }
              }
            },
            fail(r) {
              var ordersInfo_data = obj.data.ordersInfo;
              var ordersInfo_storage = wx.getStorageSync('ordersInfo');
              delete ordersInfo_data[data.orderFlag][data.supplierId];
              delete ordersInfo_storage[data.orderFlag][data.supplierId];
              if (Object.prototype.toString.call(ordersInfo_data[data.orderFlag]) === '[object Object]') {
                if (JSON.stringify(ordersInfo_data[data.orderFlag]) == '{}') {
                  delete ordersInfo_data[data.orderFlag];
                }
              }
              if (Object.prototype.toString.call(ordersInfo_storage[data.orderFlag]) === '[object Object]') {
                if (JSON.stringify(ordersInfo_storage[data.orderFlag]) == '{}') {
                  delete ordersInfo_storage[data.orderFlag];
                }
              }
              wx.setStorageSync('ordersInfo', ordersInfo_storage);
              obj.setData({
                ordersInfo: ordersInfo_data
              });
              if (Object.prototype.toString.call(ordersInfo_storage) === '[object Object]') {
                if (JSON.stringify(ordersInfo_storage) == '{}') {
                  wx.redirectTo({
                    url: '/web/orderList/orderList?status=null',
                  })
                }
              }
              var d = {
                'logsName': 'orderSure',
                'errorCode': 'wxPay',
                'errorMsg': '用户取消支付',
                'detail': data.orderGoodsList,
                'orderId': res.data.errorMsg
              };
              that.setLogs(d);
            }
          })
        } else if (res.data && !res.data.success){
          var d = {
            'logsName': 'orderSure',
            'errorCode': 'createOrder',
            'errorMsg': res.data.errorMsg,
            'detail': data.orderGoodsList,
            'orderId': '订单未生成'
          };
          that.setLogs(d);
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        }else {
          wx.showToast({
            title: '创建订单失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'createOrder',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.hideLoading();
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  orderToPay: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: host + '/paycenter/1.0/pay/1/JSAPI_WX_APPLET/' + data.orderId + '?openId=' + openId,
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          wx.requestPayment({
            timeStamp: res.data.obj.timeStamp,
            nonceStr: res.data.obj.nonceStr,
            package: res.data.obj.package,
            signType: res.data.obj.signType,
            paySign: res.data.obj.paySign,
            success(res) {},
            fail(res) {}
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '订单支付失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'orderToPay',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getBargainIndexData: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    var requireUrl = host + '/goodscenter/auth/1.0/active/bargain/goods/list?currentPage=' + data.currentPage + '&numPerPage=' + data.numPerPage;
    if (userId){
      requireUrl += '&userId='+ userId;
    }
    wx.request({
      url: requireUrl,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function (res) {
        if (res.data && res.data.success) {
          if (res.data.obj.ongoing && res.data.obj.ongoing.length > 0) {
            res.data.obj.ongoing.forEach(function (v, i) {
              v.surplusPrice = (v.goodsPrice * 1 - v.bargainPrice * 1).toFixed(2);
              v.goodsPrice = (v.goodsPrice * 1).toFixed(2);
              v.bargainPrice = (v.bargainPrice * 1).toFixed(2);
            });
            changeTime();
            var timer = setInterval(function () {
              changeTime();
            }, 1000);
            function changeTime() {
              res.data.obj.ongoing.forEach(function (v, i) {
                let createTime = v.createTime;
                createTime = Date.parse(createTime.replace(/-/g, '/'));
                let time = new Date(createTime).getTime();
                let dateTime = time + v.duration * 60 * 60 * 1000;
                let timestamp = Date.parse(new Date());
                if (v.start) {
                  if (timestamp > dateTime) {
                    v.start = false;
                    var d = {
                      id: v.id
                    }
                    // that.closeBargainTeam(obj, d);
                    v.nextHour = '00';
                    v.nextMinute = '00';
                    v.nextSecond = '00';
                  } else {
                    that.formatSeconds(v, dateTime * 1 - timestamp * 1);
                    var str = 'bargainIndexData.goodsListActive[' + i + ']';
                    obj.setData({
                      [str]: v
                    });
                  }
                }
              });
              if (timer) {
                that.globalData.timer = timer;
              }
            }
          }
          obj.setData({
            'bargainIndexData.goodsList': res.data.obj.list,
            'bargainIndexData.goodsListActive': res.data.obj.ongoing || [],
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '获取活动列表失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getBargainIndexData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getUserBargainData: function (obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    clearInterval(that.globalData.timer);
    wx.request({
      url: host + '/goodscenter/1.0/active/bargain/mine/' + userId + '?start=' + data.start,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          var oldData = obj.data.userBargainData.goodsList || [];
          var newData = res.data.obj;
          if(data.start == 1){
            newData = oldData.concat(res.data.obj);
          } else if (data.start == 0){
            newData = newData;
            if (newData.length == 0){
              wx.request({
                url: host + '/goodscenter/1.0/active/bargain/mine/' + userId + '?start=1',
                method: 'GET',
                data: {},
                header: {
                  'content-type': 'application/json', // 默认值
                  'authentication': that.globalData.authentication
                },
                success: function (res) { 
                  if(res.data && res.data.success){
                    res.data.obj.forEach(function (v, i) {
                      v.surplusPrice = (v.goodsPrice * 1 - v.lowPrice * 1 - v.bargainPrice * 1).toFixed(2);
                      v.goodsPrice = (v.goodsPrice * 1).toFixed(2);
                      v.bargainPrice = (v.bargainPrice * 1).toFixed(2);
                    });
                    obj.setData({
                      'userBargainData.goodsList': res.data.obj,
                      showOngoing: true
                    });
                    if (res.data.obj.length > 0) {
                      changeTime();
                      var timer = setInterval(function () {
                        changeTime();
                      }, 1000);
                      function changeTime() {
                        res.data.obj.forEach(function (v, i) {
                          let createTime = v.createTime;
                          createTime = Date.parse(createTime.replace(/-/g, '/'));
                          let time = new Date(createTime).getTime();
                          let dateTime = time + v.duration * 60 * 60 * 1000;
                          let timestamp = Date.parse(new Date());
                          if (v.start) {
                            if (timestamp > dateTime) {
                              v.start = false;
                              var d = {
                                id: v.id
                              }
                              v.nextHour = '00';
                              v.nextMinute = '00';
                              v.nextSecond = '00';
                            } else {
                              that.formatSeconds(v, dateTime * 1 - timestamp * 1);
                              var str = 'userBargainData.goodsList[' + i + ']';
                              obj.setData({
                                [str]: v
                              });
                            }
                          }
                        });
                        if (timer) {
                          that.globalData.timer = timer;
                        }
                      }
                    }
                    return;
                  } else if (res.data && !res.data.success) {
                    wx.showToast({
                      title: res.data.errorMsg,
                      icon: 'none',
                      duration: 1500
                    })
                  } else {
                    wx.showToast({
                      title: '获取我的砍价列表失败',
                      icon: 'none',
                      duration: 1500
                    })
                  }
                },
                fail: function (res) {
                  var route = obj.route;
                  var detailObj = {
                    route: route,
                    data: data
                  }
                  var d = {
                    'logsName': 'ajaxFail',
                    'errorCode': 'getUserBargainData',
                    'errorMsg': res,
                    'detail': detailObj
                  };
                  that.setLogs(d);
                  wx.showToast({
                    title: '请求失败，请检查网络是否畅通',
                    icon: 'none',
                    duration: 1500
                  })
                },
                complete: function (res) { }
              });
            }
          }
          newData.forEach(function (v, i) {
            v.surplusPrice = (v.goodsPrice * 1 - v.lowPrice * 1 - v.bargainPrice * 1).toFixed(2);
            v.goodsPrice = (v.goodsPrice * 1).toFixed(2);
            v.bargainPrice = (v.bargainPrice * 1).toFixed(2);
          });
          obj.setData({
            'userBargainData.goodsList': newData
          });
          if (newData.length > 0) {
            changeTime();
            var timer = setInterval(function () {
              changeTime();
            }, 1000);
            function changeTime() {
              newData.forEach(function (v, i) {
                let createTime = v.createTime;
                createTime = Date.parse(createTime.replace(/-/g, '/'));
                let time = new Date(createTime).getTime();
                let dateTime = time + v.duration * 60 * 60 * 1000;
                let timestamp = Date.parse(new Date());
                if (v.start) {
                  if (timestamp > dateTime) {
                    v.start = false;
                    var d = {
                      id: v.id
                    }
                    v.nextHour = '00';
                    v.nextMinute = '00';
                    v.nextSecond = '00';
                  } else {
                    that.formatSeconds(v, dateTime * 1 - timestamp * 1);
                    var str = 'userBargainData.goodsList[' + i + ']';
                    obj.setData({
                      [str]: v
                    });
                  }
                }
              });
              if (timer) {
                that.globalData.timer = timer;
              }
            }
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '获取我的砍价列表失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getUserBargainData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  createBargainTeam: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/goodscenter/1.0/active/bargain/start',
      method: 'POST',
      data: {
        id: data.id,
        userName: data.userName,
        userImg: data.userImg,
        userId: userId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          wx.navigateTo({
            url: '/web/bargainGoodsDetail/bargainGoodsDetail?goodsRoleId=' + res.data.obj,
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '创建砍价失败，请稍后再试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'createBargainTeam',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getBarginGoodsDetailData: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/goodscenter/auth/1.0/active/bargain/mine/' + data.id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            bargainData: res.data.obj
          });
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '获取砍价商品详情失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getBarginGoodsDetailData',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  closeBargainTeam: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/goodscenter/1.0/active/bargain/over/' + userId + '/' + data.id,
      method: 'PUT',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          obj.setData({
            'bargainData.start': false
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '关闭砍价活动失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'closeBargainTeam',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  helpBargain: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/goodscenter/1.0/active/bargain',
      method: 'POST',
      data: {
        id: data.id,
        userId: userId,
        userName: data.userName,
        userImg: data.userImg
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          wx.showToast({
            title: '砍价成功',
            icon: 'none',
            duration: 1500
          })
          var bargainPrice = (obj.data.bargainData.bargainPrice * 1 + res.data.obj * 1).toFixed(2);
          var bargainList = obj.data.bargainData.bargainList;
          bargainList.unshift({
            userName: data.userName,
            userImg: data.userImg,
            bargainPrice: res.data.obj
          });
          obj.setData({
            'bargainData.bargainPrice': bargainPrice,
            'bargainData.bargainList': bargainList
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '帮忙砍价失败，请稍后重试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'helpBargain',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  bargainBuy: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var centerId = that.globalData.centerId;
    wx.request({
      url: host + '/goodscenter/auth/1.0/' + centerId + '/goods?itemId=' + data.itemId,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function (res) {
        if (res.data && res.data.success) {
          if (!res.data.obj){
            wx.showToast({
              title: '该商品已下架',
              icon: 'none',
              duration: 1500
            })
            return;
          }
          var data = {};
          var goodsDetailData = res.data.obj[0];
          var chooseItemData = goodsDetailData.goodsSpecsList[0];
          data[goodsDetailData.type] = {};
          data[goodsDetailData.type][goodsDetailData.supplierId] = {};
          data[goodsDetailData.type][goodsDetailData.supplierId].type = goodsDetailData.type;
          if (goodsDetailData.type == 0) {
            data[goodsDetailData.type][goodsDetailData.supplierId].typeName = "跨境";
          } else if (goodsDetailData.type == 2) {
            data[goodsDetailData.type][goodsDetailData.supplierId].typeName = "一般贸易";
          }
          data[goodsDetailData.type][goodsDetailData.supplierId].couponIds = obj.data.goodsRoleId;
          data[goodsDetailData.type][goodsDetailData.supplierId].supplierId = goodsDetailData.supplierId;
          data[goodsDetailData.type][goodsDetailData.supplierId].supplierName = goodsDetailData.supplierName;
          data[goodsDetailData.type][goodsDetailData.supplierId].supplierPrice = 1 * obj.data.bargainData.goodsPrice;
          data[goodsDetailData.type][goodsDetailData.supplierId].supplierBargainPrice = (1 * obj.data.bargainData.bargainPrice).toFixed(2);
          data[goodsDetailData.type][goodsDetailData.supplierId].supplierWeight = 1 * chooseItemData.weight;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj = {};
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId] = chooseItemData;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].freePost = goodsDetailData.freePost;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].freeTax = goodsDetailData.freeTax;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].incrementTax = goodsDetailData.incrementTax;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].priceList[0].price = obj.data.bargainData.goodsPrice;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].quantity = 1;
          if (goodsDetailData.goodsFileList) {
            data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemImg = goodsDetailData.goodsFileList[0].path;
          } else {
            data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemImg = '';
          }
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemName = goodsDetailData.customGoodsName;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs = {};
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['goodsId'] = chooseItemData.goodsId;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['itemCode'] = chooseItemData.itemCode;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['itemId'] = chooseItemData.itemId;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['sku'] = chooseItemData.sku;
          data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].itemSpecs['info'] = chooseItemData.info;
          if (chooseItemData.info) {
            var info = '';
            var d = JSON.parse(chooseItemData.info);
            for (let k in d) {
              info += (d[k] + '、');
            }
            data[goodsDetailData.type][goodsDetailData.supplierId].itemObj[chooseItemData.itemId].infoStr = info;
          }
          data[goodsDetailData.type][goodsDetailData.supplierId].taxFee = 0;
          data[goodsDetailData.type][goodsDetailData.supplierId].postFee = 0;
          data[goodsDetailData.type][goodsDetailData.supplierId].exciseTaxFee = 0;
          data[goodsDetailData.type][goodsDetailData.supplierId].incrementTaxFee = 0;
          data[goodsDetailData.type][goodsDetailData.supplierId].tdq = 1;
          wx.setStorageSync('ordersInfo', data);
          wx.navigateTo({
            url: '/web/orderSure/orderSure',
          })
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '帮忙砍价失败，请稍后重试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'bargainBuy',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  rebargainTeam: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: host + '/goodscenter/1.0/active/bargain/retry',
      method: 'POST',
      data: {
        id: data.id,
        userName: data.userName,
        userImg: data.userImg,
        userId: userId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authentication': that.globalData.authentication
      },
      success: function (res) {
        if (res.data && res.data.success) {
          if(data.where == 'list'){
            wx.navigateTo({
              url: '/web/bargainGoodsDetail/bargainGoodsDetail?goodsRoleId=' + res.data.obj,
            })
          } else if(data.where == 'detail'){
            wx.redirectTo({
              url: '/web/bargainGoodsDetail/bargainGoodsDetail?goodsRoleId=' + res.data.obj,
            })
          }
        } else if (res.data && !res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '重新发起砍价失败，请稍后再试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'rebargainTeam',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  getShareImg: function(obj, data){
    var that = this;
    var host = that.globalData.host;
    var shopId = that.globalData.shopId;
    wx.request({
      url: host + '/goodscenter/auth/1.0/goodsBillboard',
      method: 'POST',
      data: {
        goodsId: data.goodsId,
        shopId: shopId
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      responseText: 'blob',
      success: function (res) {
        wx.hideLoading();
        if (res && res.data) {
          obj.setData({
            prurl: 'data:image/png;base64,' + res.data,
            hidden: false
          });
        } else {
          wx.showToast({
            title: '生成分享图片失败，请稍后重试',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        var route = obj.route;
        var detailObj = {
          route: route,
          data: data
        }
        var d = {
          'logsName': 'ajaxFail',
          'errorCode': 'getShareImg',
          'errorMsg': res,
          'detail': detailObj
        };
        that.setLogs(d);
        wx.hideLoading();
        wx.showToast({
          title: '请求失败，请检查网络是否畅通',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function (res) { }
    })
  },
  setLogs: function(data){
    var that = this;
    var nodeHost = that.globalData.nodeHost;
    data.userId = wx.getStorageSync('userId');
    data.shopId = wx.getStorageSync('shopId');
    wx.request({
      url: nodeHost + '/Data/handle/logs',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function(){}
    })
  },
  setStatistics: function(data){
    var that = this;
    var nodeHost = that.globalData.nodeHost;
    wx.request({
      url: nodeHost + '/Data/handle/statistics',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function () { }
    })
  }
})
