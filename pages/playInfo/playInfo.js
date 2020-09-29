
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
    // 获取缓存的歌曲信息
    const songInfo = wx.getStorageSync('songInfo')
    this.setData({
      name: songInfo.name,
      duration: tool.formatduration(Number(songInfo.duration)),
      songpic: songInfo.songpic
    })
    index = songInfo.index
    // 播放歌曲
    app.playmusic(this, songInfo.id)
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
    // 获取上个页面数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];  //上一个页面
    const canplay = prevPage.data.canplay
    // 设置播放图片名字和时长
    this.setData({
      name: canplay[index-1].name,
      songpic: canplay[index-1].al.picUrl.replace('$', '=='),
      duration: tool.formatduration(Number(canplay[index-1].dt))
    })
    app.nextplay(-1, canplay, index)
    index--
  },
  // 下一首
  next() {
    console.log('next', index)
    // 获取上个页面数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];  //上一个页面
    const canplay = prevPage.data.canplay
    console.log(canplay, index)
    // 设置播放图片名字和时长
    this.setData({
      name: canplay[index+1].name,
      songpic: canplay[index+1].al.picUrl.replace('$', '=='),
      duration: tool.formatduration(Number(canplay[index+1].dt))
    })
    app.nextplay(1, canplay, index)
    index++
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