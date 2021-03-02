const app = getApp()
import { vipList } from '../../utils/httpOpt/api'

Page({
  data: {
    vipList: [],
    showInfo: false,
    info: null,
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    showNonet: false,
    prdId: null
  },
  onReady() {},
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  },
  async onLoad(options) {
    // 检测网络
    let that = this
    // app.getNetWork(that)
    this.getList()
  },
  getList() {
    vipList().then(res => {
      let list = res.vipPackage
      this.setData({vipList: list})
    })
  },
  showInfo(e) {
    let info = e.currentTarget.dataset.info
    this.setData({
      showInfo: true,
      info: info,
      prdId: e.currentTarget.dataset.id
    })
  },
  close() {
    this.setData({
      showInfo: false,
      info: null
    })
  },
  toPay(e) {
    let { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/member/pay?id=' + id
    })
  }
})
