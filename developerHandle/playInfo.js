/**
 * @name: playInfo
 * 开发者编写的播放中,通过歌曲id获取歌曲的uel相关信息，id在onLoad的options.id取
 * 这里开发者需要：
 * 1、通过歌曲id获取歌曲详情，由于模板内的字段名称可能和后台提供不一样，在获取歌曲详情后重新给模板内的字段赋值：如下
 *  songInfo.dataUrl = data.mediaUrl                          // 音频地址
 *  songInfo.title = data.mediaName                       // 音频名称
 *  songInfo.id = params.mediaId                          // 音频Id
 *  songInfo.dt = data.timeText                           // 音频时常
 *  songInfo.coverImgUrl = data.coverUrl                  // 音频封面
 * 2、重新赋值后setData给songInfo，并且存在Storage缓存中
 * 3、赋值后执行this.play()来播放歌曲
 * 4、其他模板外的功能开发者在这个文件自行开发
 */
const app = getApp()
import { mediaPlay, mediaFavoriteAdd, mediaFavoriteCancel, isFavorite, saveHistory } from '../utils/httpOpt/api'
import tool from '../utils/util'

module.exports = {
  data: {
    showModal: false,               // 控制弹框
    content: '该内容为会员付费内容，您需要先成为会员后再购买此内容就可以收听精品内容啦',
    // 播放详情页面按钮配置
    playInfoBtns: [
      {
        name: 'pre',                                             // 上一首
        img: '/images/pre2.png',                                 // 上一首对应的图标
      },
      {
        name: 'toggle',                                          // 播放/暂停
        img: {
          stopUrl: '/images/stop2.png' ,                         // 播放状态的图标
          playUrl: '/images/play2.png'                           // 暂停状态的图标
        }
      },
      {
        name: 'next',                                             // 下一首
        img: '/images/next2.png'                                  // 下一首对应的图标
      },
      {
        name: 'like',                                             // 收藏
        img: {
          noLike: '/images/info_like_no.png' ,                    // 未收藏的图标
          liked: '/images/info_like.png'                          // 已收藏的图标
        }
      },
      {
        name: 'loopType',                                         // 循环模式
        img: {
          loop: '/images/listLoop.png' ,                      // 列表循环对应的图标
          singleLoop: '/images/singleLoop.png',                   // 单曲循环对应的图标
          shufflePlayback: '/images/shufflePlayback.png'          // 随即循环对应的图标
        }
      },
      {
        name: 'more',                                             // 弹出播放列表
        img: '/images/more2.png'                                  // 弹出播放列表对应的图标
      }
    ]
  },
  async onLoad(options) {
    let app = getApp()
    // 不是从minibar切过来的
    if (options.noPlay !== 'true') {
      let canplay = wx.getStorageSync('canplay') || []
      let total = options.total
      let oldSong = app.globalData.songInfo
      if (options.id != oldSong.id) wx.showLoading({ title: '加载中...', mask: true })
      wx.setStorageSync('canplaying', canplay) 
      wx.setStorageSync('total', total)
      let noOrderList = tool.randomList(JSON.parse(JSON.stringify(canplay)))
      wx.setStorageSync('noOrderList', noOrderList)
    }

    // 拿到歌曲的id: options.id
    let songId = wx.getStorageSync('songInfo').id
    let params = {mediaId: options.id || songId, contentType: 'story'}
    console.log(songId, options.id)
    let isSameSong = songId == options.id
    await this.getMedia(params)                 // 获取歌曲详情
    this.needFee()                           // 检测是否是付费的
    // console.log(this.data.songInfo.dataUrl === false)
    this.play(isSameSong) 
    if (options.noPlay !== 'true') {                           // 播放歌曲
      let currentPageNo = options.currentPageNo
      wx.setStorageSync('currentPageNo', currentPageNo)
    }
    
  },
  // 通过mediaId获取歌曲url及详情，并增加播放历史
  async getMedia(params, that = this) {   
    const app = getApp()
    // 获取歌曲                   
    let songInfo = {}
    let canplaying = wx.getStorageSync('canplaying') || []
    songInfo = canplaying.filter(n => Number(n.mediaId) === Number(params.mediaId))[0]
    // console.log('songInfo', canplaying, params.mediaId)
    let abumInfoName = wx.getStorageSync('abumInfoName')
    app.globalData.songInfo = Object.assign({}, app.globalData.songInfo, songInfo)
    if (!abumInfoName) {
      app.globalData.songInfo.dataUrl = `${app.globalData.songInfo.dataUrl}?flag=${new Date().getTime()}`
    }
    that.setData({
      songInfo: app.globalData.songInfo
    })

    wx.setStorageSync('songInfo', app.globalData.songInfo)
    // 是否被收藏
    if (app.userInfo && app.userInfo.token) {
      let res = await isFavorite(params)
      that.setData({existed: res.existed})
    }
    
    // 添加历史记录
    // let abumInfoName = wx.getStorageSync('abumInfoName')
    let abumInfoId = wx.getStorageSync('abumInfoId')
    let saveHistoryParams = {
      ablumId: abumInfoName ? abumInfoId : app.globalData.songInfo.id,
      storyId: app.globalData.songInfo.id,
      duration: 1,
      playTime: 0
    }
    if (!app.userInfo || !app.userInfo.token) return
    let opt = { historys: [saveHistoryParams] }
    saveHistory(opt).then(res => {
      // console.log('saveHistory---------------------' + JSON.stringify(res))
    }).catch(error => {
      // console.log('errorsaveHistory---------------------' + JSON.stringify(error))
    })
  },
  // 获取已经收藏歌曲
  async isFavorite(params, that = this) {
    if (!params.mediaId) return
    let res = await isFavorite(params)
    that.setData({existed: res.existed})
  },
  // 如果mediaUrl没有给出弹框并跳到首页
  needFee() {
    if (!this.data.songInfo.dataUrl) {
      this.setData({showModal: true})
      wx.stopBackgroundAudio()
      wx.hideLoading()
      return false
    }
  },
  // 收藏和取消收藏,playInfo和minibar用到这里
  like(that = this) {
    const app = getApp()
    let params = {mediaId: that.data.songInfo.id}
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    if (that.data.existed) {
      mediaFavoriteCancel(params).then(res => {
        wx.showToast({ icon: 'none', title: '故事取消收藏成功' })
        that.setData({
          existed: false
        })
      })
    } else {
      mediaFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '故事收藏成功' })
        that.setData({
          existed: true
        })
      })
    }
  }
}