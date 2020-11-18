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
    this.login()
  },
  login(event) {
    wx.login({
      success (res) {
        console.log('res', res)
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://test.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // wx.login({
    //   success: (loginRes) => {
    //     console.log('扫码成功', 63)
    //     console.log(loginRes, 64)
    //     // auth({code: loginRes.code}).then(res => {
    //     //   console.log('登录成功', 65)
    //     //   console.log(res, 76);
    //     //   if (res.code === 0) { 
    //     //     console.log('请求成功', 65)
    //     //     app.authInfo = res.data;
    //     //     this.setData({
    //     //       showWxLogin: false
    //     //     })
    //     //     console.log(app.authInfo, 82);
    //     //     if (!event && app.authInfo.mobileFlag && this.data.isLogin) {
    //     //       this.loginWx()
    //     //     }
    //     //     wx.setStorageSync('authInfo', app.authInfo)
    //     //   } else {
    //     //     wx.showToast({
    //     //       icon: 'none',
    //     //       title: res.message || '网络异常'
    //     //     })
    //     //   }
    //     //   this.authRequest = false
    //     // }).catch(err => {
    //     //   console.log(err, 95)
    //     // })
    //   },
    //   fail: (err) => {
    //     console.log('扫码失败', JSON.stringify(err))
    //     this.authRequest = false
    //   },
    //   complete: (res) => {
    //     console.log('扫码complete', JSON.stringify(res))
    //   }
    // })
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})