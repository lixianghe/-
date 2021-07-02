/**
 * @name: latelyListen
 * 开发者编写的最近收听latelyListen,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels: [
 *   {value: 'album', label: '专辑'},
 *   {value: 'media', label: '故事'}
 * ]
 * 2、_getList函数，这里我们给开发者提供labels对应点击的的值，其余参数开发者自行添加；
 *    _getList函数获取的list最终转换为模板需要的字段，并setData给info。
 * 3、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下以本页列表数据为例
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.src = item.coverUrl                                  // 歌曲的封面
      item.contentType = 'album'                                // 类别（例如专辑或歌曲）
      item.isVip = true                                         // 是否是会员
    })
 */
import tool from '../utils/util'
const app = getApp()
const { showData } = require('../utils/httpOpt/localData')
import { history, mediaUrlList, albumMedia, } from '../utils/httpOpt/api'
import { getMedia,isFavorite } from '../developerHandle/playInfo'
module.exports = {
  data: {
    showModal:false,
    req: false,
    // 开发者注入模板标签数据
    labels: [
      {name: '专辑', value: 'album'},
      {name: '故事', value: 'media'}
    ],
    // 开发者注入模板页面数据
    info: [],
    scrollLeft: 0
  },
  onShow() {
    if(!app.userInfo.token){
      wx.switchTab({
        url: '/pages/personalCenter/personalCenter'
      })
    }
    let {info,labels,currentTap} = this.data
    if(info.length){
      this._getList(labels[currentTap].value)
    }
  },
  onLoad(options) {
    this._getList(this.data.labels[0].value,options)
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
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index,
      retcode: 0,
      scrollLeft: 0
    })
    wx.showLoading({
      title: '加载中',
    })
    this._getList(this.data.labels[index].value)
  },
  _getList(type,options=null) {
    let params = {
      pageNum: 1,
      pageSize: 20,
      contentType: type
    }
    history(params).then(res => {
      let layoutData = []
      if(type === 'album') {
        console.log('history1---------------------',res)
        res.list.forEach(item => {
          layoutData.push({
            id: item.album.albumId,
            title: item.album.albumName,
            src: item.album.coverUrl, 
            contentType: 'album',
            // isVip: true
            isVip: item.album.feeType == '01' && (item.album.product || item.album.product && [2, 3].indexOf(item.album.product.vipLabelType) < 0)
          })
      })
      } else if (type === 'media') {
        res.list.forEach(item => {
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
      
      if(layoutData.length === 0) {
        this.setData({
          showModal: true
        })
      }
      if(options && options.playing && layoutData.length) this.pathPlay(layoutData[0])
      this.setData({
        info: layoutData.map(item=>{
          item.src = item.src?app.impressImg(item.src,300,300):''
          return item
        }) || [],
        req: true
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(JSON.stringify(err))
    })
  },
  close() {
    this.setData({showModal: false})
  },
  // 语音直达功能
  async pathPlay(item){
    let [canplay, idList, auditionDurationList, total] = [[], [], [], 0]
    try {
      let res = await albumMedia({pageNum: 1, albumId: item.id})
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
        item.auditionDuration = auditionDurationList[index]
        item.dataUrl = item.mediaUrl
        return item
      })
      wx.setStorageSync('canplay',canplay)
      wx.setStorageSync('canplaying', canplay)
      wx.setStorageSync('abumInfoName', item.title)
      wx.setStorageSync('abumInfoId', item.id)
      wx.setStorageSync('total', total)
      wx.setStorageSync('currentPageNo', 1)
      let noOrderList = tool.randomList(JSON.parse(JSON.stringify(canplay)))
      wx.setStorageSync('noOrderList', noOrderList)
      app.globalData.songInfo = canplay[0]
      let that = this
      if (getMedia) await getMedia({
        mediaId: app.globalData.songInfo.id,
        contentType: 'story'
      }, that)
      if (!app.globalData.songInfo.dataUrl) {
        wx.hideLoading()
        tool.resetAudioManager(app)
        wx.showToast({
          title: '该内容为会员付费内容，请先成为会员再购买收听~',
          icon: 'none',
          duration:2000,
        })
        wx.stopBackgroundAudio()
        return
      }
      // 判断是否收藏
      if (app.userInfo && app.userInfo.token) {
        isFavorite({mediaId: app.globalData.songInfo.id}, that)
      }else{
        that.setData({
          existed:false
        })
      }
      app.playing(null, that)
    } catch (error) {
      wx.setStorageSync('canplay',[])
    }
}
}