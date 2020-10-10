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
    const no = e.currentTarget.dataset.no
    const src = e.currentTarget.dataset.src.replace('==', '$')
    wx.navigateTo({
      url: `../abumInfo/abumInfo?no=${no}&src=${src}`
    })
  },
  onLoad(options) {
    // const promise = indOpt.getData()
    // setTimeout(()=>{
    //   promise.then(res => {
    //     this.setData(res)
    //   }).catch(err => console.log(err))
    // },500)
  },
  onShow() {

  }
})