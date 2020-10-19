// var myPlugin = requirePlugin('inCar')
// var bsurl = 'http://localhost:3000/v1/'
import tool from './utils/util'

App({
  globalData: {
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
    canplay: []
  },
  
  
  onLaunch: function () {
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
      // 获取歌曲列表
      const canplay = wx.getStorageSync('canplay')
      // 获取缓存的歌曲信息
      const songInfo = wx.getStorageSync('songInfo')
      that.nextplay(1, canplay, songInfo.index)
      const page = getCurrentPages()
      console.log(page)
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
  },

  
  vision: '1.0.0',
  cutplay: function (that, type, list) {
    let no = this.globalData.songInfo.index
    let index
    if (type === 1) {
      index = no + 1 > list.length - 1 ? 0 : no + 1
    } else {
      index = no - 1 < 0 ? list.length - 1 : no - 1
    }
    console.log(index)
    //播放列表中下一首
    this.globalData.songInfo = list[index]
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    wx.pauseBackgroundAudio();
    this.playing(this.globalData.songInfo)
    // 切完歌改变songInfo的index
    this.globalData.songInfo.index = index
    that.setData({
      songInfo: this.globalData.songInfo
    })
  },
  stopmusic: function () {
    wx.pauseBackgroundAudio();
  },
  playing: function (seek, cb) {
    var that = this
    const songInfo = that.globalData.songInfo
    console.log('mmmm', songInfo)
    wx.playBackgroundAudio({
      dataUrl: songInfo.url,
      title: songInfo.name,
      success: function (res) {
        if (seek != undefined) {
          console.log(seek)
          wx.seekBackgroundAudio({ position: seek })
        };
        that.globalData.playing = true;
        cb && cb();
      },
      fail: function () {
        
      }
    })
  }
})
