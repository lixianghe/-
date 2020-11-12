// import { getData } from '../../utils/httpOpt/httpOpt'
const { showData } = require('../../utils/httpOpt/httpOpt')
const app = getApp()

Page({
  data: {
    screen: app.globalData.screen,
    lalyLtn: {icon: '/images/zjst.png'},
    info: [],
    confirm: '',
    retcode: 1,
    currentTap: 0,
    labels: [
      '标题一',
      '标题二'
    ],
  },
  // 跳转到最近收听页面
  tolatelyListen () {
    wx.navigateTo({
      url: '../latelyListen/latelyListen?a=1'
    })
  },
  // 跳转到播放详情界面
  linkAbumInfo (e) {
    let id = e.currentTarget.dataset.id
    let indexData = wx.getStorageSync('indexData') || []
    const no = e.currentTarget.dataset.no
    const src = e.currentTarget.dataset.src.replace('==', '$')
    const title = e.currentTarget.dataset.title
    if (indexData.filter(v => v.id === id).length === 0) {
      let item = app.globalData.indexData.filter(obj => obj.id === id)[0]
      indexData.push(item)
    }
    wx.setStorageSync('indexData', indexData)
    wx.navigateTo({
      url: `../abumInfo/abumInfo?id=${id}&no=${no}&src=${src}&title=${title}`
    })
  },

  selectTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index
    })
  },
  onLoad(options) {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    })
    setTimeout(()=> {
      this.setData({
        info: showData.index
      })
    }, 1000)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})