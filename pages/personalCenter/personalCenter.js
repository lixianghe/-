import {options as adminOpt} from '../../utils/pageOtpions/adminOpt'
const HTTP = require('../../utils/https')
const app = getApp()

Page({
  data: {
    avatar: adminOpt.avatarOut,
    userName: adminOpt.userName,
    data: adminOpt.info,
    isLogin: app.globalData.haveLogin
  },
  // 调用组件方法
  nofityComponent (e) {
    let callback
    let val = e.currentTarget.dataset.state
    switch (val) {
      case 'login': // 登录
        callback = this.loginIn
        break;
      case 'out': // 退出登录
        callback = this.loginOut
        break;
      default:
        break;
    }
    this.bgConfirm = this.selectComponent('#bgConfirm')
    this.bgConfirm.hideShow(true, val, callback)
  },
  // 微信登录获取code
  loginIn () {
    console.log(222222222)
    const that = this
    wx.login({ // 重新登录
      success: function (res) {
        console.log(11111)
        if (res.code) {
          // 改变登录状态
          app.globalData.haveLogin = true
          // 车联登录需要的环境
          // that.actualLogin(res.code, callback);

          // 微信模拟获取信息
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              that.setData({
                avatar: res.userInfo.avatarUrl,
                userName: res.userInfo.nickName,
                isLogin: app.globalData.haveLogin
              })
            }
          })

        } else {
          wx.showToast({
            title: '获取code失败',
          });
        }
      },
      fail: function(err) {
        console.log(err)
      }
    });
  },

  // 用户登录
  actualLogin (code, callback) {
    const data = {
      wxCode: code,
      appId: app.globalData.appId
    };
    HTTP.HTTPPOST({
      url: '',
      data: data,
      success: function (res) {
        console.log(res)
        app.globalData.haveLogin = true;
        app.globalData.token = res.data.token;
        app.globalData.userId = res.data.userId;
        if (callback && typeof callback == "function") {
          callback();
        }
        wx.setStorageSync('userId', res.data.userId)
        wx.setStorageSync('haveLogin', true)
        wx.setStorageSync('token', res.data.token)
      },
      fail: function (res) {
        console.log("--actualLogin--fail",res)
      },
    });
  },
  // 退出登录
  loginOut () {
    app.globalData.haveLogin = false
    this.setData({
      avatar: '/images/icon-admin.png',
      userName: '暂未登录',
      isLogin: app.globalData.haveLogin
    })
  },
  onLoad(options) {

  },
  onShow() {

  }
})