/**
 * @name: index
 * 开发者编写的首页index,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels <Array[Object]>：
 *    -index：标签索引
 *    -name: 标签名称
 * info <Array[Object]>：
 *    -id: 内容id
 *    -title: 内容名称,
 *    -src: 内容图片, 
 * 可选部分-快捷入口（最多两个）：
 * lalyLtn <Array[Object]>：
 *    -icon: 快捷入口图标
 *    -title: 快捷入口图标标题,
 *    -name: 快捷入口文件名称（page下的文件夹和文件名称保持一致）, 
 */
const app = getApp()
import { layout, layoutGroup } from '../utils/httpOpt/api'
module.exports = {
  data: {
    // 开发者注入快捷入口数据
    lalyLtn: [
      {icon: '/images/zjst.png', title: "最近收听", name: 'latelyListen'},
      {icon: '/images/icon_collect.png', title: "我喜欢的", name:'like'}
    ],
    // 开发者注入模板页面数据
    info: [],
    // 开发者注入模板标签数据
    labels: [],

    countPic: '/images/media_num.png',
    reqS: false,
    reqL: false,
  },
  // 页面后台数据(不参与渲染)
  pageData: {
    pageName: 'index',
    pageType: 'tab',
    pageLoaded: false,
    // 各频道列表页码，根据groupId获取
    pageNum: 1,
    hasNext: true,
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
        labels: formatData,
        reqS: true
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
    wx.showLoading({
      title: '加载中',
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
    console.log('routeType', routeType)
    if (routeType === 'album' || routeType === 'fm') {
      url = `../abumInfo/abumInfo?id=${id}&title=${title}&routeType=${routeType}`
    } else if (routeType === 'media') {
      url = `../playInfo/playInfo?id=${id}`
    }
    
    wx.navigateTo({
      url: url
    })
  },
  getListData(id) {
    // 接入凯叔列表数据
    let params = {groupId: id, pageNum: this.pageData.pageNum}
    layout(params).then(res => {
      let layoutData = [{
        id: '00',
        title: '电台',
        src: '/images/fm.jpg',
        contentType: 'fm',
        count: '',
        isVip: false
      }]
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
        reqL: true
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(JSON.stringify(err))
    })
  },
  // 懒加载
  getLayoutData() {

  },
}