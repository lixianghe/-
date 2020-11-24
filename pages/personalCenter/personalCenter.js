// import {getData} from '../../utils/httpOpt/http'
// const { getData } = require('../../utils/https')

const app = getApp()
import btnConfig from '../../utils/pageOtpions/pageOtpions'
Page({
  mixins: [require('../../developerHandle/personalCenter')],
  data: {
    screen: app.globalData.screen,
    avatar: '',
    userName: '',
    isLogin: app.globalData.haveLogin,
    withCredentials: true,
    userInfo: null,
    debugLog: '',
    songInfo: {},
    mainColor: btnConfig.colorOptions.mainColor
  },

  // 测试用清除最近收听数据
  clearStorage() {
    wx.setStorageSync('indexData', null)
  },
  onLoad(options) {
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})