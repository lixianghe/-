const app = getApp()
import tool from '../../utils/util'

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
    }
  },
  data: {
    // minibar的按钮
    items: [
      {
        name: 'pre',
        img: '../../static/images/pre.png',
      },
      {
        name: 'stop'
      },
      {
        name: 'next',
        img: '../../static/images/next.png',
      }
    ],
    playing: false,
    stopUrl: '../../static/images/stop.png',
    playUrl: '../../static/images/play.png',
    songInfo: {}
  },
  observers: {

  },
  lifetimes: {
    attached: function () {
      console.log(this.data)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function() {
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
    hide: function() {
      clearInterval(timer)
    }
  },
  methods: {
    player(e) {
      const type = e.currentTarget.dataset.name
      switch (type) {
        case 'pre':
          this.pre()
          break;
        case 'stop':
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
    }
  }
})
