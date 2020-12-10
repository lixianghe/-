const app = getApp()

Page({
  mixins: [require('../../developerHandle/index')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    mainColor: app.globalData.mainColor,
    screen: app.globalData.screen,
    confirm: '',
    currentTap: 0,
    scrollLeft: 0,
    isFixed: false,
    wid: 1
  },
  onLoad(options) {
    let that = this
    app.getNetWork(that)
    this.setData({
      wid: wx.getSystemInfoSync().screenWidth - ((wx.getSystemInfoSync().windowHeight)/ 100) * 55
    })

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
  scrollRight () {
    wx.showToast({
      title: '已经到底啦！',
      icon: 'none'
    })
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})