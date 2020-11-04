const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'

var timer = null

Component({
  properties: {
    percent: {
      type: Number,
      default: 0,
    },
    songpic: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    no: {
      type: Number,
      default: 0,
    },
    songInfo: {
      type: Object,
      default: {}
    }
  },
  data: {
    // minibar的按钮
    items: btnConfig.miniBtns,
    playing: false,
    hoverflag: false,
    current: null,
    canplay: [],
    mianColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar
  },
  audioManager: null,
  observers: {
    'playing': function() {
      console.log('playing')
    }
  },
  attached: function () {

  },
  detached: function () {

  },
  methods: {
    player(e) {
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
        default:
          break;
      }
    },
    // 上一首
    pre() {
      let allList = wx.getStorageSync('allList')
      if (app.globalData.songInfo.title) {
        const index = app.globalData.songInfo.episode - 1 < 0 ? allList.length : app.globalData.songInfo.episode - 1
        this.triggerEvent('current', index - 1)
      }
      // 设置播放图片名字和时长
      const that = this
      app.cutplay(that, - 1)
    },
    // 下一首
    next() {
      let allList = wx.getStorageSync('allList')
      console.log(app.globalData.songInfo.episode)
      if (app.globalData.songInfo.title) {
        const index = app.globalData.songInfo.episode + 1 > allList.length ? 0 : app.globalData.songInfo.episode + 1
        console.log(index)
        this.triggerEvent('current', index - 1)
      }
      // 设置播放图片名字和时长
      const that = this
      app.cutplay(that, + 1)
    },
    // 暂停
    togglePlay() {
      tool.toggleplay(this, app)
    },
    // 进入播放详情
    playInfo() {
      wx.navigateTo({
        url: '../playInfo/playInfo?noPlay=true'
      })
    },
    // 监听音乐播放的状态
    listenPlaey() {
      const that = this;
      // 每次从缓存中拿到当前歌曲的相关信息，还有播放列表
      if (app.globalData.songInfo && app.globalData.songInfo.title) {
        that.setData({
          songInfo: app.globalData.songInfo
        })
      }
      // 监听歌曲播放状态，比如进度，时间
      tool.playAlrc(that, app);
      timer = setInterval(() => {
        tool.playAlrc(that, app);
      }, 1000);
    },
    btnstart(e) {
      const index = e.currentTarget.dataset.index
      this.setData({
        hoverflag: true,
        current: index

      })
    },
    btend() {
      setTimeout(()=> {
        this.setData({
          hoverflag: false,
          current: null
        })
      }, 150)
    },
    watchPlay() {
      app.globalData.songInfo = wx.getStorageSync('songInfo')
      console.log('app.globalData.songInfo', app.globalData.songInfo)
      const playing = wx.getStorageSync('playing')
      this.setData({
        songInfo: app.globalData.songInfo 
      })
      // 如果上次退出是播放状态就继续播放
      if (playing) {
        app.playing()
      }
    },
    // 因为1.9.2版本无法触发onshow和onHide所以事件由它父元素触发
    setOnShow() {
      clearInterval(timer)
      console.log('进入attached')
      const canplay = wx.getStorageSync('canplay')
      this.setData({
        canplay: canplay
      })
      this.listenPlaey()
      // 初始化backgroundManager
      let that = this
      tool.initAudioManager(that, canplay)
      const playing = wx.getStorageSync('playing')
      if (playing) app.playing()
    },
    setOnHide() {
      console.log('进入OnHide')
      clearInterval(timer)
    }
  }
})
