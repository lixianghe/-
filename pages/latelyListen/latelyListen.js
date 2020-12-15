const app = getApp()
Page({
  mixins: [require('../../developerHandle/latelyListen')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    info: '',
    currentTap: 0,
    
    mainColor: app.globalData.mainColor
  },
  scrollRight () {
    wx.showToast({
      title: '已经到底啦！',
      icon: 'none'
    })
  },
 
  onLoad(options) {
    let that = this
    app.getNetWork(that)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})