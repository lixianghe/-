// import { getData } from '../../utils/httpOpt/httpOpt'
const app = getApp()

Page({
  mixins: [require('../../developerHandle/index')],
  data: {
    screen: app.globalData.screen,
    lalyLtn: [
      {icon: '/images/zjst.png', title: "最近收听",name: 'latelyListen'},
      {icon: '/images/icon_collect.png', title: "我喜欢的", name:'like'}
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