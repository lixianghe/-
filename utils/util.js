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
      app.globalData.currentPosition = playtime
      if (that.data.isDrag) return
      that.setData({
        playtime: playtime ? formatduration(playtime * 1000) : '00:00',
        percent: time || app.globalData.percent,
        playing: playing
      })
      app.globalData.percent = time
      wx.setStorage({
        key: "playing",
        data: playing
      })
      // 设置abumInfo页面的播放状态用来控制gif是否展示
      that.triggerEvent('setPlaying', playing)
    }
  });
};
/**
* 监听播放器播放进度事件
*/
function NewPlayAlrc(that, app) {
  let time = 0, playtime = 0;
  app.audioManager.onTimeUpdate(() => {
    time = app.audioManager.currentTime / app.audioManager.duration * 100;
    playtime = app.audioManager.currentTime
    app.globalData.percent = time
    app.globalData.currentPosition = app.audioManager.currentTime
    app.globalData.playtime = playtime ? formatduration(playtime * 1000) : '00:00'
    if (!that.data.isDrag) {
      that.setData({
        playtime:playtime? formatduration(playtime * 1000): '00:00',
        percent: time || 0
      })
      app.globalData.percent = time
    }
  })
}

function toggleplay(that, app) {
  if (that.data.playing) {
    console.log("暂停播放");
    that.setData({ 
      playing: false 
    });
    app.stopmusic();
  } else {
    if (!that.data.songInfo || !that.data.songInfo.dataUrl) {
      resetAudioManager(app)
      wx.showToast({
        title: '该内容为会员付费内容，请先成为会员再购买收听~',
        icon: 'none',
        duration:2000,
      })
      return
    }
    that.setData({
      playing: true
    });
    app.playing(app.globalData.currentPosition, that);
  }
}


// 初始化 BackgroundAudioManager
function initAudioManager(app, that, songInfo, fl) {
  if (fl) {
    let playList = []
    songInfo.abumInfoName = wx.getStorageSync('abumInfoName') || 1
    songInfo.currentPageNo = wx.getStorageSync('currentPageNo') 
    let canplaying = songInfo.abumInfoName ? wx.getStorageSync('canplaying') || [] : [songInfo]
    if(canplaying.length) playList = canplaying.map(item=>{
      item.options = JSON.stringify(item)
      return item
      // return{
      //   title:item.title || '',
      //   coverImgUrl:item.coverImgUrl || '',
      //   dataUrl:item.dataUrl || '',
      //   options:JSON.stringify(item),
      // }
    })
    if(JSON.stringify(app.cardPplayList) != JSON.stringify(playList)){
      app.cardPplayList = playList
      app.audioManager.playInfo = {
          playList,
          context: JSON.stringify(songInfo)
      }
    }
  }
}
// VIP音频时重置统一播放器
function resetAudioManager(app){
    app.cardPplayList = []
    app.audioManager.playInfo = {
      playList:[],
      context: ''
    }
}
// 监听播放，上一首，下一首
function EventListener(app, that, fl) {
  //播放事件
  app.audioManager.onPlay(() => {
    wx.hideLoading();
    wx.setStorageSync("playing", true);
    that.setData({
      playing: true,
    });
    let pages = getCurrentPages();
    let cureentPage = pages[pages.length - 1];
    let minibar = cureentPage.selectComponent("#miniPlayer");
    if (minibar) minibar.isLiked();
    that.triggerEvent("setPlaying", true);
  });
  //暂停事件
  app.audioManager.onPause(() => {
    const pages = getCurrentPages();
    wx.setStorageSync("playing", false);
    let miniPlayer = pages[pages.length - 1].selectComponent("#miniPlayer");
    if (miniPlayer) miniPlayer.setData({ playing: false });
    pages[pages.length - 1].setData({ playing: false });
    that.triggerEvent("setPlaying", false);
  });
  //上一首事件
  app.audioManager.onPrev(() => {
    console.log("触发上一首事件");
    const pages = getCurrentPages();
    let miniPlayer = pages[pages.length - 1].selectComponent("#miniPlayer");
    if (miniPlayer) {
      miniPlayer.pre(true);
    } else {
      pages[pages.length - 1].pre(true);
    }
  });
  //下一首事件
  app.audioManager.onNext(() => {
    console.log("触发onNext事件");
    const pages = getCurrentPages();
    let miniPlayer = pages[pages.length - 1].selectComponent("#miniPlayer");
    if (miniPlayer) {
      miniPlayer.next(true);
    } else {
      pages[pages.length - 1].next(true);
    }
  });
  //停止事件
  app.audioManager.onStop(() => {
    let time = (app.audioManager.currentTime / app.audioManager.duration) * 100;
    const pages = getCurrentPages();
    let miniPlayer = pages[pages.length - 1].selectComponent("#miniPlayer");
    if (miniPlayer) {
      miniPlayer.setData({
        percent: time,
        playing: false,
      });
    } else {
      pages[pages.length - 1].setData({
        percent: time,
        playtime: app.audioManager.currentTime
          ? formatduration(app.audioManager.currentTime * 1000)
          : "00:00",
        playing: false,
      });
    }
    app.globalData.percent = time;
    wx.hideLoading();
  });
  //播放错误事件
  app.audioManager.onError(() => {
    wx.setStorageSync("playing", false);
    const pages = getCurrentPages();
    let miniPlayer = pages[pages.length - 1].selectComponent("#miniPlayer");
    if (miniPlayer) miniPlayer.setData({ playing: false });
    pages[pages.length - 1].setData({ playing: false });
    // 在播放错误的时候触发下播放事件,且只调用一次
    if (fl) {
      app.playing(app.globalData.currentPosition, that);
      fl = false;
    }
  });
  //播放完成事件
  app.audioManager.onEnded(() => {
    console.log("触发播放完成事件");
  });
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
  // playAlrc: playAlrc,
  toggleplay: toggleplay,
  initAudioManager: initAudioManager,
  EventListener: EventListener,
  throttle: throttle,
  debounce: debounce,
  // panelSetInfo: panelSetInfo,
  randomList: randomList,
  NewPlayAlrc:NewPlayAlrc,
  resetAudioManager
}
