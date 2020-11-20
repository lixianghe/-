// import {getData} from '../../utils/httpOpt/http'
// const { getData } = require('../../utils/https')

const app = getApp()
import btnConfig from '../../utils/pageOtpions/pageOtpions'
Page({
  mixins: [require('../../developerHandle/member')],
  data: {
    screen: app.globalData.screen,
    avatar: '',
    userName: '',
    data: btnConfig.personalCenter ,
    isLogin: app.globalData.haveLogin,
    withCredentials: true,
    userInfo: null,
    debugLog: '',
    songInfo: {},
    initPgae: false,
    mainColor: btnConfig.colorOptions.mainColor
  },

  
  coupon() {
    wx.showToast({
      title: '敬请期待',
    })
  },
  VIP() {
    wx.showToast({
      title: '敬请期待',
    })
  },
  // 测试用清除最近收听数据
  clearStorage() {
    wx.setStorageSync('indexData', null)
  },
  onLoad(options) {
    console.log('判断用户是否已经登录了38行')
    console.log(JSON.stringify(wx.getStorageSync('username'))+'判断用户是否已经登录了38行')
    console.log('判断用户是否已经登录了40行')
  },
  onShow() {
    this.setData({
      initPgae: true
    })
  },
  onHide() {
    this.setData({
      initPgae: false
    })
  }
})