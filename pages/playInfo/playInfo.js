
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/buttonConfig'

var timer = null

Page({
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    current: null,
    btns: btnConfig.playInfoBtns,
    bigScreen:false
  },
  onLoad(options) {
    // 获取歌曲列表
    const canplay = wx.getStorageSync('canplay')
    const songInfo = app.globalData.songInfo
    songInfo.dt = String(songInfo.dt).split(':').length > 1 ? songInfo.dt : tool.formatduration(Number(songInfo.dt))
    this.setData({
      songInfo: songInfo,
      canplay: canplay
    })
    // 如果点击的还是当前播放的歌曲则不用重新播放
    if (options.noPlay !== 'true') {
      app.playing()
    }

    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().windowWidth;
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    console.log(windowWidth, windowHeight)
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth <= 1/2) {
      this.setData({
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 9.8vh 20vh',
        btnsWidth: '140vh',
        imageWidth: windowWidth * 0.17 + 'px'
      })
    } else {
      setData({
        leftWith: '184vh',
        leftPadding: '0vh 12.25vh 20vh',
        btnsWidth: '165vh',
        imageWidth: '49vh'
      })
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
  btnsPlay(e) {
    const type = e.currentTarget.dataset.name
      switch (type) {
        case 'pre':
          this.pre()
          break;
        case 'toggle':
          this.togglePlay()
          break;
        case 'next':
          this.next()
          break;
        case 'more':
          this.more()
          break;
        default:
          break;
      }
  },
  // 上一首
  pre() {
    const that = this
    const canplay = this.data.canplay
    app.cutplay(that, -1, canplay)
  },
  // 下一首
  next() {
    const that = this
    const canplay = this.data.canplay
    app.cutplay(that, 1, canplay)
  },
  // 暂停
  togglePlay() {
    tool.toggleplay(this, app)
  },
  // 播放列表
  more() {
    this.data.canplay.forEach(item => {
      item.dtFormat = tool.formatduration(Number(item.dt))
    })
    this.setData({
      showList: true,
      current: app.globalData.songInfo.index,
      canplay: this.data.canplay
    })
  },
  closeList() {
    this.setData({
      showList: false
    })
  },
  // 在播放列表里面点击播放歌曲
  playSong(e) {
    const songInfo = e.currentTarget.dataset.song
    app.globalData.songInfo = songInfo
    songInfo.dt = tool.formatduration(Number(songInfo.dt))
    app.playing()
    this.setData({
      showList: false,
      songInfo: songInfo,
      current: e.currentTarget.dataset.no
    })
  },
  // 点击改变进度
  setPercent(e) {
    // 传入当前毫秒值
    const time = e.detail.value / 100 * tool.formatToSend(app.globalData.songInfo.dt)
    app.globalData.currentPosition = time
    if (app.globalData.songInfo.dt) {
      if (this.data.playing) {
        this.setData({
          drapType: false
        })
        app.playing(time)
      }
      this.setData({
        percent: e.detail.value,
        drapPercent: e.detail.value
      })
    }
  },
  // 拖拽改变进度
  dragPercent(e) {
    const that = this
    tool.playAlrc(that, app, e.detail.value);
    this.setData({
      drapType: true,
      percent: e.detail.value,
      drapPercent: e.detail.value
    })
  }
})