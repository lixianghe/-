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
  }
}


// 初始化 BackgroundAudioManager
function initAudioManager(app, that, songInfo, fl) {
  // that.audioManager = wx.getBackgroundAudioManager()
  // EventListener(app, that, fl)
  if (fl) {
    songInfo.abumInfoName = wx.getStorageSync('abumInfoName') || 1
    songInfo.currentPageNo = wx.getStorageSync('currentPageNo') 
    let canplaying = songInfo.abumInfoName ? wx.getStorageSync('canplaying') || [] : [songInfo]
    // let loopType = wx.getStorageSync('loopType')
    app.audioManager.playInfo = {
      playList: canplaying,
      context: JSON.stringify(songInfo),
      playDetailPagePath: "pages/index/index"
    }
    // if (loopType === 'singleLoop') that.audioManager.setPlayMode = 2
  }
  
}

// 从面板切到小程序的赋值
function panelSetInfo(app, that) {
  // 测试getPlayInfoSync
  if (wx.canIUse('getPlayInfoSync')) {
    let res = JSON.parse(JSON.stringify(wx.getPlayInfoSync()))
    let panelSong = res.playList[res.playState.curIndex]
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
function EventListener(app, that, fl){
  //播放事件
  app.audioManager.onPlay(() => {
    console.log('-------------------------------onPlay-----------------------------------')
    wx.hideLoading()
    wx.setStorageSync('playing', true)
    let pages = getCurrentPages()
    let cureentPage = pages[pages.length - 1]
    let minibar = cureentPage.selectComponent('#miniPlayer')
    if (minibar) minibar.isLiked()
  })
  //暂停事件
  app.audioManager.onPause(() => {
    console.log('触发播放暂停事件');
    wx.setStorageSync('playing', false)
  })
  //上一首事件
  app.audioManager.onPrev(() => {
    console.log('触发上一首事件');
    // that.pre(true)
     
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) {
      miniPlayer.pre(true)
    } else {
      that.pre(true)
    }

  })
  //下一首事件
  app.audioManager.onNext(() => {
    console.log('触发onNext事件');

    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) {
      miniPlayer.next(true)
    } else {
      that.next(true)
    }
    

  })
  //停止事件
  app.audioManager.onStop(() => {
    console.log('触发停止事件');
    wx.hideLoading()
  })
  //播放错误事件
  app.audioManager.onError(() => {
    console.log('触发播放错误事件');
    // 在播放错误的时候触发下播放事件,且只调用一次
    
    if (fl) {
      console.log('重新调用播放')
      app.playing(app.globalData.currentPosition, that);
      fl = false
    }
    
    
  })
  //播放完成事件
  app.audioManager.onEnded(() => {
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
