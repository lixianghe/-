import { search } from '../../utils/httpOpt/api'
import tool from '../../utils/util'
const app = getApp()
Page({
  data: {
    screen: app.globalData.screen,
    noContent: '/images/nullContent.png',
    info: [],
    currentTap: 0,
    scrollLeft: 0,
    labels: [
      {index: 0, name: '专辑'},
      {index: 1, name: '故事'},
    ],
    picWidth: '33vh',
    showMInibar: true,
    times: 1
  },
  onLoad() {
    this.setData({
      times: ((wx.getSystemInfoSync().screenHeight)/ 100)
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
      url = `../abumInfo/abumInfo?id=${id}&title=${title}`
    } else if (routeType === 'media') {
      url = `../playInfo/playInfo?id=${id}`
    } 
    wx.navigateTo({
      url: url
    })
  },
  getData(index) {
    console.log(index)
    if (index == 0){
      this.getSearch('album')
    } else if (index == 1){
      this.getSearch('media')
    }
  },
  getSearch(type) {
    let params = {
      pageNum: 1,
      pageSize: 20,
      contentType: type,
      keyWord: this.data.keyWord
    }
    search(params).then(res => {
      let layoutData = []
      console.log(res)
      res.list.forEach(item => {
        if (type === 'album') {
          layoutData.push({
            id: item.album.albumId,
            title: item.album.albumName,
            src: item.album.coverUrl, 
            contentType: item.contentType
          })
        } else {
          layoutData.push({
            id: item.media.mediaId,
            title: item.media.mediaName,
            src: item.media.coverUrl, 
            contentType: item.contentType
          })
        }
        
      })
      console.log('layoutData', layoutData)
      this.setData({
        info: layoutData
      })
    }).catch(err => {
      console.log(JSON.stringify(err)+'73行')
    })
  },
  focus() {
    this.setData({showMInibar: false})
  },
  blur() {
    this.setData({showMInibar: true})
  }
})