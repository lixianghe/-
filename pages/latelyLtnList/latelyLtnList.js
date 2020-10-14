import {options as layLisOpt} from '../../utils/pageOtpions/latelyLtnListOpt'
import {formatduration} from '../../utils/util'
const createRecycleContext = require('../../components/recycle-view/index')
const app = getApp()

Page({
  data: {
    noContent: layLisOpt.noContent,
    list: [{
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":13,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    }], // 显示数据
    storageData: [], // 本地数据
    ctx: '',
    rowHig: wx.getSystemInfoSync().windowHeight / 8,
    rowWid: wx.getSystemInfoSync().windowWidth,
  },
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

    wx.navigateTo({
      url: `../playInfo/playInfo?sameFlag=${sameFlag}`
    })
  },
  scolltoLower() {
    console.log(this.data.storageData.length)
    if (this.data.storageData.length > 0) {
      this.ctx.append(this.data.storageData.splice(0, 4))
    }
  },
  onLoad(options) {
    console.log(wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight)
    const that = this
    this.setData({
      // storageData: wx.getStorageSync('latListenData').filter(v => v.pid == options.id),   // 本地存储筛选对应专辑的歌曲列表
      storageData: layLisOpt.data
    })
    this.ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'list',
      page: this,
      itemSize: { // 这个参数也可以直接传下面定义的this.itemSizeFunc函数
        width: this.data.rowWid,
        height: this.data.rowHig
      }
    })
    this.ctx.append(this.data.storageData.splice(0, 8))
  },
  onShow() {

  }
})