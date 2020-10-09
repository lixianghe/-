
const app = getApp()
import tool from '../../utils/util'

var timer = null


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
    console.log(options)
    this.setData({
      name: options.name,
      duration: tool.formatduration(Number(options.duration)),
      songpic: options.songpic.replace('$', '=='),
      no: options.no
    })
    const that = this
    // 播放歌曲
    app.playmusic(that, options.id)
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
    console.log('pre')
    // 获取上个页面数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];  //上一个页面
    const canplay = prevPage.data.canplay
    const no = Number(this.data.no)
    // 设置播放图片名字和时长
    this.setData({
      name: canplay[no-1].name,
      songpic: canplay[no-1].al.picUrl.replace('$', '=='),
      duration: tool.formatduration(Number(canplay[no-1].dt))
    })
    app.nextplay(-1, canplay, no)
  },
  // 下一首
  next() {
    // 获取上个页面数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];  //上一个页面
    const canplay = prevPage.data.canplay
    const no = Number(this.data.no)
    console.log(canplay, no)
    // 设置播放图片名字和时长
    this.setData({
      name: canplay[no+1].name,
      songpic: canplay[no+1].al.picUrl.replace('$', '=='),
      duration: tool.formatduration(Number(canplay[no+1].dt))
    })
    app.nextplay(1, canplay, no)
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