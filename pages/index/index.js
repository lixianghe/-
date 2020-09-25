
const app = getApp()
const request = app.WxRequest;
var myPlugin = requirePlugin('inCar')
console.log(myPlugin)

Page({
  data: {
    current: null,
    aroundList: [
      {img: '../../static/水滴.png', title: 'E95#'},
      {img: '../../static/水滴2.png', title: 'E92#'},
      {img: '../../static/汽车1.png', title: '0#车柴'},
      {img: '../../static/汽车2.png', title: '92#'},
      {img: '../../static/火.png', title: '95#'}
    ]
  },
  onLoad(options) {
    wx.getSpeed({
      success: function(res) {
        console.log('获取的车辆速度', res);
      }
    })
    wx.playTTS({
      content: '已找到xxx加油站', // 播报内容；若前面未播完，
    // 则停止并以当前的新内容覆盖播报
      volume: 50, // 非必选参数，可不填
      success (res) { 
        console.log(res)
      }
    })
  },
  onShow() {

  },
  // 跳转到个人信息的页面
  toInfo() {
    wx.navigateTo({
      url: '../userInfo/userInfo'
    })
  },
  ok() {
    wx.navigateTo({
      url: '../info/info'
    })
  },
  chooseOir(e) {
    const current = e.currentTarget.dataset.index;
    this.setData({
      current: current
    })
  },
  // 判断是否要更新小程序
  _upData() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级到最新微信版本。'
      })
    }
  }
})