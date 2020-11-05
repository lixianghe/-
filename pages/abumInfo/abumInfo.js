const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'

const { getData } = require('../../utils/https')

// 记录上拉拉刷新了多少次
let scrollTopNo = 0

// 选择的选集
let selectedNo = 0
Page({
  data: {
    canplay: [],
    percent: 0,
    id: null,
    songpic: null,
    title: null,
    index: null,
    current: null,
    currentId: null,
    zjNo: 0,
    songInfo: {},
    leftWith: '184vh',
    leftPadding: '0vh 5.75vh  20vh 11.25vh',
    btnsWidth: '167vh',
    imageWidth: '49vh',
    pageNo: 1,
    pageSize: 10,
    total: 0,
    optionId: '',
    palying: false,
    hasData: false,
    msg: '',
    batchSetRecycleData: true,
    showLoadTop: false,
    showLoadEnd: false,
    scrollTop: 0,
    pageNo: 1,
    initPageNo: 1,
    pageSize: 10,
    selected: 0,
    startY: 0,
    loadAnimate: null,
    tenHeight: 0,
    mainColor: btnConfig.colorOptions.mainColor,
    selectWordBtn: btnConfig.selectWordBtn,
  },
  audioManager: null,
  ctx: null,
  onReady() {},
  async onLoad(options) {
    const msg = '网络异常，请检查网络！'
    this.getNetWork(msg)
    // 暂存专辑全部歌曲
    this.setData({
      zjNo: options.no,
      src: options.src.replace('$', '=='),
      optionId: options.id,
    })

    // 判断分辨率的比列
    const windowWidth = wx.getSystemInfoSync().screenWidth
    const windowHeight = wx.getSystemInfoSync().screenHeight
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.setData({
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 3.3vh 20vh 8.3vh',
        btnsWidth: windowWidth * 0.67 + 'px',
        imageWidth: windowWidth * 0.17 + 'px',
      })
    } else {
      this.setData({
        leftWith: '184vh',
        leftPadding: '0vh 5.75vh 20vh  11.25vh',
        btnsWidth: '167vh',
        imageWidth: '49vh',
      })
    }
    this.getAllList()
    // 获取专辑列表
    const canplay = await this.getPlayList({ pageNo: 1, pageSize: 10, id: options.id })
    this.setCanplay(canplay)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    // 获取十首歌得高度
    setTimeout(() => {
      this.getTenHeight()
    }, 500)
  },
  onShow() {
    const currentId = app.globalData.songInfo && app.globalData.songInfo.title ? app.globalData.songInfo.id : null
    this.setData({
      currentId: currentId,
    })
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  },
  // 调用子组件的方法，进行通讯,传值true显示选集列表
  changeProp() {
    this.selectWorks = this.selectComponent('#selectWorks')
    let val = {
      hidShow: true,
      sum: this.data.total,
    }
    this.selectWorks.hideShow(val)
    this.setData({
      selected: selectedNo + this.data.pageNo - 1,
    })
  },
  // 接受子组件传值
  async changeWords(e) {
    // 请求新的歌曲列表
    this.setData({
      scrollTop: 0,
    })
    // 重置
    scrollTopNo = 0
    this.setData({
      pageNo: e.detail.pageNo,
      pageSize: e.detail.pageSize,
      initPageNo: e.detail.pageNo,
    })
    const canplay = await this.getPlayList({ ...e.detail, id: this.data.optionId })
    this.setCanplay(canplay)
  },

  // 点击歌曲名称跳转到歌曲详情
  goPlayInfo(e) {
    // 点击歌曲的时候把歌曲信息存到globalData里面
    const songInfo = e.currentTarget.dataset.song
    app.globalData.songInfo = songInfo
    wx.setStorage({ key: 'songInfo', data: songInfo })
    // 缓存至最近收听
    let latListenData = wx.getStorageSync('latListenData') || []
    let latFlag = latListenData.filter((v) => v.id === songInfo.id).length
    if (latFlag === 0) latListenData.push(songInfo)
    wx.setStorage({ key: 'latListenData', data: latListenData })
    wx.navigateTo({ url: '../playInfo/playInfo?id=' + this.data.optionId })
    this.setData({ currentId: songInfo.id })
  },
  // 改变current
  changeCurrent(index) {
    this.setData({ currentId: app.globalData.allList[index.detail].id })
  },
  // 获取歌曲列表
  async getPlayList(params) {
    let canplay, total
    // 数据请求
    try {
      const res = await getData('abumInfo', params)
      canplay = res.data
      total = res.total
    } catch (error) {
      canplay = error.data.data
      total = error.data.total
    }
    canplay.forEach((item) => {
      item.formatDt = tool.formatduration(Number(item.dt))
    })
    this.setData({
      total: total,
    })
    setTimeout(() => {
      this.setData({
        hasData: true,
      })
    }, 100)
    return canplay
  },
  // 获取专辑全部歌曲
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
  },
  setCanplay(canplay) {
    this.setData({
      canplay: canplay,
    })
    wx.setStorage({
      key: 'canplay',
      data: canplay,
    })
  },
  // 播放全部
  playAll() {
    const msg = '网络异常，无法播放！'
    app.globalData.canplay = this.data.canplay
    app.globalData.songInfo = this.data.canplay[0]
    this.initAudioManager(this.data.canplay)
    this.setData({
      currentId: app.globalData.songInfo.id,
      songInfo: app.globalData.songInfo,
    })
    this.getNetWork(msg, app.playing)
    wx.setStorage({
      key: 'songInfo',
      data: this.data.canplay[0],
    })
  },
  setPlaying(e) {
    this.setData({
      palying: e.detail,
    })
  },
  // 获取网络信息，给出相应操作
  getNetWork(title, cb) {
    const that = this
    // 监听网络状态
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.setData({
            msg: title,
          })
          that.bgConfirm = that.selectComponent('#bgConfirm')
          that.bgConfirm.hideShow(true, 'out', () => {})
        } else {
          setTimeout(() => {
            cb && cb()
          }, 200)
        }
      },
    })
  },
  // 初始化 BackgroundAudioManager
  initAudioManager(list) {
    this.audioManager = wx.getBackgroundAudioManager()
    this.audioManager.playInfo = { playList: list }
  },
  // 列表滚动事件
  listScroll: tool.debounce(async function (res) {
    let top = res.detail.scrollTop
    selectedNo = parseInt(top / this.data.tenHeight)
  }, 50),
  // 滚到顶部
  listTop: tool.throttle(async function (res) {
    console.log('滚到顶部')
  }, 2000),
  // 滚到底部
  listBehind: tool.throttle(async function (res) {
    console.log('滑倒底部')
    // 滑倒最底下
    if ((scrollTopNo + this.data.initPageNo) * 10 >= this.data.total) {
      this.setData({ showLoadEnd: false })
      return false
    } else {
      this.setData({ showLoadEnd: true })
    }
    scrollTopNo++
    const getList = await this.getPlayList({ pageNo: this.data.initPageNo + scrollTopNo, pageSize: 10, id: this.data.optionId })
    const list = this.data.canplay.concat(getList)
    setTimeout(() => {
      this.setData({
        canplay: list,
        showLoadEnd: false,
      })
      wx.setStorage({
        key: 'canplay',
        data: list,
      })
    }, 800)
  }, 1000),
  getTenHeight() {
    let query = wx.createSelectorQuery()
    query
      .select('.songList')
      .boundingClientRect((rect) => {
        let listHeight = rect.height
        this.setData({
          tenHeight: listHeight,
        })
      })
      .exec()
  },
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
    }, 1000)
  }, 2000),
  // touchEnd(e) {
    
  // },
  // 下拉结束后的处理
  async topHandle() {
    const getList = await this.getPlayList({ pageNo: this.data.pageNo - 1, pageSize: 10, id: this.data.optionId })
    const list = getList.concat(this.data.canplay)
    this.setData({
      canplay: list,
      showLoadTop: false,
      scrollTop: 0,
      pageNo: this.data.pageNo - 1,
    })
  },
})
