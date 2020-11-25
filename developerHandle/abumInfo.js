/**
 * @name: abumInfo
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、播放列表：canplay(注：canplay需要存在Storage里面)
 * 2、当前专辑所有列表allList，只需存在Storage缓存里面，主要用于切歌使用
 * 3、此专辑总曲目数：total
 * 4、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.dt = item.timeText                                   // 歌曲的时常
      item.coverImgUrl = item.coverUrl                          // 歌曲的封面
      item.episode = (params.pageNum - 1) * 15 + index + 1      // 歌曲的集数（这个按这种方式赋值即可）
    })
 */
import { albumMedia, isAlbumFavorite, fm } from '../utils/httpOpt/api'
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

  },
  async onLoad(options) {
    let routeType = options.routeType   // 专辑的类型：电台or专辑

    let params = {pageNum: 1, albumId: options.id}
    let allParams = {pageNum: 1, pageSize: 999, albumId: options.id}

    const canplay = await this.getList(params, routeType)
    // 如果是fm就不请求alllist,直接把canplay赋值给alllist
    if (routeType === 'album') {
      this.getAllList(allParams)
    } else {
      wx.setStorageSync('allList',canplay)
    }        
    this.setData({canplay})
    wx.setStorageSync('canplay', canplay)
  },
  onReady() {

  },
  // 凯叔api数据
  async getList(params, routeType = 'album') {
    // 是否被收藏
    this.isAlbumFavorite(params.albumId)
    let canplay, total
    try {
      let res = routeType === 'album' ? await albumMedia(params) : await fm()
      canplay = routeType === 'album' ? res.mediaList : res.list
      total = res.totalCount
      // 处理字段不一样的情况
      canplay.map((item, index) => {
        item.title = item.mediaName
        item.id = item.mediaId
        item.dt = item.timeText
        item.coverImgUrl = item.coverUrl
        item.episode = (params.pageNum - 1) * 15 + index + 1
      })
      this.setData({total})
      return canplay
    } catch (error) {
      return []
    }
  },
  async getAllList(allParams) {
    let allList
    // 数据请求
    let res = await albumMedia(allParams)
    
    allList = res.mediaList
    allList.map((item, index) => {
      item.title = item.mediaName
      item.id = item.mediaId
      item.dt = item.timeText
      item.coverImgUrl = item.coverUrl
      item.episode = (allParams.pageNum - 1) * 15 + index + 1
    })
    wx.setStorage({
      key: 'allList',
      data: allList,
    })
  },
  // 专辑是否被收藏
  async isAlbumFavorite(id) {
    let params = {albumId: id}
    let res = await isAlbumFavorite(params)
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