
const app = getApp()

Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    music: {},
    playtime: "00:00",
    duration: "00:00",
    percent: 50,
    downloadPercent: 0,
    imgload: false,
    playing: true,
    showlrc: false,
    commentscount: 0,
    lrc: {},
    stared: false,
    // minibar的按钮
    items: [
      {
        name: 'pre',
        img: '../../static/images/pre.png'
      },
      {
        name: 'stop',
        img: '../../static/images/stop.png'
      },
      {
        name: 'next',
        img: '../../static/images/next.png'
      },
      {
        name: 'song',
        img: '../../static/images/song.jpg',
        content: '周杰伦：夜曲'
      }
    ]
  },
  player(e) {
    console.log(e.currentTarget.dataset.name)
  }
})