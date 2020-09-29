function formatTime(date, type) {
  type = type || 1;
  //type 1,完成输出年月日时分秒，2对比当前时间输出日期，或时分;
  var d = new Date(date)
  var year = d.getFullYear()
  var month = d.getMonth() + 1
  var day = d.getDate()
  var hour = d.getHours()
  var minute = d.getMinutes()
  var second = d.getSeconds();
  if (type == 1) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }
  else if (type == 3) {
    return [year, month, day].map(formatNumber).join('-');
  } else {
    var jm = new Date
      , Fo = jm.getTime() - date;
    if (Fo <= 6e4)
      return "刚刚";
    var Qq = jm.getHours() * 36e5 + jm.getMinutes() * 6e4 + jm.getSeconds() * 1e3;
    if (day==jm.getDate()) {
      if (Fo < 36e5) {
        var bOh = Math.floor(Fo / 6e4);
        return bOh + "分钟前"
      }
      return [hour, minute].map(formatNumber).join(':');
    } else {
      if (Fo < Qq + 864e5) {
        return "昨天" + [hour, minute].map(formatNumber).join(':');
      } else {
        var hq = jm.getFullYear()
          , bOg = new Date(hq, 0, 1);
        var Qq = jm.getTime() - bOg.getTime();
        if (Fo < Qq) {
          return year + "年" + month + "月" + day + "日" + [hour, minute].map(formatNumber).join(':');
        }
        return year + "年" + month + "月" + day + "日"
      }
    }
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//转换播放时间
function formatduration(duration) {
  duration = new Date(duration);
  return formatNumber(duration.getMinutes()) + ":" + formatNumber(duration.getSeconds());
}

//音乐播放监听
function playAlrc(that, app) {
  wx.getBackgroundAudioPlayerState({
    complete: function (res) {
      // console.log('res', res)
      var time = 0, playing = false, playtime = 0, downloadPercent = 0;
      // 1是正常播放，2是异常
      if (res.status != 2) {
        time = res.currentPosition / res.duration * 100;
        playtime = res.currentPosition;
        downloadPercent = res.downloadPercent
      } if (res.status == 1) {
        playing = true;
      }
      app.globalData.playing = playing;
      app.globalData.percent = time
      that.setData({
        playtime: playtime ? formatduration(playtime * 1000) : '00:00',
        percent: time || 0,
        playing: playing,
        downloadPercent: downloadPercent
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
    app.stopmusic(1);
  } else {
    console.log("继续播放")
    that.setData({
      playing: true
    });
    app.seekmusic(app.globalData.playtype, app.globalData.currentPosition, cb);
  }
}


module.exports = {
  formatTime: formatTime,
  formatduration: formatduration,
  playAlrc: playAlrc,
  toggleplay: toggleplay
}
