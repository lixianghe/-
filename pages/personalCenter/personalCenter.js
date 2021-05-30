// import {getData} from '../../utils/httpOpt/http'
// const { getData } = require('../../utils/https')

const app = getApp()
import btnConfig from '../../utils/pageOtpions/pageOtpions'
Page({
  mixins: [require('../../developerHandle/personalCenter')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    avatar: '',
    userName: '',
    withCredentials: true,
    // userInfo: null,
    debugLog: '',
    songInfo: {},
    mainColor: btnConfig.colorOptions.mainColor
  },

  // 测试用清除最近收听数据
  clearStorage() {
    wx.setStorageSync('indexData', null)
  },
  onLoad(options) {
    let that = this
    // app.getNetWork(that)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    // 没登陆的情况
    if (!app.userInfo || !app.userInfo.token) {
      this.logoutTap()
    }
  },
  onHide() {
    this.setData({
      showWxLoginBtn: false
    })
    this.selectComponent('#miniPlayer').setOnHide()
  }
})