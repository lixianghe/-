
const app = getApp()
import tool from '../../utils/util'

import { playList, playList2, playList3 } from '../../utils/pageOtpions/songOtpions'

Page({
  data: {
    canplay: [],
    percent: 0,
    id: null,
    songpic: null,
    name: null,
    index: null,
    current: null,
    Episode: 205,
    zjNo: 0,
    songInfo: {},
  },
  onLoad(options) {
    // 暂存专辑全部歌曲
    app.globalData.abumInfoData = playList
    this.setData({
      zjNo: options.no,
      src: options.src.replace('$', '==')
    })
  },
  onShow() {
    const index = app.globalData.songInfo && app.globalData.songInfo.name ? app.globalData.songInfo.index : null
    this.setData({
      current: index
    })
    this.getPlayList()
  },
  // 调用子组件的方法，进行通讯,传值true显示选集列表
  changeProp() {
    this.selectWorks = this.selectComponent('#selectWorks')
    
    let val = {
      hidShow: true,
      sum: this.data.Episode
    }
    this.selectWorks.hideShow(val)
  },
  // 接受子组件传值
  changeWords(e) {
    console.log(e)
    
    // 请求新的歌曲列表
  },

  // 点击歌曲名称跳转到歌曲详情
  goPlayInfo(e) {
    // 这里还要判断一下点击的歌曲是 否是正在播放的歌曲
    
    console.log(e.currentTarget.dataset.song)
    // 点击歌曲的时候把歌曲信息存到globalData里面
    const songInfo = e.currentTarget.dataset.song
    console.log(songInfo)
    app.globalData.songInfo = songInfo
    

    // 缓存至最近收听
    let latListenData = wx.getStorageSync('latListenData') || []
    let latFlag = latListenData.filter(v => v.id === songInfo.id).length
    if(latFlag === 0) {
      latListenData.push(songInfo)
    }
    console.log(latListenData)
    
    wx.setStorage({
      key: "latListenData",
      data: latListenData
    })
    wx.navigateTo({
      url: '../playInfo/playInfo'
    })
    this.setData({
      current: songInfo.index
    })
  },
  // 改变current
  changeCurrent(index) {
    console.log(index)
    this.setData({
      current: index.detail
    })
  },
  // 获取歌曲列表
  getPlayList() {
    var canplay;
    if (this.data.zjNo === '0') {
      canplay = playList
    } else if (this.data.zjNo === '1') {
      canplay = playList2
    } else {
      canplay = playList3
    }
    canplay.forEach(item => {
      item.formatDt = tool.formatduration(Number(item.dt))
    })
    console.log('canplay', canplay)
    this.setData({
      canplay: canplay
    })
    wx.setStorage({
      key: "canplay",
      data: canplay
    })
  },
  // 播放全部
  playAll() {
    console.log(this.data.canplay)
    app.globalData.canplay = this.data.canplay
    app.globalData.songInfo = this.data.canplay[0]
    app.playing()
    this.setData({
      current: 0
    })
  }
})

