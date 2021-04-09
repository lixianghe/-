/**
 * @name: abumInfo
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、在data里定义接口入参的key，因为内部逻辑(如懒加载)会调用这里的函数并传参
 * pageNoName: 'pageNum'        // 分页数
 * pageSizeName: 'pageSize'     // 每页数目
 * idName: 'albumId'            // 这个页面请求的id
 * 2、播放列表：canplay(注：canplay需要存在Storage里面)
 * 3、当前专辑所有列表allList，只需存在Storage缓存里面，主要用于切歌使用
 * 4、此专辑总曲目数：total
 * 5、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.dt = item.timeText                                   // 歌曲的时常
      item.coverImgUrl = item.coverUrl                          // 歌曲的封面
      item.episode = (params.pageNum - 1) * 15 + index + 1      // 歌曲的集数（这个按这种方式赋值即可）
    })
 */
import { albumMedia, isAlbumFavorite, fm, albumFavoriteAdd, albumFavoriteCancel, mediaUrlList } from '../utils/httpOpt/api'

const app = getApp()
module.exports = {
  data: {
    pageNoName: 'pageNum',
    pageSizeName: 'pageSize',
    idName: 'albumId',
    abexisted: false,                     // 是否被收藏
    playAllPic: '/images/playAll.png'
  },
  onShow() {

  },
  async onLoad(options) {
    let routeType = options.routeType   // 如果专辑详情有不同接口，如电台的详情，通过它判断请求不同的接口
    let params = {pageNum: 1, albumId: options.id}
    await this._getList(params, routeType)
  },
  onReady() {

  },
  // 凯叔专辑详情列表，album为专辑，fm为电台
  async _getList(params, routeType = 'album') {
    // 是否被收藏
    if (routeType === 'album') {
      await this.getData(params)
    } else if (routeType === 'fm') {
      this.getFm()
    }
    if (app.userInfo && app.userInfo.token) {
      this.isAlbumFavorite(params.albumId)
    }
    
  },
  
  // 获取专辑列表，因为懒加载的原因这里不直接setData，而是retur canplay和total,在getList里面进行赋值操作
  async getData(params) {
    let [canplay, idList, auditionDurationList, total] = [[], [], [], 0]
    try {
      let res = await albumMedia(params)
      total = res.totalCount
      // 处理字段不一样的情况
      res.mediaList.map((item, index) => {
        idList.push(item.mediaId)
        auditionDurationList.push(item.auditionDuration)
      })
      // 获取带url的list
      let opt = {
        mediaId: idList.toString(),
        contentType: 'story'
      }
      let res2 = await mediaUrlList(opt)
      canplay = res2.mediaPlayVoList
      canplay.map((item, index) => {
        item.title = item.mediaName
        item.id = item.mediaId
        item.dt = item.timeText
        item.coverImgUrl = item.coverUrl
        item.src = item.mediaUrl
        item.auditionDuration = auditionDurationList[index]
        item.dataUrl = item.mediaUrl
      })
      // 上拉和下拉的情况
      if (params.lazy == 'up'){
        canplay = this.data.canplay.concat(canplay)
      } else if (params.lazy == 'down') {
        canplay = canplay.concat(this.data.canplay)
      }
      wx.setStorageSync('canplay',canplay)
      this.setData({total, canplay})
    } catch (error) {
      wx.setStorageSync('canplay',[])
      this.setData({total: 0, canplay: []})
    }
  },

  // 获取电台列表
  async getFm() {
    let fmList = wx.getStorageSync('fmList')
    this.setData({canplay: fmList})
    // let noOrderfmList = wx.getStorageSync('noOrderfmList')
    // wx.setStorageSync('noOrderList', noOrderfmList)
    wx.setStorageSync('canplay', fmList)
    
  },

  // 打乱数组，返回
  randomList(arr) {
    let len = arr.length;
    while (len) {
        let i = Math.floor(Math.random() * len--);
        [arr[i], arr[len]] = [arr[len], arr[i]];
    }
    return arr;
  },
  // 专辑是否被收藏
  async isAlbumFavorite(id) {
    let params = {albumId: id}
    let res = await isAlbumFavorite(params)
    this.setData({abexisted: res.existed})
  },
  // 收藏专辑
  likeAbum() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    let params = {albumId: this.data.optionId}
    if (this.data.abexisted) {
      albumFavoriteCancel(params).then(res => {
        wx.showToast({ icon: 'none', title: '专辑取消收藏成功' })
        this.setData({
          abexisted: false
        })
      })
    } else {
      albumFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '专辑收藏成功' })
        this.setData({
          abexisted: true
        })
      })
    }
  }
}