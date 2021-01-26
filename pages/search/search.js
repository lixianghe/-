
import tool from '../../utils/util'
import { mediaUrlList } from '../../utils/httpOpt/api'
const app = getApp()
let searchMixin = require('../../developerHandle/search')
Page({
  mixins: [searchMixin],
  data: {
    
    screen: app.globalData.screen,
    noContent: '/images/nullContent.png',
    info: [],
    currentTap: 0,
    scrollLeft: 0,
    picWidth: '33vh',
    showMInibar: true,
    times: 1,
    mainColor: app.globalData.mainColor,
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    topHeight: 3000
  },
  onLoad() {
    this.getMiniHeight()
    this.setData({
      times: ((wx.getSystemInfoSync().windowHeight)/ 100)
    })

  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  },
  // 函数节流防止请求过多
  search: tool.throttle(function (e) {
    this.setData({keyWord: e[0].detail.value})
    this.getData(this.data.currentTap)
  }, 200),
  cancel() {
    this.setData({
      keyWord: null,
      info: []
    })
  },
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index
    })
    this.getData(index)
  },
  // 跳转到播放详情界面
  linkAbumInfo (e) {
    let id = e.currentTarget.dataset.id
    const src = e.currentTarget.dataset.src
    const title = e.currentTarget.dataset.title
    wx.setStorageSync('img', src)
    const routeType = e.currentTarget.dataset.contentype

    console.log(app.globalData.latelyListenId, routeType)
    let url
    if (routeType === 'album') {
      url = `../abumInfo/abumInfo?id=${id}&title=${title}&routeType=${routeType}`
      wx.navigateTo({
        url: url
      })
    } else if (routeType === 'media') {

      let opt = {
        mediaId: id,
        contentType: 'story'
      }
      mediaUrlList(opt).then(res2 => {
        let canplay = res2.mediaPlayVoList
        canplay.map((item, index) => {
          item.title = item.mediaName
          item.id = item.mediaId
          item.dt = item.timeText
          item.coverImgUrl = item.coverUrl
          item.src = item.mediaUrl
        })
        
        wx.setStorageSync('canplay',canplay)
        url = `../playInfo/playInfo?id=${id}`
        wx.navigateTo({
          url: url
        })
      })

    } 
    
  },
  getData(index) {
    this.getSearch(this.data.labels[index].value)
  },
  getSearch(type) {
    let params = {
      label: type,
      keyWord: this.data.keyWord
    }
    this._getList(params)
    
  },
  // 获取minibar的高度
  getMiniHeight() {
    let query = wx.createSelectorQuery()
    query
      .select('.miniView')
      .boundingClientRect((rect) => {
        let miniHeight = rect.height
        let topHeight = wx.getSystemInfoSync().windowHeight - miniHeight
        console.log(wx.getSystemInfoSync().screenHeight, miniHeight, topHeight, rect)
        this.setData({
          topHeight: topHeight,
        })
      })
      .exec()
  },
  focus() {
    this.setData({showMInibar: false})
  },
  blur() {
    this.setData({showMInibar: true})
  },
  aa() {
    
  }
})