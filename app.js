import WxRequest from './plugins/wx-request/index'
var myPlugin = requirePlugin('inCar')

App({
  globalData: {
    hide: false,
    list_am: [],
    list_dj: [],
    index_dj: 0,
    index_am: 0,
    playing: false,
    playtype: 1,
    curplay: {},
    globalStop: true,
    currentPosition: 0,
    staredlist: []
  },
  onLaunch: function () {
    this.WxRequest(), 
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
      nt.postNotificationName("music_toggle", {
        playing: false,
        playtype: that.globalData.playtype,
        music: that.globalData.curplay || {}
      });
      that.globalData.playing = false;
      that.globalData.globalStop = that.globalData.hide ? true : false;
      wx.getBackgroundAudioPlayerState({
        complete: function (res) {
          that.globalData.currentPosition = res.currentPosition ? res.currentPosition : 0
        }
      })
    });
  },

  
  vision: '1.0.0',
  nextplay: function (t, cb, pos) {
    //播放列表中下一首
    this.preplay();
    var list = this.globalData.playtype == 1 ? this.globalData.list_am : this.globalData.list_dj;
    var index = this.globalData.playtype == 1 ? this.globalData.index_am : this.globalData.index_dj;
    if (t == 1) {
      index++;
    } else {
      index--;
    }
    index = index > list.length - 1 ? 0 : (index < 0 ? list.length - 1 : index);
    index = pos != undefined ? pos : index;
    this.globalData.curplay = (this.globalData.playtype == 1 ? list[index] : list[index].mainSong) || this.globalData.curplay;
    if (this.globalData.staredlist.indexOf(this.globalData.curplay.id) != -1) {
      this.globalData.curplay.starred = true;
      this.globalData.curplay.st = true;
    }
    if (this.globalData.playtype == 1) {
      this.globalData.index_am = index;
    } else {
      this.globalData.index_dj = index;
    }
    nt.postNotificationName("music_next", {
      music: this.globalData.curplay,
      playtype: this.globalData.playtype,
      p: this.globalData.playtype == 1 ? [] : list[index],
      index: this.globalData.playtype == 1 ? this.globalData.index_am : this.globalData.index_dj
    });
    this.seekmusic(this.globalData.playtype);
    cb && cb();
  },
  preplay: function () {
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    this.globalData.globalStop = true;
    wx.pauseBackgroundAudio();
  },
  stopmusic: function (type, cb) {
    wx.pauseBackgroundAudio();
  },
  seekmusic: function (type, seek, cb) {
    var that = this;
    var m = this.globalData.curplay;
    if (!m.id) return;
    this.globalData.playtype = type;
    if (cb) {
      this.playing(type, cb, seek);
    } else {
      this.geturl(function () { that.playing(type, cb, seek); })
    }
  },
  playing: function (type, cb, seek) {
    var that = this
    var m = that.globalData.curplay
    wx.playBackgroundAudio({
      dataUrl: m.url,
      title: m.name,
      success: function (res) {
        if (seek != undefined) {
          wx.seekBackgroundAudio({ position: seek })
        };
        that.globalData.globalStop = false;
        that.globalData.playtype = type;
        that.globalData.playing = true;
        nt.postNotificationName("music_toggle", {
          playing: true,
          music: that.globalData.curplay,
          playtype: that.globalData.playtype
        });
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
  geturl: function (suc, err, cb) {
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
          that.globalData.curplay.getutime = (new Date()).getTime()
          if (that.globalData.staredlist.indexOf(that.globalData.curplay.id) != -1) {
            that.globalData.curplay.starred = true;
            that.globalData.curplay.st = true;
          }
          suc && suc()
        }
      }
    })
  },
  WxRequest() {
    this.WxRequest = new WxRequest({
      baseURL: '',
    })
    this.interceptors()
    return this.WxRequest
  },
  interceptors() {
    this.WxRequest.interceptors.use({
      request(request) {
        return request
      },
      requestError(requestError) {
        return Promise.reject(requestError)
      },
      response(response) {
        if (response.statusCode === 200) {
          return Promise.resolve(response.data)
        } else {
          console.log('请求错误' + response.data.message)
          return Promise.reject(response.data)
        }
      },
      responseError(responseError) {
        return Promise.reject(responseError)
      },
    })
  },
})
