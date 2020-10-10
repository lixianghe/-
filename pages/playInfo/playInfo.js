
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
    songpic: '',
    showList: false,
    current: null
  },
  onLoad(options) {
    // 获取歌曲列表
    const canplay = wx.getStorageSync('canplay')
    // 获取缓存的歌曲信息
    const songInfo = wx.getStorageSync('songInfo')
    console.log(songInfo.duration)
    this.setData({
      name: songInfo.name,
      duration: tool.formatduration(Number(songInfo.duration)),
      songpic: songInfo.songpic,
      canplay: canplay,
      id: songInfo.id,
      current: songInfo.index
    })
    index = songInfo.index
    // 播放歌曲
    console.log(songInfo, options.sameFlag)
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
      id: canplay[index-1].id,
      current: index - 1
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
      id: canplay[index-1].id,
      current: index + 1
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
    this.setData({
      showList: true
    })
  },
  closeList() {
    this.setData({
      showList: false
    })
  },
  // 在播放列表里面点击播放歌曲
  playSong(e) {
    const songInfo = {
      name: e.currentTarget.dataset.name,
      songpic: e.currentTarget.dataset.songpic,
      index: e.currentTarget.dataset.no,
      id: e.currentTarget.dataset.id,
      duration: e.currentTarget.dataset.duration,
      url: e.currentTarget.dataset.url
    }
    console.log(songInfo)
    wx.setStorage({
      key: "songInfo",
      data: songInfo
    })
    // 如果点击的还是当前播放的歌曲则不用重新播放
    if (index !== e.currentTarget.dataset.no) {
      app.playmusic(songInfo)
    }
    this.setData({
      showList: false,
      index: e.currentTarget.dataset.no,
      current: e.currentTarget.dataset.no,
      name: e.currentTarget.dataset.name,
      songpic: e.currentTarget.dataset.songpic,
      duration: tool.formatduration(Number(e.currentTarget.dataset.duration))
    })
  }
})