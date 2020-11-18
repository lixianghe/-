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
    currentTap: 0,
    scrollLeft: 0,
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