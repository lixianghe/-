const app = getApp()
Page({
  mixins: [require('../../developerHandle/like')],
  data: {
    screen: app.globalData.screen,
    noContent: '/images/nullContent.png',
    info: '',
    currentTap: 0,
    scrollLeft: 0,
    retcode: 1,
    labels: [
      {index: 0, name: '专辑', type: '0'},
      {index: 1, name: '故事', type: '1'},
    ],
    likePic: ['/images/info_like_no2.png', '/images/info_like.png']
  },
  screen: app.globalData.screen,
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index,
      retcode: 0
    })
    this.getData(index)
  },
  likeAbum(e) {
    console.log(e.detail)
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