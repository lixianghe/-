const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
import { isFavorite, like } from '../../developerHandle/playInfo'

var timer = null
var timer2 = null 

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
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    // mini player按钮配置
    miniBtns: [
      {
        name: 'pre',
        img: '/images/pre.png',
      },
      {
        name: 'toggle',
        img: {
          stopUrl: '/images/stop.png' ,
          playUrl: '/images/play.png'
        }
      },
      {
        name: 'next',
        img: '/images/next.png'
      },
      {
        name: 'like',                                             // 收藏
        img: {
          noLike: '/images/like_none.png' ,                    // 未收藏的图标
          liked: '/images/like.png'                          // 已收藏的图标
        }
      }
    ],
    // 开发者不传的话默认的按钮
    defaultBtns: [
      {
        name: 'toggle',
        img: {
          stopUrl: '/images/stop.png' ,
          playUrl: '/images/play.png'
        }
      }
    ],
    playing: false,
    hoverflag: false,
    current: null,
    mianColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar,
    existed: false
  },
  audioManager: null,
  attached: function () {

  },
  detached: function () {

  },
  methods: {
    player(e) {
      if (!this.data.songInfo || !this.data.songInfo.title){
        wx.showToast({
          title: '暂无音频',
          icon: 'none'
        })
        return false
      }
      const type = e.currentTarget.dataset.name
      if (type) this[type]()
    },
    // 上一首
    pre(panelCut) {
      // 设置播放图片名字和时长
      const that = this
      app.cutplay(that, - 1, false, panelCut)
    },
    // 下一首
    next(panelCut) {
      // 设置播放图片名字和时长
      const that = this
      console.log('minibar', that)
      app.cutplay(that, + 1, false, panelCut)
    },
    // 暂停
    toggle() {
      tool.toggleplay(this, app)
    },
    // 进入播放详情
    playInfo() {
      if (!this.data.songInfo || !this.data.songInfo.title){
        // wx.showToast({
        //   title: '暂无音频',
        //   icon: 'none'
        // })
        return false
      }
      let abumInfoName = wx.getStorageSync('abumInfoName')
      wx.navigateTo({
        url: `../playInfo/playInfo?noPlay=true&abumInfoName=${abumInfoName}`
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
      setTimeout(()=> {
        this.setData({
          hoverflag: false,
          current: null
        })
      }, 2000)
    },
    btend() {
      setTimeout(()=> {
        this.setData({
          hoverflag: false,
          current: null
        })
      }, 150)
    },
    // 收藏和取消
    like() {
      let that = this
      like(that)
    },
    setExisted(bool) {
      console.log('setExisted------------------------------------------------------', bool)
      this.setData({existed: bool})
    },
    watchPlay() {
      app.globalData.songInfo = wx.getStorageSync('songInfo')
      this.setData({
        songInfo: app.globalData.songInfo 
      })
    },
    // 因为1.9.2版本无法触发onshow和onHide所以事件由它父元素触发
    setOnShow() {
      let that = this 
      clearInterval(timer)
      this.listenPlaey()
      // 初始化backgroundManager
      
      if (wx.canIUse('getPlayInfoSync')) {
        let res = wx.getPlayInfoSync()
        console.log('getPlayInfoSync---------------------------'+JSON.stringify(res))
        let playing = res.playState && res.playState.status == 1 ? true : false
        wx.setStorageSync('playing', playing)
      }

      const playing = wx.getStorageSync('playing')
      if (playing) app.playing(null, that)
      // 是否被收藏
      let songInfo = wx.getStorageSync('songInfo')
      if (app.userInfo && app.userInfo.token) {
        isFavorite({mediaId: songInfo.id}, that)
      }
      // 循环去拿songInfo,因为一个奇葩bug。。
      timer2 = setInterval(() => {
        let song2 = wx.getStorageSync('songInfo')
        this.setData({
          songInfo: song2
        })
      }, 1000);
      setTimeout(() => {
        clearInterval(timer2)
      }, 10000);
    },
    // 判断是否是收藏，切歌时候用
    isLiked() {
       // 是否被收藏
       let that = this 
       let songInfo = wx.getStorageSync('songInfo')
       if (app.userInfo && app.userInfo.token) {
         isFavorite({mediaId: songInfo.id}, that)
       }
    },
    setOnHide() {
      clearInterval(timer)
    }
  }
})
