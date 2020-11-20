const app = getApp()
Page({
  mixins: [require('../../developerHandle/latelyListen')],
  data: {
    screen: app.globalData.screen,
    noContent: '/images/nullContent.png',
    info: '',
    currentTap: 0,
    scrollLeft: 0,
    retcode: 1,
    labels: [
      {index: 0, name: '专辑', contentType: 'album'},
      {index: 1, name: '故事', contentType: 'media'}
    ]
  },
  screen: app.globalData.screen,
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index,
      retcode: 0
    })
    console.log(this.data.labels[index].contentType+'23232323232行')
    this.getData(this.data.labels[index].contentType)
  },
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