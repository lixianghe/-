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
import { albumMedia } from '../utils/httpOpt/api'
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
    console.log('options.id', options.id)
    // const canplay = await this.getPlayList({ ...this.data.params, id: options.id })
    let params = {pageNum: 1, albumId: 961}
    const canplay = await this.getList(params)
    this.setData({canplay})
    wx.setStorageSync('canplay', canplay)
    this.getList()
  },
  onReady() {

  },
  // 获取歌曲列表
  async getPlayList(params) {
    let canplay = showData.abumInfo.data
    let total = showData.abumInfo.total
    canplay.forEach((item) => {
      item.formatDt = tool.formatduration(Number(item.dt))
    })
    this.setData({total})
    return canplay
  },
  async getList(params) {
    let canplay, total
    try {
      let res = await albumMedia(params)
      canplay = res.mediaList
      total = res.totalCount
      canplay.map((item, index) => {
        item.title = item.mediaName
        item.id = item.mediaId
        item.dt = item.timeText
        item.coverImgUrl = item.coverUrl
        item.episode = index * params.pageNum + 1
      })
      console.log(res, canplay)
      this.setData({total})
      return canplay
    } catch (error) {
      return []
    }
  },
  async getAllList() {
    let allList
    const params = { id: this.data.optionId, pageNo: 1, pageSize: 999 }
    // 数据请求
    const res = await getData('abumInfo', params)
    allList = res.data
    app.globalData.allList = allList
    wx.setStorage({
      key: 'allList',
      data: allList,
    })
  }
}