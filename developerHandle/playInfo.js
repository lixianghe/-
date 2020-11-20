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
import { mediaPlay, mediaFavoriteAdd, mediaFavoriteCancel, isFavorite, saveHistory } from '../utils/httpOpt/api'
const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
  },
  onShow() {

  },
  async onLoad(options) {
    let that = this
    // 拿到歌曲的id: options.id
    let params = {mediaId: options.id, contentType: 'story'}
    if (options.noPlay !== 'true') {
      await this.getInfo(params,  that, this.isFavorite)
      this.play()
    }
  },
  onReady() {

  },
  async getInfo(params, that = this, cb) {
    cb && cb(params.mediaId || app.globalData.songInfo.mediaId)
    let data = await mediaPlay(params)
    app.globalData.songInfo.src = data.mediaUrl
    app.globalData.songInfo.title = data.mediaName
    app.globalData.songInfo.id = params.mediaId
    app.globalData.songInfo.dt = data.timeText
    app.globalData.songInfo.coverImgUrl = data.coverUrl
    that.setData({
      songInfo: app.globalData.songInfo
    })
    wx.setStorageSync('songInfo', app.globalData.songInfo)
    // 添加历史记录
    let opt = {
      historys: [
        {
          ablumId: this.data.abumInfoId,
          storyId: params.mediaId,
          // duration: durationSecond,
          // playTime: 0,

        }
      ]
    }
    saveHistory(opt).then(res => {
      console.log('saveHistory', res)
    })
  },
  // 收藏和取消收藏
  like(params, that = this) {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    if (that.data.existed) {
      mediaFavoriteCancel(params).then(res => {
        wx.showToast({ icon: 'none', title: '取消收藏成功' })
        that.setData({
          existed: false
        })
      })
    } else {
      mediaFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '收藏成功' })
        that.setData({
          existed: true
        })
      })
    }
  },
  // 获取已经收藏歌曲
  async isFavorite(id, that = this) {
    let params = {mediaId: id}
    let res = await isFavorite(params)
    that.setData({existed: res.existed})
  }
}