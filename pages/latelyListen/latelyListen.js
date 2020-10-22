const app = getApp()

Page({
  data: {
    screen: app.globalData.screen,
    noContent: '/images/nullContent.png',
    info: ''

  },
  screen: app.globalData.screen,
  // 跳转到播放详情界面
  linkInfoList (e) {
    let id = e.currentTarget.dataset.id
    let indexData = wx.getStorageSync('indexData') || []
    const no = e.currentTarget.dataset.no
    const src = e.currentTarget.dataset.src.replace('==', '$')
    if (indexData.filter(v => v.id === id).length === 0) {
      let item = app.globalData.indexData.filter(obj => obj.id === id)[0]
      indexData.push(item)
    }
    wx.setStorageSync('indexData', indexData)
    wx.navigateTo({
      url: `../abumInfo/abumInfo?id=${id}&no=${no}&src=${src}`
    })
  },
  onLoad(options) {
    let indexData = wx.getStorageSync('indexData') || []
    this.setData({
      info: indexData
    })
  }
})