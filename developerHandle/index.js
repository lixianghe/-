/**
 * @name: index
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、播放列表：canplay(注：canplay需要存在Storage里面)
 * 2、此专辑总曲目数：total
 * @param {*}
 * @return {*}
 */
const app = getApp()
import { layout, layoutGroup } from '../utils/httpOpt/api'
module.exports = {
  data: {
    info: [],
  },
  // 页面后台数据(不参与渲染)
  pageData: {
    pageName: 'index',
    pageType: 'tab',
    pageLoaded: false,
    // 各频道列表页码，根据groupId获取
    pageNum: 1,
    hasNext: true,
    loading: false,
    retcode: 1,
    labels: [],
  },
  onShow() {
    console.log('Log from mixin!')
  },
  onLoad(options) {
    // 接入凯叔频道数据
    layoutGroup().then(res => {
      const formatData = res.map((item, idx) => {
        let obj = {
          index: idx,
          id: item.groupId,
          name: item.groupTitle,
          type: item.groupType,
          groupTitleConfig: item.groupTitleConfig
        }
        return obj
      })
      this.setData({
        labels: formatData
      })
      this.getListData(formatData[0].id)
    }).catch(err => {
      console.log(JSON.stringify(err))
    })
  },
  onReady() {

  },
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.groupid
    this.setData({
      currentTap: index,
      retcode: 0
    })
    this.getListData(id)
  },
  // 跳转到最近收听页面
  tolatelyListen (e) {
    let page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: `../${page}/${page}`
    })
  },
  // 跳转到播放详情界面
  linkAbumInfo (e) {
    let id = e.currentTarget.dataset.id
    const src = e.currentTarget.dataset.src
    const title = e.currentTarget.dataset.title
    wx.setStorageSync('img', src)
    const routeType = e.currentTarget.dataset.contentype
    // 静态实现最近收听
    if (!app.globalData.latelyListenId.includes(id)) {
      app.globalData.latelyListenId.push(id)
    }
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
  getListData(id) {
    console.log(id)
    // 接入凯叔列表数据
    let params = {groupId: id, pageNum: this.pageData.pageNum}
    layout(params).then(res => {
      console.log(res)
      let layoutData = []
      res.list.forEach(v => {
        v.content.forEach(item => {
          layoutData.push({
            id: item.album ? item.album.albumId : item.media.mediaId,
            title: item.album ? item.album.albumName : item.media.mediaName,
            src: item.coverUrl,
            contentType: item.contentType,
            count: item.album ? item.album.mediaCount : '',
            isVip: item[item.contentType].feeType == '01' && (item[item.contentType].product || item[item.contentType].product && [2, 3].indexOf(item[item.contentType].product.vipLabelType) < 0)
          })
        })

      })
      this.setData({
        info: layoutData,
        retcode: 1
      })
    }).catch(err => {
      console.log(JSON.stringify(err))
    })
  },
  // 懒加载
  getLayoutData() {

  },
}