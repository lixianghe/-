import {options as latelyLtnOpt} from '../../utils/pageOtpions/latelyListenOpt'
const app = getApp()

Page({
  data: latelyLtnOpt,
  // 跳转到播放详情界面
  linkInfoList () {
    wx.navigateTo({
      url: '../latelyLtnList/latelyLtnList',
    })
  },
  onLoad(options) {
    const promise = latelyLtnOpt.getData()
    setTimeout(()=>{
      promise.then(res => {
        this.setData(res)
      }).catch(err => console.log(err))
    },500)
  },
  onShow() {

  }
})