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
    current: null
  },
  observers: {

  },
  attached: function () {
    console.log('attached')
    this.listenPlaey()
  },
  detached: function () {
    console.log('detached')
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
      console.log('stop')
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
      // 每次从缓存中拿到当前歌曲的相关信息，还有播放列表
      const canplay = wx.getStorageSync('canplay')
      console.log('opoooo', app.globalData.songInfo)
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
    btnstart(e) {
      console.log(1)
      const index = e.currentTarget.dataset.index
      this.setData({
        hoverflag: true,
        current: index

      })
    },
    btend() {
      console.log(2)
      setTimeout(()=> {
        this.setData({
          hoverflag: false,
          current: null
        })
      }, 150)
    }
  }
})
