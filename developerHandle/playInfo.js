/**
 * @name: playInfo
 * 开发者编写的播放中,通过歌曲id获取歌曲的uel相关信息，id在onLoad的options.id取
 * 这里开发者需要：
 * 1、通过歌曲id获取歌曲详情，赋值给app.globalData.songInfo
 * 2、赋值后执行this.play()来播放歌曲
 * @param {*}
 * @return {*}
 */
const app = getApp()
import { mediaPlay, mediaFavoriteAdd, mediaFavoriteCancel } from '../utils/httpOpt/api'
const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
  },
  onShow() {
    console.log('Log from mixin!')
  },
  async onLoad(options) {
    // 拿到歌曲的id: options.id
    let params = {mediaId: options.id, contentType: 'story'}
    await this.getInfo(params)
    this.play()
  },
  onReady() {

  },
  async getInfo(params) {
    let data = await mediaPlay(params)
    app.globalData.songInfo.src = data.mediaUrl
    app.globalData.songInfo.title = data.mediaName
    app.globalData.songInfo.id = data.nediaId
    app.globalData.songInfo.dt = data.timeText
    app.globalData.songInfo.coverImgUrl = data.coverUrl
  },
  // 收藏和取消收藏
  like(params) {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    if (this.data.liked) {
      mediaFavoriteCancel(params).then(res => {
        wx.showToast({ icon: 'none', title: '取消收藏成功' })
        this.setData({
          liked: false
        })
      })
    } else {
      mediaFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '收藏成功' })
        this.setData({
          liked: true
        })
      })
    }
  }
}