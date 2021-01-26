const app = getApp()

Component({
  data: {
    noDataImg: '../../images/img_wangluoyichang.png',
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen
  },
  methods: {
    refresh() {
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      wx.getNetworkType({
        async success(res) {
          const networkType = res.networkType
          console.log('networkType', networkType, currentPage)
          if (networkType === 'none') {
            wx.showToast({
              title: '网络异常，请检查网络',
              icon: 'none'
            })
          } else {
            currentPage.onLoad(currentPage.options)
            currentPage.setData({showNonet: false})
          }
        },
      })
    },
    
  },
  attached(options) {

  }
})