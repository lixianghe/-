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
    mainColor: app.globalData.mainColor
  },
 
  onLoad(options) {
    console.log(JSON.stringify(wx.getStorageSync('username'))+'判断用户是否已经登录了19行')
    setTimeout(() => {
      console.log('判断用户是否已经登录了21行')
      if(JSON.stringify(wx.getStorageSync('username'))) {
        console.log('判断用户是否已经登录了23行')
        wx.setTabBarItem({
          index: 2, 
          text: wx.getStorageSync('username'),
        })
      }
    }, 800);
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})