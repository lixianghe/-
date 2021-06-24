
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
    showFocus: true,
    times: 1,
    mainColor: app.globalData.mainColor,
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    topHeight: 3000,
    focus: false,
    getSystemInfoSync: 0,
    screenHeight: 0,
    searchState:false,
    showNonet:false,
    keyWord:'',
    cursor:0
  },
  onLoad() {
    this.getMiniHeight()
    this.setData({
      times: ((wx.getSystemInfoSync().windowHeight)/ 100)
    })

  },
  onShow() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    let { keyword } = currentPage.options;
    this.selectComponent('#miniPlayer').setOnShow()
    this.setData({
      focus:!keyword,
      cursor:app.globalData.keyWord?app.globalData.keyWord.length:0
    })
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
    this.setData({focus: false})
  },
  // 函数节流防止请求过多
  search: tool.throttle(function (e) {
    app.globalData.keyWord = e[0].detail.value
    this.setData({keyWord: e[0].detail.value,searchState:true})
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
    let { info } = this.data
    if(this.data.currentTap != index){
      this.setData({
        scrollLeft: 0,
        currentTap: index,
        info:[null]
      },()=>{
        this.getData(index)
      })
    }
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
      url = `../albumInfo/albumInfo?id=${id}&title=${title}&routeType=${routeType}`
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
          item.dataUrl = item.mediaUrl
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
        console.log(wx.getSystemInfoSync().windowHeight, miniHeight, topHeight, rect)
        this.setData({
          topHeight: topHeight,
        })
      })
      .exec()
  },
  focus() {
    this.setData({showFocus: false})
  },
  blur() {
    this.setData({showFocus: true})
  },
  aa() {
    
  }
})