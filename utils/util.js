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
function playAlrc(that, app, percent) {
  // 如果是拖拽的情况
  
  if (percent !== undefined) {
    console.log(percent, formatToSend(app.globalData.songInfo.dt), formatduration(percent / 100 * formatToSend(app.globalData.songInfo.dt)))
    that.setData({
      playtime: percent ? formatduration(percent * 10 * formatToSend(app.globalData.songInfo.dt)) : '00:00',
      percent: percent
    })
    return
  }
  wx.getBackgroundAudioPlayerState({
    complete: function (res) {
      var time = 0, playing = false, playtime = 0;
      // 1是正常播放，2是异常
      if (res.status != 2) {
        time = res.currentPosition / res.duration * 100;
        playtime = res.currentPosition;
      } if (res.status == 1) {
        playing = true;
      }
      app.globalData.playing = playing;
      app.globalData.percent = time
      that.setData({
        playtime: playtime ? formatduration(playtime * 1000) : '00:00',
        percent: time || 0,
        playing: playing
      })
    }
  });
};


function toggleplay(that, app, cb) {
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
    app.playing(app.globalData.currentPosition, cb);
  }
}


module.exports = {
  formatToSend: formatToSend,
  formatduration: formatduration,
  playAlrc: playAlrc,
  toggleplay: toggleplay
}
