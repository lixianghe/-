import {options as layLisOpt} from '../../utils/pageOtpions/latelyListenOpt'

const app = getApp()

Page({
  data: {
    noContent: layLisOpt.noContent,
    list: []
  },
  goPlayInfo(e) {
    console.log(e)
    // 跳转的时候把歌名，歌曲封面，歌单序号，歌曲id存在本地缓存
    // 这里还要判断一下点击的歌曲是 否是正在播放的歌曲
    const id = wx.getStorageSync('songInfo') ? wx.getStorageSync('songInfo').id : null
    const sameFlag = id === e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../playInfo/playInfo?sameFlag=${sameFlag}`
    })
  },
  onLoad(options) {
    this.setData({
      list: wx.getStorageSync('latListenData').filter(v => v.pid == options.id)
    })
  },
  onShow() {

  }
})