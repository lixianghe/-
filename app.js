import tool from './utils/util'
import { init } from './utils/httpOpt/api'
require('./utils/minixs')

App({
  globalData: {
    appName: 'listenTemplate',
    // 屏幕类型
    screen: '',
    // 登录相关
    openid: '',
    userInfo: null,
    appId: '60008',
    userId: '-1',
    haveLogin: false,
    token: '',
    isNetConnected: true,
    indexData: [],
    abumInfoData: [],

    playing: false,
    percent: 0,
    curplay: {},
    globalStop: true,
    currentPosition: 0,
    canplay: [],
    currentList: [],
    loopType: 'listLoop',   // 默认列表循环
    useCarPlay: wx.canIUse('backgroundAudioManager.onUpdateAudio'),
    PIbigScreen: null
  },
  audioManager: null,
  onLaunch: function () {
    this.initCode()
    // 判断playInfo页面样式，因为这里最快执行所以放在这
    this.setStyle()
    this.audioManager = wx.getBackgroundAudioManager()
    // 判断横竖屏
    if (wx.getSystemInfoSync().windowWidth > wx.getSystemInfoSync().windowHeight) {
      this.globalData.screen = 'h'
    } else {
      this.globalData.screen = 'v'
    }
    // myPlugin.injectWx(wx)
    // 关于音乐播放的
    var that = this;
    //播放列表中下一首
    wx.onBackgroundAudioStop(function () { 
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      console.log('playnext', currentPage)
      that.cutplay(currentPage, 1)
    });
    //监听音乐暂停，保存播放进度广播暂停状态
    wx.onBackgroundAudioPause(function () {
      that.globalData.playing = false;
      wx.getBackgroundAudioPlayerState({
        complete: function (res) {
          that.globalData.currentPosition = res.currentPosition ? res.currentPosition : 0
        }
      })
    });
    if (wx.canIUse('getShareData')) {
      wx.getShareData({
        name: this.globalData.appName,
        success: (res)=> {
          let playing = res.data.playStatus
          wx.setStorageSync('playing', playing)
        }
      })
    }
    // 测试getPlayInfoSync
    if (wx.canIUse('getPlayInfoSync')) {
      let res = wx.getPlayInfoSync()
      console.log('$$$$$$getPlayInfoSync'+JSON.stringify(res))
    }
    
  },
  
  vision: '1.0.0',
  cutplay: function (that, type) {
    // 判断循环模式
    let allList = wx.getStorageSync('allList')
    console.log('this.globalData.songInfo.episode', this.globalData.songInfo.episode)
    // 设置列表的index
    let no = this.globalData.songInfo.episode
    let index = this.setIndex(type, no, allList) - 1
    console.log('index', index)
    //播放列表中下一首
    this.globalData.songInfo = allList[index]
    wx.setStorage({
      key: "songInfo",
      data: allList[index]
    })
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    wx.pauseBackgroundAudio();
    this.globalData.loopType === 'singleLoop' ? this.playing(0) : this.playing()
    // 切完歌改变songInfo的index
    this.globalData.songInfo.episode = index + 1
    this.globalData.songInfo.dt = String(this.globalData.songInfo.dt).split(':').length > 1 ? this.globalData.songInfo.dt : tool.formatduration(Number(this.globalData.songInfo.dt))
    that.setData({
      songInfo: this.globalData.songInfo,
      currentId: allList[index].id
    })
  },
  // 根据循环模式设置切歌的index
  setIndex(type, no, list) {
    let index
    if (this.globalData.loopType === 'listLoop' || this.globalData.loopType === 'shufflePlayback') {
      if (type === 1) {
        index = no + 1 > list.length ? 1 : no + 1
      } else {
        index = no - 1 < 1 ? list.length : no - 1
      }
    } else {
      index = no
    }
    return index
  },
  // 暂停音乐
  stopmusic: function () {
    wx.pauseBackgroundAudio();
  },
  // 根据歌曲url播放歌曲
  playing: function (seek, cb) {
    const songInfo = this.globalData.songInfo
    // 如果是车载情况
    if (this.globalData.useCarPlay) {
      console.log('车载情况')
      this.carHandle(seek)
    } else {
      console.log('非车载情况')
      this.wxPlayHandle(songInfo, seek, cb)
    }
    
  },
  // 车载情况下的播放
  carHandle(seek) {
    let media = this.globalData.songInfo || wx.getStorageSync('songInfo')
    this.audioManager.src = media.src
    this.audioManager.title = media.title
    this.audioManager.coverImgUrl = media.coverImgUrl
    if (seek != undefined && typeof(seek) === 'number') {
      wx.seekBackgroundAudio({ position: seek })
    }
  },
  // 非车载情况的播放
  wxPlayHandle(songInfo, seek, cb) {
    console.log('songInfo', songInfo)
    var that = this
    wx.playBackgroundAudio({
      dataUrl: songInfo.src,
      title: songInfo.title,
      success: function (res) {
        console.log('res', res)
        if (seek != undefined && typeof(seek) === 'number') {
          console.log('seek', seek)
          wx.seekBackgroundAudio({ position: seek })
        };
        that.globalData.playing = true;
        cb && cb();
      },
      fail: function () {
        console.log(888)
      }
    })
  },

  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.globalData.PIbigScreen = false
    } else {
      // 1920*720
      this.globalData.PIbigScreen = true
    }
  },
  // 初始化token、deviceId、refreshToken
  initCode() {
    const token = wx.getStorageSync('token')
    if (token) return false
    let deviceInfo = {phoneDeviceCode: this.uuid()}
    wx.getSystemInfo({
      success: async (res) => {
        deviceInfo.phoneModel = res.system
        deviceInfo.sysVersion = res.version
        let initData = await init(deviceInfo)
        wx.setStorageSync('deviceId', initData.deviceId)
        wx.setStorageSync('refreshToken', initData.refreshToken)
        wx.setStorageSync('token', initData.token)
      }
    })
  },
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  }
})
