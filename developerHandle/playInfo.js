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
    showModal: false,               // 控制弹框
    content: '该内容为会员付费内容，您需要先成为会员后再购买此内容就可以收听精品内容啦'
  },
  async onLoad(options) {
    // 拿到歌曲的id: options.id
    let isFavoriteParams = {mediaId: options.id}
    let getInfoParams = {mediaId: options.id, contentType: 'story'}

    // 如果是从minibar进入noPlay为true，并不执行下列请求
    if (options.noPlay === 'true') return
    Promise.all([
      this.isFavorite(isFavoriteParams),          // 是否被收藏
      this.getInfo(getInfoParams)                 // 获取歌曲详情
    ]).then((value)=> {
      this.needFee()                              // 检测是否是付费的
      this.play()                                 // 播放歌曲
    })
  },
  // 通过mediaId获取歌曲url及详情，并增加播放历史
  async getInfo(params, that = this) {
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
    let saveHistoryParams = {
      ablumId: app.globalData.abumInfoId || params.mediaId,
      storyId: params.mediaId,
      duration: data.duration,
      playTime: 0
    }
    if (!app.userInfo || !app.userInfo.token) return
    let opt = { historys: [saveHistoryParams] }
    console.log('-------------------opt----------------------', opt)
    saveHistory(opt)
  },
  // 获取已经收藏歌曲
  async isFavorite(params, that = this) {
    if (!params.mediaId) return
    let res = await isFavorite(params)
    that.setData({existed: res.existed})
  },
  // 如果mediaUrl没有给出弹框并跳到首页
  needFee() {
    if (!this.data.songInfo.src) {
      this.setData({showModal: true})
      wx.hideLoading()
    }
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
  }
}