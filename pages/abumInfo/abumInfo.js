
const app = getApp()
const bsurl = 'http://localhost:3000/v1/'
import tool from '../../utils/util'

import { playList, playList2 } from '../../utils/pageOtpions/songOtpions'
import {formatduration} from '../../utils/util'

Page({
  data: {
    canplay: [],
    percent: 0,
    id: null,
    songpic: null,
    name: null,
    index: null,
    current: null,
    Episode: 10,
    zjNo: 0
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
    // 初始化歌曲的名字和歌曲封面，获取歌单列表
    const songInfo = wx.getStorageSync('songInfo')
    if (app.globalData.curplay.name){
      this.setData({
        songpic: songInfo.songpic,
        name: songInfo.name,
        canplay: songInfo.canplay,
        index: songInfo.index,
        current: songInfo.index
      })
    }
    
    this.getPlayList()
  },
  // 调用子组件的方法，进行通讯,传值true显示选集列表
  changeProp() {
    this.selectWorks = this.selectComponent('#selectWorks')
    console.log(this.selectWorks)
    this.selectWorks.hideShow(true)
  },
  // 接受子组件传值
  changeWords(e) {
    console.log(e)
  },

  // 点击歌曲名称跳转到歌曲详情
  goPlayInfo(e) {
    console.log(e)
    // 跳转的时候把歌名，歌曲封面，歌单序号，歌曲id存在本地缓存
    // 这里还要判断一下点击的歌曲是 否是正在播放的歌曲
    const id = wx.getStorageSync('songInfo') ? wx.getStorageSync('songInfo').id : null
    const sameFlag = id === e.currentTarget.dataset.id
    const songInfo = {
      name: e.currentTarget.dataset.name,
      songpic: e.currentTarget.dataset.songpic,
      index: e.currentTarget.dataset.no,
      id: e.currentTarget.dataset.id,
      pid: e.currentTarget.dataset.pid,
      duration: e.currentTarget.dataset.duration,
      url: e.currentTarget.dataset.url,
      dt: formatduration(e.currentTarget.dataset.dt)
    }
    wx.setStorage({
      key: "songInfo",
      data: songInfo
    })
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
      url: `../playInfo/playInfo?sameFlag=${sameFlag}`
    })
    this.setData({
      current: e.currentTarget.dataset.no
    })
  },
  // 点击mini bar跳转到歌曲详情
  barGoPlayInfo() {
    wx.navigateTo({
      url: '../playInfo/playInfo?sameFlag=true'
    })
    this.setData({
      current: e.currentTarget.dataset.no
    })
  },
  // 获取歌曲列表
  getPlayList() {
    var canplay;
    if (this.data.zjNo === '0') {
      canplay = playList
    } else {
      canplay = playList2
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
    // wx.setNavigationBarTitle({
    //   title: res.data.playlist.name
    // })
  },
  // 播放全部
  playAll() {
    console.log(this.data.canplay)
    app.globalData.canplay = this.data.canplay
    app.playmusic(this, this.data.canplay[0].id)
    this.setData({
      name: this.data.canplay[0].name,
      duration: tool.formatduration(Number(this.data.canplay[0].duration)),
      songpic: this.data.canplay[0].al.picUrl,
      current: 0
    })
    // 把第一首歌存在缓存中
    const songInfo = {
      name: this.data.canplay[0].name,
      songpic: this.data.canplay[0].al.picUrl,
      index: 0,
      id: this.data.canplay[0].id,
      duration: tool.formatduration(Number(this.data.canplay[0].duration)),
    } 
    wx.setStorageSync('songInfo', songInfo)
  }
})

