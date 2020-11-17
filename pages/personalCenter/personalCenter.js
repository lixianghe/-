// import {getData} from '../../utils/httpOpt/http'
// const { getData } = require('../../utils/https')

const app = getApp()
import btnConfig from '../../utils/pageOtpions/pageOtpions'

Page({
  data: {
    screen: app.globalData.screen,
    avatar: '',
    userName: '',
    data: [{
      type: 'order',
      icon: '/images/icon-personCenter.png',
      title: '我的订单'
    }, {
      type: 'coupon',
      icon: '/images/icon-personCenter.png',
      title: '我的收藏' 
    }, {
      type: 'VIP',
      icon: '/images/icon-personCenter.png',
      title: '会员等级'
    }, {
      type: 'us',
      icon: '/images/icon-personCenter.png',
      title: '关于我们(1.1.1)'
    }] ,
    isLogin: app.globalData.haveLogin,
    withCredentials: true,
    userInfo: null,
    debugLog: '',
    songInfo: {},
    initPgae: false,
    mainColor: btnConfig.colorOptions.mainColor
  },

  
  // 测试用清除最近收听数据
  clearStorage() {
    wx.setStorageSync('indexData', null)
  },
  onLoad(options) {
    console.log('sssssssssssss')
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