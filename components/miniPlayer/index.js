const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/buttonConfig'

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
    name: {
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
    canplay: []
  },
  observers: {
    'playing': function() {
      console.log('playing')
    }
  },
  attached: function () {
    const canplay = wx.getStorageSync('canplay')
    this.setData({
      canplay: canplay
    })
    this.listenPlaey()
  },
  detached: function () {
    clearInterval(timer)
  },
  lifetimes: {
    attached: function () {

    },
    detached: function () {

    },
    ready: function() {

    }
  },
  
  pageLifetimes: {
    show: function() {
      // 每次从缓存中拿到当前歌曲的相关信息，还有播放列表
      const canplay = wx.getStorageSync('canplay')
      if (app.globalData.songInfo && app.globalData.songInfo.name) {
        this.setData({
          songInfo: app.globalData.songInfo,
          canplay: canplay
        })
      } 
      const that = this;
      // 监听歌曲播放状态，比如进度，时间
      tool.playAlrc(that, app);
      timer = setInterval(function () {
        tool.playAlrc(that, app);
      }, 1000);
    },
    hide: function() {
      
    }
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
      if (app.globalData.songInfo.name) {
        const index = app.globalData.songInfo.index - 1 < 0 ? this.data.canplay.length - 1 : app.globalData.songInfo.index - 1
        this.triggerEvent('current', index)
      }
      const canplay = this.data.canplay
      // 设置播放图片名字和时长
      const that = this
      app.cutplay(that, - 1, canplay)
      
    },
    // 下一首
    next() {
      if (app.globalData.songInfo.name) {
        const index = app.globalData.songInfo.index + 1 > this.data.canplay.length - 1 ? 0 : app.globalData.songInfo.index + 1
        this.triggerEvent('current', index)
      }
      const canplay = this.data.canplay
      // 设置播放图片名字和时长
      const that = this
      app.cutplay(that, + 1, canplay)
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
      if (app.globalData.songInfo && app.globalData.songInfo.name) {
        that.setData({
          songInfo: app.globalData.songInfo
        })
      }
      
      // 监听歌曲播放状态，比如进度，时间
      tool.playAlrc(that, app);
      timer = setInterval(function () {
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
    }
  }
})
