
const app = getApp()
import tool from '../../utils/util'

import { playList, playList2, playList3 } from '../../utils/pageOtpions/songOtpions'
import { getData } from '../../utils/httpOpt/http'

Page({
  data: {
    canplay: [],
    percent: 0,
    id: null,
    songpic: null,
    name: null,
    index: null,
    current: null,
    zjNo: 0,
    songInfo: {},
    initPgae: false,
    leftWith: '184vh',
    leftPadding: '0vh 12.25vh  20vh',
    btnsWidth: '165vh',
    imageWidth: '49vh',
    pageNo: 1,
    pageSize: 10,
    total: 0
  },
  onLoad(options) {
    // 暂存专辑全部歌曲
    app.globalData.abumInfoData = playList
    this.setData({
      zjNo: options.no,
      src: options.src.replace('$', '==')
    })
    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().windowWidth;
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    console.log(windowWidth, windowHeight)
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 1/2) {
      this.setData({
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 9.8vh 20vh',
        btnsWidth: '140vh',
        imageWidth: windowWidth * 0.17 + 'px'
      })
    } else {
      this.setData({
        leftWith: '184vh',
        leftPadding: '0vh 12.25vh 20vh',
        btnsWidth: '165vh',
        imageWidth: '49vh'
      })
    }
    // 获取专辑列表
    console.log(options)
    this.getPlayList({pageNo: 1, pageSize: 10, id: options.id})
  },
  onShow() {
    const index = app.globalData.songInfo && app.globalData.songInfo.name ? app.globalData.songInfo.index : null
    this.setData({
      current: index,
      initPgae: true
    })
  },
  onHide() {
    this.setData({
      initPgae: false
    })
  },
  // 调用子组件的方法，进行通讯,传值true显示选集列表
  changeProp() {
    this.selectWorks = this.selectComponent('#selectWorks')
    
    let val = {
      hidShow: true,
      sum: this.data.total
    }
    this.selectWorks.hideShow(val)
  },
  // 接受子组件传值
  changeWords(e) {
    console.log(e.detail)
    // 请求新的歌曲列表
    this.getPlayList(e.detail)
  },

  // 点击歌曲名称跳转到歌曲详情
  goPlayInfo(e) {
    // 这里还要判断一下点击的歌曲是 否是正在播放的歌曲
    
    // 点击歌曲的时候把歌曲信息存到globalData里面
    const songInfo = e.currentTarget.dataset.song
    app.globalData.songInfo = songInfo
    

    // 缓存至最近收听
    let latListenData = wx.getStorageSync('latListenData') || []
    let latFlag = latListenData.filter(v => v.id === songInfo.id).length
    if(latFlag === 0) {
      latListenData.push(songInfo)
    }
    
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
    this.setData({
      current: index.detail
    })
  },
  // 获取歌曲列表
  async getPlayList(params) {
    // 数据请求
    const res = await getData('abumInfo', params)
    console.log('res', res)
    const canplay = res.data
    canplay.forEach(item => {
      item.formatDt = tool.formatduration(Number(item.dt))
    })
    this.setData({
      canplay: canplay,
      total: res.total
    })
    wx.setStorage({
      key: "canplay",
      data: canplay
    })
  },
  // 播放全部
  playAll() {
    app.globalData.canplay = this.data.canplay
    app.globalData.songInfo = this.data.canplay[0]
    app.playing()
    this.setData({
      current: 0,
      songInfo: app.globalData.songInfo
    })
  }
})
