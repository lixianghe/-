
const app = getApp()
import tool from '../../utils/util'
import { albumMedia, mediaUrlList ,isFavorite, saveHistory} from '../../utils/httpOpt/api'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
var timer, timer4, timer5;
let showIndex = 0
// 记录上拉拉刷新了多少次
let scrollTopNo = 0

Page({
  mixins: [require('../../developerHandle/playInfo')],
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    currentId: null,
    // 开发者不传默认的按钮
    defaultBtns: [
      {
        name: 'toggle',                                          // 播放/暂停
        img: {
          stopUrl: '/images/stop2.png' ,                         // 播放状态的图标
          playUrl: '/images/play2.png'                           // 暂停状态的图标
        }
      },
    ],
    btnCurrent: null,
    noTransform: '',
    typelist: ['loop', 'singleLoop', 'shufflePlayback'],
    typeName: {
      "loop": '循环播放',
      "singleLoop": '单曲循环',
      "shufflePlayback": '随机播放',
    },
    loopType: 'loop',   // 默认列表循环
    likeType: 'noLike',
    total: 0,
    scrolltop: 0,
    isDrag: '',
    barWidth: 0,
    currentTime: 0,
    mainColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar,
    showImg: false,
    bigScreen: app.globalData.PIbigScreen,
    abumInfoName: null,
    existed: false,
    mainColor: btnConfig.colorOptions.mainColor,
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    noBack: false,
    infoList: [],
    scrollState:true
  },
  // 播放器实例
  audioManager: null,
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
  },
  async onLoad(options) {
    let that = this
    // that.audioManager = wx.getBackgroundAudioManager()
    tool.EventListener(app, that, false)

    this.setData({backgroundColor: '#303240'})
    clearInterval(timer4)
    scrollTopNo = 0
    showIndex = 0
    const curId = wx.getStorageSync('canplaying').filter(n => n.dataUrl === app.globalData.songInfo.dataUrl).length && wx.getStorageSync('canplaying').filter(n => n.dataUrl === app.globalData.songInfo.dataUrl)[0].id
    // 根据分辨率设置样式
    this.setStyle()
    this.setData({
      // songInfo: songInfo,
      id: options.id,
      noPlay: options.noPlay || null,
      abumInfoName: options.abumInfoName || null,
      loopType: wx.getStorageSync('loopType') || 'loop',
      currentId: curId,
      playing:wx.getStorageSync('playing') || false
    })
    wx.setStorageSync('abumInfoName', options.abumInfoName)
    // 如果没有abumInfoName就把more按钮删掉
    if (!options.abumInfoName) {
      let index = this.data.playInfoBtns.findIndex(n => n.name === 'more')
      this.data.playInfoBtns.splice(index, 1)
      let index2 = this.data.playInfoBtns.findIndex(n => n.name === 'loopType')
      this.data.playInfoBtns.splice(index2, 1)
      this.setData({playInfoBtns: this.data.playInfoBtns})
    }
  },
  onShow: function (options) {
    showIndex++
    // console.log('options------' + this.data.id + '-----')
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    // clearInterval(timer)
    // tool.playAlrc(that, app);
    // timer = setInterval(() => {
    //   tool.playAlrc(that, app);
    // }, 1000);
    tool.NewPlayAlrc(that, app);
    this.queryProcessBarWidth()
    // 从面板回来赋值
    if (showIndex > 1) tool.panelSetInfo(app, that)
  },
  onUnload: function () {

  },
  onHide: function () {

  },
  imgOnLoad() {
    this.setData({ showImg: true })
  },
  play(isSameSong) {
    // console.log('play')
    let that = this
    // 从统一播放界面切回来，根据playing判断播放状态options.noPlay为true代表从minibar过来的
    if ((this.data.noPlay !== 'true' && !isSameSong)){
      console.log('重新调用播放')
      app.playing(null, that)
    }
  },
  btnsPlay(e) {
    const type = e.currentTarget.dataset.name
    if (type) this[type]()
  },
  // 上一首
  pre(panelCut) {
    const that = this
    app.cutplay(that, -1, false, panelCut)
  },
  // 下一首
  next(panelCut) {
    const that = this
    console.log('playinfo', that)
    app.cutplay(that, 1, false, panelCut)
  },
  // 切换播放模式
  loopType() {
    let nwIndex = this.data.typelist.findIndex(n => n === this.data.loopType)
    let index = nwIndex < 2 ? nwIndex + 1 : 0
    app.globalData.loopType = this.data.typelist[index]
    // 根据播放模式切换currentList
    this.checkLoop(this.data.typelist[index])
    this.setData({
      loopType: this.data.typelist[index]
    })
  },
  // 判断循环模式
  checkLoop(type) {
    wx.setStorageSync('loopType', type)
    wx.showToast({ title: this.data.typeName[type], icon: 'none' })
  },
  // 暂停/播放
  toggle() {
    const that = this
    tool.toggleplay(that, app)
  },
  // 播放列表
  async more() {
    console.log('more')
    scrollTopNo = 0
    let fmList = wx.getStorageSync('fmList') || []
    let total = wx.getStorageSync('total')
    
    // 显示的过度动画
    this.animation.translate(0, 0).step()
    this.setData({
      showList: true,
      total: Number(total) ? total : fmList.length,
      currentId: this.data.currentId || this.data.songInfo.id,
      animation: this.animation.export(),
      // pageNo: Number(wx.getStorageSync('currentPageNo'))
    })
    let abumInfoId = wx.getStorageSync('abumInfoId')
    if (Number(total)) {
      // 普通专辑
      this.setData({pageNo: Number(wx.getStorageSync('currentPageNo'))})
      await this.getList({ pageNum: this.data.pageNo, albumId: abumInfoId })
    } else {
      // 电台
      this.setData({pageNo: 1})
      this.setData({infoList: fmList})
    }
    
    // setTimeout(() => {
    //   this.setData({
    //     noTransform: 'noTransform'
    //   })
    // }, 300)
    this.setScrollTop()
    return
    
    
  },
  isFm() {
    this.setData({
      
    })
  },
  closeList() {
    console.log('close')
    // this.setData({
    //   noTransform: ''
    // })
    // 显示的过度动画
    // setTimeout(() => {
      this.animation.translate('-180vh', 0).step()
      this.setData({
        showList: false,
        animation: this.animation.export()
      })
    // }, 300)
  },
  // 在播放列表里面点击播放歌曲
  async playSong(e) {
    let that = this
    let songInfo = e.currentTarget.dataset.song
    // 获取歌曲详情
    let params = {mediaId: songInfo.id, contentType: 'story'}
    await this.getMedia2(params)
    this.setData({
      songInfo: songInfo,
      currentId: songInfo.id,
      playing: true
      // noTransform: ''
    })
    // 如果没有src playinfo给出弹框，其他页面给出toast提示
    if (!app.globalData.songInfo.dataUrl) {
      this.setData({showModal: true, noBack: true})
      wx.hideLoading()
      wx.stopBackgroundAudio()
    }
    wx.setStorageSync('songInfo',songInfo)
    app.playing(null, that)
    let index = this.data.infoList.findIndex(n => n.id == songInfo.id)
    let currentPageNo = this.data.pageNo + parseInt(index / 15)
    wx.setStorageSync('currentPageNo', currentPageNo)
  },

  // 通过mediaId获取歌曲url及详情，并增加播放历史
  async getMedia2(params, that = this) {   
    // 获取歌曲                   
    let songInfo = {}
    let canplaying = this.data.infoList || []
    songInfo = canplaying.filter(n => Number(n.mediaId) === Number(params.mediaId))[0]
    // console.log('songInfo', canplaying, params.mediaId)
    app.globalData.songInfo = Object.assign({}, app.globalData.songInfo, songInfo)
    that.setData({
      songInfo: app.globalData.songInfo
    })
    wx.setStorageSync('songInfo', app.globalData.songInfo)
    // 是否被收藏
    if (app.userInfo && app.userInfo.token) {
      try {
        let res = await isFavorite(params)
        that.setData({existed: res.existed})
      } catch (error) {
      }
    }
    // 添加历史记录
    let abumInfoName = wx.getStorageSync('abumInfoName')
    let abumInfoId = wx.getStorageSync('abumInfoId')
    let saveHistoryParams = {
      ablumId: abumInfoName ? abumInfoId : app.globalData.songInfo.id,
      storyId: app.globalData.songInfo.id,
      duration: 1,
      playTime: 0
    }
    if (!app.userInfo || !app.userInfo.token) return
    let opt = { historys: [saveHistoryParams] }
    saveHistory(opt).then(res => {}).catch(error => {})
  },



  // 开始拖拽
  dragStartHandle(event) {
    console.log('isDrag', this.data.isDrag)
    this.setData({
      isDrag: 'is-drag',
      _offsetLeft: event.changedTouches[0].pageX,
      _posLeft: event.currentTarget.offsetLeft
    })
  },
  // 拖拽中
  touchmove(event) {
    let offsetLeft = event.changedTouches[0].pageX
    let process = (offsetLeft - this.data._offsetLeft + this.data._posLeft) / this.data.barWidth
    if (process < 0) {
        process = 0
    } else if (process > 1) {
        process = 1
    }
    let percent = (process * 100).toFixed(3)
    let currentTime = process * tool.formatToSend(app.globalData.songInfo.dt)
    let playtime = currentTime ? tool.formatduration(currentTime * 1000) : '00:00'
    this.setData({
      percent,
      currentTime,
      playtime
    })
  },
  // 拖拽结束
  dragEndHandle(event) {
    // app.playing()
    wx.seekBackgroundAudio({
      position: this.data.currentTime
    })
    setTimeout(() => {
      this.setData({isDrag: ''})
    }, 500)
  },
  // 查询processBar宽度
  queryProcessBarWidth() {
    var query = this.createSelectorQuery();
    query.selectAll('.process-bar').boundingClientRect();
    query.exec(res => {
      try {
        this.setData({
          barWidth: res[0][0].width
        })
      } catch (err) {
      }
    })
  },
  // ******按钮点击态处理********/
  btnstart(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      btnCurrent: index

    })
  },
  btend() {
    setTimeout(()=> {
      this.setData({
        btnCurrent: null
      })
    }, 150)
  },
   // ******按钮点击态处理********/


   // 列表上拉和下拉加载

   
  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.setData({
        bigScreen: false,
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 9.8vh 20vh',
        btnsWidth: '140vh',
        imageWidth: windowWidth * 0.17 + 'px'
      })
    } else {
      // 1920*720
      this.setData({
        bigScreen: true,
        leftWith: '184vh',
        leftPadding: '0vh 12.25vh 20vh',
        btnsWidth: '165vh',
        imageWidth: '49vh'
      })
    }
  },
  // 处理scrollTop的高度
  setScrollTop() {
    let index = this.data.infoList.findIndex(n => Number(n.id) === Number(this.data.songInfo.id))
    let query = wx.createSelectorQuery();
    query.select('.songList').boundingClientRect(rect=>{
      let listHeight = rect.height;
      this.setData({
        scrolltop: index > 2 ? listHeight / this.data.infoList.length * (index - 2) : 0
      })
    }).exec();
  },

  // <--================================================ 播放列表懒加载 ===========================================================-->
  // 滚到底部
  listBehind: tool.throttle(async function (res) {
    let total = wx.getStorageSync('total')
    let { scrollState } = this.data
    // 滑倒最底下
    let lastIndex = (this.data.pageNo   - 1) * 15 + this.data.infoList.length      // 目前最后一个的索引值
    if (lastIndex >= total && scrollState) {
      this.setData({
        showLoadEnd: false,
        scrollState:false
      },()=>{
        wx.showToast({
          title: '已经到底啦！',
          icon: 'none'
        })
      })
      return false
    } else {
      this.setData({ showLoadEnd: true })
    }
    scrollTopNo++
    console.log('scrollTopNo', scrollTopNo, this.data.pageNo)
    let abumInfoId = wx.getStorageSync('abumInfoId')
    let params = { pageNum: this.data.pageNo + scrollTopNo, albumId: abumInfoId }
    params.lazy = 'up'
    await this.getList(params)
    this.setData({
      showLoadEnd: false,
    })
  }, 1000),
  // 为了实现上拉可以加载更多
  touchStart(e) {
    this.setData({
      startY: e.changedTouches[0].pageY,
    })
  },
  // 触摸移动
  touchMove(e) {
    let endY = e.changedTouches[0].pageY
    let startY = this.data.startY
    let dis = endY - startY
    // 判断是否下拉
    if (dis <= 0 || this.data.pageNo <= 1) {
      return false
    }
    if (dis < 60) {
      // 下拉60内随下拉高度增加
      this.move = wx.createAnimation({
        duration: 100,
        timingFunction: 'linear',
      })
      this.move.translate(0, '6vh').step()
      this.setData({
        loadAnimate: this.move.export(),
        showLoadTop: true,
      })
    }
    // 滑动距离大于20开始刷新
    this.showRefresh = dis > 20
  },
  // 触摸结束
  touchEnd: tool.throttle(function(e) {
    console.log('结束=================')
    if (this.data.pageNo <= 1 || !this.showRefresh) {
      return false
    }
    //1s后回弹
    setTimeout(() => {
      // 创建动画实例
      this.animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
        delay: 0,
      })
      this.animation.translate(0, 0).step()
      this.setData({
        loadAnimate: this.animation.export(),
        showLoadTop: false,
      })
      this.topHandle()
      this.showRefresh = false
    }, 600)
  }, 2000),

  // 下拉结束后的处理
  async topHandle() {
    let abumInfoId = wx.getStorageSync('abumInfoId')
    await this.getList({ pageNum: this.data.pageNo - 1, albumId: abumInfoId, lazy: 'down' })
    this.setData({
      showLoadTop: false,
      scrollTop: 0,
      pageNo: this.data.pageNo - 1,
    })
  },

  // 获取歌曲列表
  async getList(params) {
    let [canplay, idList, auditionDurationList] = [[], [], []]
    try {
      let res = await albumMedia(params)
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
      })
      // 上拉和下拉的情况
      if (params.lazy == 'up'){
        canplay = this.data.infoList.concat(canplay)
      } else if (params.lazy == 'down') {
        canplay = canplay.concat(this.data.infoList)
      }
      this.setData({infoList: canplay})
    } catch (error) {
      this.setData({infoList: []})
    }
  }
})