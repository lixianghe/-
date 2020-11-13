// import { getData } from '../../utils/httpOpt/httpOpt'
const { showData } = require('../../utils/httpOpt/localData')
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
      {index: 0, name: '推荐', type: '0'},
      {index: 1, name: '精品', type: '1'},
      {index: 2, name: '睡前故事', type: 2},
      {index: 3, name: '语言启蒙', type: 3},
      {index: 4, name: '亲子陪伴', type: 4},
      {index: 5, name: '凯叔儿歌', type: 5},
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
    this.getData(index)
  },
  getData(idx) {
    let res = showData.index.slice(0, idx+1).reverse()
    setTimeout(()=> {
      this.setData({
        info: res
      })
    }, 500)
  },
  onLoad(options) {
    this.getData(0)
    
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})