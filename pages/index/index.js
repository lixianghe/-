// import { getData } from '../../utils/httpOpt/httpOpt'
const app = getApp()

Page({
  mixins: [require('../../developerHandle/index')],
  data: {
    screen: app.globalData.screen,
    lalyLtn: [
      {icon: '/images/zjst.png', title: "最近收听"},
      {icon: '/images/icon_collect.png', title: "我的收藏"}
    ],
    confirm: '',
    retcode: 1,
    currentTap: 0,
    scrollLeft: 0,
    labels: [
      {index: 0, name: '相声评书', type: 0},
      {index: 1, name: '人文', type: 1},
      {index: 2, name: '历史', type: 2},
      {index: 3, name: '有声小说', type: 3},
      {index: 4, name: '脱口秀', type: 4},
      {index: 5, name: '情感治愈', type: 5}
    ],
  },

  selectTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index,
      retcode: 0
    })
    this.getData(index)
  },
 
  onLoad(options) {
    // this.getData(0)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})