var myPlugin = requirePlugin('inCar')
// var bsurl = 'http://localhost:3000/v1/'

App({
  globalData: {
    // 登录相关
    userInfo: null,
    appId: '60008',
    userId: '-1',
    haveLogin: false,
    token: '',
    isNetConnected: true,
    
    playing: false,
    percent: 0,
    curplay: {},
    globalStop: true,
    currentPosition: 0,
    canplay: []
  },
  
  
  onLaunch: function () {
    myPlugin.injectWx(wx)
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
  nextplay: function (t, list, no) {
    console.log(t, list, no)
    //播放列表中下一首
    this.preplay();
    var list = list
    var index = no
    if (t == 1) {
      index++;
    } else {
      index--;
    }
    index = index > list.length - 1 ? 0 : (index < 0 ? list.length - 1 : index)
    this.globalData.curplay = list[index]
    console.log(this.globalData.curplay)
    this.seekmusic(1)
  },
  preplay: function () {
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    wx.pauseBackgroundAudio();
  },
  stopmusic: function (type, cb) {
    wx.pauseBackgroundAudio();
  },

  
  playmusic:  function (songInfo) {
    this.globalData.curplay = songInfo
    console.log('songInfosongInfo', songInfo)
    this.seekmusic(1)


  },
  seekmusic: function (type, seek, cb) {
    var m = this.globalData.curplay;
    console.log(m)
    if (!m.id) return;
    this.playing(type, cb, seek);
  },
  playing: function (type, cb, seek) {
    var that = this
    var m = that.globalData.curplay
    console.log('mmmm', m)
    wx.playBackgroundAudio({
      dataUrl: m.url,
      title: m.name,
      success: function (res) {
        if (seek != undefined) {
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
