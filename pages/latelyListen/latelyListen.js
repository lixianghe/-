import {options as indOpt} from '../../utils/indexOpt'
const app = getApp()

Page({
  data: indOpt,
  // 跳转到播放详情界面
  linkInfoList () {
    wx.navigateTo({
      url: '../latelyLtnList/latelyLtnList',
    })
  },
  onLoad(options) {
    console.log(options)
    const promise = indOpt.getData()
    setTimeout(()=>{
      promise.then(res => {
        this.setData(res)
      }).catch(err => console.log(err))
    },500)
  },
  onShow() {

  }
})