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
    canplay: [],
    currentList: [],
    loopType: 'listLoop'   // 默认列表循环
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
  },

  
  vision: '1.0.0',
  cutplay: function (that, type) {
    // 判断循环模式
    let currentList = this.globalData.currentList.length ? this.globalData.currentList : wx.getStorageSync('currentList')
    console.log(currentList, this.globalData.songInfo, '+++++++++++++++++++++++==============================================++++++++++++++++++++++++++++++++')
    // 设置列表的index
    let no = this.globalData.songInfo.index
    let index = this.setIndex(type, no, currentList)
    //播放列表中下一首
    this.globalData.songInfo = currentList[index]
    wx.setStorage({
      key: "songInfo",
      data: currentList[index]
    })
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    wx.pauseBackgroundAudio();
    console.log(this.globalData.songInfo.url+ '=====================================++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    this.globalData.loopType === 'singleLoop' ? this.playing(0) : this.playing()
    // 切完歌改变songInfo的index
    this.globalData.songInfo.index = index
    this.globalData.songInfo.dt = tool.formatduration(Number(this.globalData.songInfo.dt))
    that.setData({
      songInfo: this.globalData.songInfo,
      current: index,
      currentId: currentList[index].id
    })
  },
  // 根据循环模式设置切歌的index
  setIndex(type, no, list) {
    let index
    if (this.globalData.loopType === 'listLoop' || this.globalData.loopType === 'shufflePlayback') {
      if (type === 1) {
        index = no + 1 > list.length - 1 ? 0 : no + 1
      } else {
        index = no - 1 < 0 ? list.length - 1 : no - 1
      }
    } else {
      index = 0
    }
    return index
  },
  // 暂停音乐
  stopmusic: function () {
    wx.pauseBackgroundAudio();
  },
  // 根据歌曲url播放歌曲
  playing: function (seek, cb) {
    var that = this
    const songInfo = that.globalData.songInfo
    // console.log('mmmm', songInfo)
    wx.playBackgroundAudio({
      dataUrl: songInfo.url,
      title: songInfo.name,
      success: function (res) {
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
  }
})
