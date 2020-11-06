// import { getData } from '../../utils/httpOpt/http'
const { getData } = require('../../utils/https')
const app = getApp()

Page({
  data: {
    screen: app.globalData.screen,
    lalyLtn: {icon: '/images/zjst.png'},
    info: [],
    confirm: '',
    retcode: 1
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

  onLoad(options) {
    console.log('palying---------------' + app.globalData.playing)
    // 数据请求
    const promise = getData('index', {user: 'ljg'})
    promise.then(res => {
      // console.log(res)
      app.globalData.indexData = res
      this.setData({
        info: res,
        retcode: 1
      })
    }).catch(err => {
      this.setData({
        confirm: err.err,
        retcode: 0
      })
      this.bgConfirm = this.selectComponent('#bgConfirm')
      this.bgConfirm.hideShow(true, 'out', ()=>{})
    })
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})