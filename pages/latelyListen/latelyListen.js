const app = getApp()
Page({
  mixins: [require('../../developerHandle/latelyListen')],
  data: {
    screen: app.globalData.screen,
    info: '',
    currentTap: 0,
    scrollLeft: 0,
    
    mainColor: app.globalData.mainColor
  },
  screen: app.globalData.screen,
 
  onLoad(options) {
    
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})