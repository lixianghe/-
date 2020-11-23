/**
 * @name: latelyListen
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、播放列表：canplay(注：canplay需要存在Storage里面)
 * 2、此专辑总曲目数：total
 * @param {*}
 * @return {*}
 */
const app = getApp()
const { showData } = require('../utils/httpOpt/localData')
import { history } from '../utils/httpOpt/api'

module.exports = {
  data: {
    info: [],
    showModal:false
  },
  onShow() {
    console.log('Log from mixin!')
  },
  onLoad(options) {
    this.getData('album')
  },
  onReady() {

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
  getData(type) {
    let params = {
      pageNum: 1,
      pageSize: 20,
      contentType: type
    }
    console.log(`${JSON.stringify(params)}运行至53行`)
    history(params).then(res => {
      let layoutData = []
      console.log(`${JSON.stringify(res)}56行`)
      if(type === 'album') {
        res.list.forEach(item => {
          console.log(`${item}58行`)
          layoutData.push({
            id: item.album.albumId,
            title: item.album.albumName,
            src: item.album.coverUrl, 
            contentType: 'album',
            // isVip: true
            isVip: item.feeType == '01' && (item.product || item.product && [2, 3].indexOf(item.product.vipLabelType) < 0)
          })
      })
      } else if (type === 'media') {
        res.list.forEach(item => {
          console.log(`${JSON.stringify(item)}58行`)
          layoutData.push({
            id: item.media.mediaId,
            title: item.media.mediaName,
            src: item.media.coverUrl, 
            contentType: 'media',
            // isVip: true
            isVip: item.feeType == '01' && (item.product || item.product && [2, 3].indexOf(item.product.vipLabelType) < 0)
          })
        })
      }
      
      console.log(`${JSON.stringify(layoutData)}67行`)
      this.setData({
        info: layoutData,
        // info: [{id: 'qd223',title: '哈哈',src: "https://cdn.kaishuhezi.com/kstory/ablum/image/389e9f12-0c12-4df3-a06e-62a83fd923ab_info_w=450&h=450.jpg",contentType: 'album',isVip:true}],
        retcode: 1
      })
      if(layoutData.length === 0) {
        this.setData({
          showModal: true
        })
      }
    }).catch(err => {
      console.log(JSON.stringify(err)+'73行')
    })
  },
  close() {
    this.setData({showModal: false})
  },
  // 懒加载
  getLayoutData() {

  },
}