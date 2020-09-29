var myPlugin = requirePlugin('inCar')
var bsurl = 'http://localhost:3000/v1/'

App({
  globalData: {
    playing: false,
    curplay: {},
    globalStop: true,
    currentPosition: 0
  },
  onLaunch: function () {
    myPlugin.injectWx(wx)
    // 关于音乐播放的
    var that = this;
    //播放列表中下一首
    wx.onBackgroundAudioStop(function () { 
      if (that.globalData.globalStop) {
        return;
      }
      that.nextplay(that.globalData.playtype);
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

  
  playmusic:  function (that, id, br) {
    var that = this
    wx.request({
      url: bsurl + 'music/detail',
      data: {
        id: id
      },
      success:  (res) => {
        console.log(res)
        that.globalData.curplay = res.data.songs[0];
        that.seekmusic(1);
      }
    })

  },
  seekmusic: function (type, seek, cb) {
    var that = this;
    var m = this.globalData.curplay;
    console.log('m', m)
    if (!m.id) return;
    if (cb) {
      console.log(1)
      this.playing(type, cb, seek);
    } else {
      console.log(2)
      this.geturl(function () { that.playing(type, cb, seek); })
    }
  },
  playing: function (type, cb, seek) {
    var that = this
    var m = that.globalData.curplay
    console.log('m', m)
    wx.playBackgroundAudio({
      dataUrl: m.url,
      title: m.name,
      success: function (res) {
        console.log(res)
        if (seek != undefined) {
          wx.seekBackgroundAudio({ position: seek })
        };
        that.globalData.globalStop = false;
        that.globalData.playing = true;
        cb && cb();
      },
      fail: function () {
        if (type != 2) {
          that.nextplay(1)
        } else {
          that.nextfm();
        }
      }
    })
  },
  geturl: function (suc) {
    var that = this;
    var m = that.globalData.curplay
    wx.request({
      url: bsurl + 'music/url',
      data: {
        id: m.id,
        br: m.duration ? ((m.hMusic && m.hMusic.bitrate) || (m.mMusic && m.mMusic.bitrate) || (m.lMusicm && m.lMusic.bitrate) || (m.bMusic && m.bMusic.bitrate)) : (m.privilege ? m.privilege.maxbr : ((m.h && m.h.br) || (m.m && m.m.br) || (m.l && m.l.br) || (m.b && m.b.br))),
        br: 128000
      },
      success: function (a) {
        a = a.data.data[0];
        if (!a.url) {
          err && err()
        } else {
          that.globalData.curplay.url = a.url;
          suc && suc()
        }
      }
    })
  }
})
