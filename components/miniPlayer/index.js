const app = getApp()
import tool from '../../utils/util'

var timer = null
var index = 0

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
    playUrl: '../../static/images/play.png'
  },
  observers: {
    // songpic() {
    //   this.data.items[3].img = this.data.songpic
    //   this.setData({
    //     items: this.data.items
    //   })
    // },
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
      // 记录播放到那一首歌
      index = this.data.no
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
      console.log('pre', index)
      const canplay = app.globalData.canplay
      // 设置播放图片名字和时长
      this.setData({
        id: canplay[index-1].id,
        name: canplay[index - 1].name,
        songpic: canplay[index - 1].al.picUrl.replace('$', '=='),
        duration: tool.formatduration(Number(canplay[index - 1].dt)),
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
      const canplay = app.globalData.canplay
      console.log(canplay, index)
      // 设置播放图片名字和时长
      this.setData({
        id: canplay[index+1].id,
        name: canplay[index + 1].name,
        songpic: canplay[index + 1].al.picUrl.replace('$', '=='),
        duration: tool.formatduration(Number(canplay[index + 1].dt)),
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
    // 进入播放详情
    playInfo() {
      this.triggerEvent('myevent')
    }
  }
})
