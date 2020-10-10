import {options as indOpt} from '../../utils/pageOtpions/indexOpt'
const app = getApp()

Page({
  data: indOpt,
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
    if (indexData.filter(v => v.id === id).length === 0) {
      let item = app.globalData.indexData.filter(obj => obj.id === id)[0]
      indexData.push(item)
    }
    wx.setStorageSync('indexData', indexData)
    wx.navigateTo({
      url: `../abumInfo/abumInfo?id=${id}`
    })
  },
  onLoad(options) {
    app.globalData.indexData = indOpt.info
    const promise = indOpt.getData()
    setTimeout(()=>{
      promise.then(res => {
        app.globalData.indexData = res.info
        this.setData(res)
      }).catch(err => console.log(err))
    },500)
  },
  onShow() {

  }
})