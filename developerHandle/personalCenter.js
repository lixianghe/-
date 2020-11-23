/**
 * @name: member
 * 开发者编写的开通/续费会员
 * 这里开发者需要：
 * 1、通过歌曲id获取歌曲详情，赋值给app.globalData.songInfo
 * 2、赋值后执行this.play()来播放歌曲
 * @param {*}
 * @return {*}
 */
const app = getApp()

const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
  },
  onShow() {
    console.log('Log from mixin!')
  },
  async onLoad(options) {
    
  },
  onReady() {

  },
  order() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../member/member' })
  },
  like() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../member/member' })
  },
  latelyListen() {
    console.log(1111)
    wx.navigateTo({ url: '../latelyListen/latelyListen' })
  },
  myBuy() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../myBuy/myBuy' })
  },
}