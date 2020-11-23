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
    mainColor: app.globalData.mainColor,
    isFixed: false,
  },
  scrollhandle(e) {
    if (e.detail.scrollLeft > 250) {
      this.setData({
        isFixed: true
      })
    } else {
      this.setData({
        isFixed: false
      })
    }
    
  },
  onLoad(options) {
    setTimeout(() => {
      wx.checkSession({
        success:(res)=> {
          if(JSON.stringify(wx.getStorageSync('username'))) {
            wx.setTabBarItem({
              index: 2, 
              text: wx.getStorageSync('username'),
            })
          }
        },
        fail: (res) => {
          app.userInfo.token = ''
          app.userInfo.vipStatus = '';
          app.userInfo.expireTime = '';
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('username')
        }
      })
      
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