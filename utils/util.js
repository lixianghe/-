function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//转换播放时间
function formatduration(duration) {
  duration = new Date(duration);
  return formatNumber(duration.getMinutes()) + ":" + formatNumber(duration.getSeconds());
}

// 时间转秒
function formatToSend(dt) {
  const dtArray = dt.split(':')
  const seconds = Number(dtArray[0]) * 60 + Number(dtArray[1])
  return seconds
}

//音乐播放监听
function playAlrc(that, app) {
  wx.getBackgroundAudioPlayerState({
    complete: function (res) {
      var time = 0, playing = false, playtime = 0;
      // 1是正常播放，2是异常
      if (res.status != 2) {
        time = res.currentPosition / res.duration * 100;
        playtime = res.currentPosition;
      }
      if (res.status == 1) {
        playing = true;
      }
      app.globalData.playing = playing;
      app.globalData.percent = time
      app.globalData.currentPosition = playtime
      // console.log('========监听捕获========='+ playing+'==========='+time+'=============')
      if (that.data.isDrag) return
      that.setData({
        playtime: playtime ? formatduration(playtime * 1000) : '00:00',
        percent: time || 0,
        playing: playing
      })
      wx.setStorage({
        key: "playing",
        data: playing
      })
      // 设置abumInfo页面的播放状态用来控制gif是否展示
      that.triggerEvent('setPlaying', playing)
    }
  });
};


function toggleplay(that, app) {
  if (that.data.playing) {
    console.log("暂停播放");
    that.setData({ 
      playing: false 
    });
    app.stopmusic();
  } else {
    console.log("继续播放")
    that.setData({
      playing: true
    });
    if (!that.data.songInfo || !that.data.songInfo.src) {
      wx.showToast({
        title: '该内容为会员付费内容，请先成为会员再购买收听~',
        icon: 'none'
      })
      return
    }
    app.playing(app.globalData.currentPosition, that);
    app.log('toggle' + app.globalData.songInfo + JSON.stringify(that))
  }
}


// 初始化 BackgroundAudioManager
function initAudioManager(that, songInfo) {
  let cutAllList = wx.getStorageSync('cutAllList') || []
  that.audioManager = wx.getBackgroundAudioManager()
  songInfo.abumInfoName = wx.getStorageSync('abumInfoName') || ''
  that.audioManager.playInfo = {
    playList: cutAllList,
    context: songInfo
  };
  EventListener(that)
}

// 从面板切到小程序的赋值
function panelSetInfo(app, that) {
  // 测试getPlayInfoSync
  if (wx.canIUse('getPlayInfoSync')) {
    let res = wx.getPlayInfoSync()
    app.log(JSON.stringify(res.context))
    let panelSong = JSON.parse(res.context)
    if (panelSong.src) {
      app.globalData.songInfo = panelSong
      wx.setStorageSync('songInfo', panelSong)
      that.setData({
        songInfo: panelSong,
        showModal: false,
        currentId: panelSong.id,
        abumInfoName: panelSong.abumInfoName
      })
    }
    let playing = res.playState.status == 1 ? true : false
    wx.setStorageSync('playing', playing)
  }
}

// 监听播放，上一首，下一首
function EventListener(that){
  //播放事件
  that.audioManager.onPlay(() => {
    console.log('-------------------------------onPlay-----------------------------------')
    wx.hideLoading()
    wx.setStorageSync('playing', true)
  })
  //暂停事件
  that.audioManager.onPause(() => {
    console.log('触发播放暂停事件');
    wx.setStorageSync('playing', false)
  })
  //上一首事件
  that.audioManager.onPrev(() => {
    console.log('触发上一首事件');
    that.pre(true)
  })
  //下一首事件
  that.audioManager.onNext(() => {
    console.log('触发onNext事件');
    that.next(true);
  })
  //停止事件
  that.audioManager.onStop(() => {
    console.log('触发停止事件');
  })
  //播放错误事件
  that.audioManager.onError(() => {
    console.log('触发播放错误事件');
  })
  //播放完成事件
  that.audioManager.onEnded(() => {
    console.log('触发播放完成事件');
  })
}



// 函数节流
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 100;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

// 函数防抖
function debounce(fn, interval = 300) {
  let canRun = true;
  return function () {
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
          fn.apply(this, arguments);
          canRun = true;
      }, interval);
  };
}

// 打乱数组，返回
function randomList(arr) {
  let len = arr.length;
  while (len) {
      let i = Math.floor(Math.random() * len--);
      [arr[i], arr[len]] = [arr[len], arr[i]];
  }
  return arr;
}


module.exports = {
  formatToSend: formatToSend,
  formatduration: formatduration,
  playAlrc: playAlrc,
  toggleplay: toggleplay,
  initAudioManager: initAudioManager,
  EventListener: EventListener,
  throttle: throttle,
  debounce: debounce,
  panelSetInfo: panelSetInfo,
  randomList: randomList
}
