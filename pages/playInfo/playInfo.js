
const app = getApp()
import tool from '../../utils/util'

var timer = null
var index = 0

Page({
  data: {
    playing: false,
    downloadPercent: 0,
    percent: 0,
    name: '',
    playtime: '00:00',
    duration: '',
    songpic: ''
  },
  onLoad(options) {
    // 获取歌曲列表
    const canplay = wx.getStorageSync('canplay')
    // 获取缓存的歌曲信息
    const songInfo = wx.getStorageSync('songInfo')
    this.setData({
      name: songInfo.name,
      duration: tool.formatduration(Number(songInfo.duration)),
      songpic: songInfo.songpic,
      canplay: canplay,
      id: songInfo.id
    })
    index = songInfo.index
    // 播放歌曲
    console.log(songInfo)
    // 如果点击的还是当前播放的歌曲则不用重新播放
    if (options.sameFlag === 'false') {
      app.playmusic(songInfo)
    }
  },
  onShow: function () {
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    tool.playAlrc(that, app);
    timer = setInterval(function () {
      tool.playAlrc(that, app);
    }, 1000);
  },
  onUnload: function () {
    clearInterval(timer);
  },
  onHide: function () {
    clearInterval(timer)
  },
  // 上一首
  pre() {
    console.log('pre', index)
    const canplay = this.data.canplay
    // 设置播放图片名字和时长
    this.setData({
      name: canplay[index-1].name,
      songpic: canplay[index-1].al.picUrl,
      duration: tool.formatduration(Number(canplay[index-1].dt)),
      id: canplay[index-1].id
    })
    app.nextplay(-1, canplay, index)
    index--
    // 切换完歌曲就把状态存入缓存中
    const songInfo = {
      name: this.data.name,
      songpic: this.data.songpic,
      index: index,
      id: this.data.id,
      duration: this.data.duration
    } 
    wx.setStorageSync('songInfo', songInfo)
  },
  // 下一首
  next() {
    console.log('next', index)
    const canplay = this.data.canplay
    console.log(canplay, index)
    // 设置播放图片名字和时长
    this.setData({
      name: canplay[index+1].name,
      songpic: canplay[index+1].al.picUrl,
      duration: tool.formatduration(Number(canplay[index+1].dt)),
      id: canplay[index-1].id
    })
    app.nextplay(1, canplay, index)
    index++
    // 切换完歌曲就把状态存入缓存中
    const songInfo = {
      name: this.data.name,
      songpic: this.data.songpic,
      index: index,
      id: this.data.id,
      duration: this.data.duration
    } 
    wx.setStorageSync('songInfo', songInfo)
  },
  // 暂停
  togglePlay() {
    console.log('stop')
    tool.toggleplay(this, app)
  },
  // 播放列表
  more() {
    console.log('more')
  }
})