/**
 * @name: abumInfo
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、播放列表：canplay(注：canplay需要存在Storage里面)
 * 2、此专辑总曲目数：total
 * @param {*}
 * @return {*}
 */
const app = getApp()
import tool from '../utils/util'
import { albumMedia, isAlbumFavorite } from '../utils/httpOpt/api'
const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
    someData: 'myMixin',
    params: {
      pageNo: 1,
      pageSize: 10
    }
  },
  onShow() {
    console.log('Log from mixin!')
  },
  async onLoad(options) {
    let params = {pageNum: 1, albumId: options.id}
    let allParams = {pageNum: 1, pageSize: 999, albumId: options.id}
    const canplay = await this.getList(params)
    this.setData({canplay})
    wx.setStorageSync('canplay', canplay)
    this.getAllList(allParams)
  },
  onReady() {

  },
  // 凯叔api数据
  async getList(params) {
    // 是否被收藏
    this.isAlbumFavorite(params.albumId)
    let canplay, total
    try {
      let res = await albumMedia(params)
      canplay = res.mediaList
      total = res.totalCount
      // 处理字段不一样的情况
      canplay.map((item, index) => {
        item.title = item.mediaName
        item.id = item.mediaId
        item.dt = item.timeText
        item.coverImgUrl = item.coverUrl
        item.episode = (params.pageNum - 1) * 15 + index + 1
      })
      console.log(params.pageSize, canplay)
      this.setData({total})
      return canplay
    } catch (error) {
      return []
    }
  },
  async getAllList(allParams) {
    let allList
    // 数据请求
    const res = await albumMedia(allParams)
    
    allList = res.mediaList
    allList.map((item, index) => {
      item.title = item.mediaName
      item.id = item.mediaId
      item.dt = item.timeText
      item.coverImgUrl = item.coverUrl
      item.episode = (allParams.pageNum - 1) * 15 + index + 1
    })
    app.globalData.allList = allList
    wx.setStorage({
      key: 'allList',
      data: allList,
    })
  },
  // 专辑是否被收藏
  async isAlbumFavorite(id) {
    let params = {albumId: id}
    let res = await isAlbumFavorite(params)
    console.log('existed', res.existed)
    this.setData({existed: res.existed})
  },
  // 获取歌曲列表，假数据
  // async getPlayList(params) {
  //   let canplay = showData.abumInfo.data
  //   let total = showData.abumInfo.total
  //   canplay.forEach((item) => {
  //     item.formatDt = tool.formatduration(Number(item.dt))
  //   })
  //   this.setData({total})
  //   return canplay
  // },
}