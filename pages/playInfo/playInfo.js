
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
const { getData } = require('../../utils/https')

var timer = null

Page({
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    currentId: null,
    btns: btnConfig.playInfoBtns,
    bigScreen:false,
    btnCurrent: null,
    noTransform: '',
    typelist: ['listLoop', 'singleLoop', 'shufflePlayback'],
    loopType: 'listLoop',   // 默认列表循环
    total: 0,
    scrolltop: 0,
    mainColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar
  },
  // 播放器实例
  audioManager: null,
  onReady: function () {
    // 根据分辨率设置样式
    this.setStyle()
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
  },
  async onLoad(options) {
    // 获取歌曲列表
    const canplay = await this.getPlayList({pageNo: 1, pageSize: 40, id: 1})
    const songInfo = app.globalData.songInfo
    // 用于切换模式，复制一个canplay
    songInfo.dt = String(songInfo.dt).split(':').length > 1 ? songInfo.dt : tool.formatduration(Number(songInfo.dt))
    this.setData({
      songInfo: songInfo,
      canplay: canplay
    })
    this.setScrollTop()
    // 初始化audioManager
    let that = this
    tool.initAudioManager(that, canplay)
    // 从统一播放界面切回来，根据playing判断播放状态options.noPlay为true代表从minibar过来的
    const playing = wx.getStorageSync('playing')
    if (playing || options.noPlay !== 'true') app.playing()
    
  },
  onShow: function () {
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    tool.playAlrc(that, app);
    timer = setInterval(function () {
      console.log('在playinfo')
      tool.playAlrc(that, app);
    }, 1000);
    
  },
  onUnload: function () {
    clearInterval(timer);
  },
  onHide: function () {
    clearInterval(timer)
  },
  btnsPlay(e) {
    const type = e.currentTarget.dataset.name
      switch (type) {
        case 'pre':
          this.pre()
          break;
        case 'toggle':
          this.togglePlay()
          break;
        case 'next':
          this.next()
          break;
        case 'loopType':
          this.switchLoop()
          break;
        case 'more':
          this.more()
          break;
        default:
          break;
      }
  },
  // 上一首
  pre() {
    const that = this
    app.cutplay(that, -1)
  },
  // 下一首
  next() {
    console.log('已经播放下一首了')
    const that = this
    app.cutplay(that, 1)
  },
  // 切换播放模式
  switchLoop() {
    const canplay = wx.getStorageSync('canplay')
    console.log('copy', canplay)
    let nwIndex = this.data.typelist.findIndex(n => n === this.data.loopType)
    let index = nwIndex < 2 ? nwIndex + 1 : 0
    app.globalData.loopType = this.data.typelist[index]
    // 根据播放模式切换currentList
    const list = this.checkLoop(this.data.typelist[index], canplay)
    this.setData({
      loopType: this.data.typelist[index],
      canplay: list
    })
  },
  // 判断循环模式
  checkLoop(type, list) {
    let loopList;
    // 列表循环
    if (type === 'listLoop') {
      loopList = list
    } else if (type === 'singleLoop') {
      // 单曲循环
      loopList = [list[app.globalData.songInfo.episode]]
    } else {
      // 随机播放
      loopList = this.randomList(list)
    }
    return loopList
  },
  // 打乱数组
  randomList(arr) {
    let len = arr.length;
    while (len) {
        let i = Math.floor(Math.random() * len--);
        [arr[i], arr[len]] = [arr[len], arr[i]];
    }
    return arr;
  },
  // 暂停/播放
  togglePlay() {
    const that = this
    clearInterval(timer)
    // if (!this.data.playing) {
      timer = setInterval(function () {
        tool.playAlrc(that, app);
      }, 1000);
    // }
    tool.toggleplay(this, app)
  },
  // 播放列表
  more() {
    this.data.canplay.forEach(item => {
      item.dtFormat = String(item.dt).split(':').length > 1 ? item.dt : tool.formatduration(Number(item.dt))
    })
    this.setData({
      showList: true,
      currentId: app.globalData.songInfo.id,
      canplay: this.data.canplay
    })
    // 显示的过度动画
    this.animation.translate(0, 0).step()
    this.setData({
      animation: this.animation.export()
    })
    setTimeout(() => {
      this.setData({
        noTransform: 'noTransform'
      })
    }, 300)
  },
  closeList() {
    this.setData({
      showList: false,
      noTransform: ''
    })
    // 显示的过度动画
    this.animation.translate('-180vh', 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  // 在播放列表里面点击播放歌曲
  playSong(e) {
    const songInfo = e.currentTarget.dataset.song
    app.globalData.songInfo = songInfo
    songInfo.dt = tool.formatduration(Number(songInfo.dt))
    
    this.setData({
      songInfo: songInfo,
      currentId: app.globalData.songInfo.id,
      playing: true
      // noTransform: ''
    })
    app.playing()
    wx.setStorage({
      key: "songInfo",
      data: songInfo
    })
  },
  // 点击改变进度, 拖拽结束
  setPercent(e) {
    clearInterval(timer)
    const that = this
    // 传入当前毫秒值
    const time = e.detail.value / 100 * tool.formatToSend(app.globalData.songInfo.dt)
    app.globalData.currentPosition = time
    if (app.globalData.songInfo.dt) {
      if (that.data.playing) {
        app.playing(time)
        timer = setInterval(function () {
          tool.playAlrc(that, app);
        }, 1000);
      }
      that.setData({
        percent: e.detail.value
      })
    }
  },
  // 拖拽改变进度
  dragPercent(e) {
    const that = this
    clearInterval(timer)
    tool.playAlrc(that, app, e.detail.value);
    that.setData({
      percent: e.detail.value
    })
  },
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
  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      console.log(windowWidth+'-------------------小------------------'+windowHeight, windowHeight / windowWidth)
      this.setData({
        bigScreen: false,
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 9.8vh 20vh',
        btnsWidth: '140vh',
        imageWidth: windowWidth * 0.17 + 'px'
      })
    } else {
      // 1920*720
      console.log(windowWidth+'-------------------大------------------'+windowHeight, (windowHeight / windowWidth))
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
    let index = this.data.canplay.findIndex(n => n.id === app.globalData.songInfo.id)
    let query = wx.createSelectorQuery();
    query.select('.songList').boundingClientRect(rect=>{
      let listHeight = rect.height;
      console.log('listHeight', listHeight);
      this.setData({
        scrolltop: listHeight / this.data.total *index
      })
    }).exec();
  },
  // 获取歌曲列表
  async getPlayList(params) {
    let canplay,total;
    // 数据请求
    try {
      const res = await getData('abumInfo', params)
      canplay = res.data
      total = res.total
    } catch (error) {
      canplay = error.data.data
      total = error.data.total
    }
    canplay.forEach(item => {
      item.formatDt = tool.formatduration(Number(item.dt))
    })
    this.setData({
      total: total
    })
    wx.setStorage({
      key: "canplay",
      data: canplay
    })
    
    setTimeout(() => {
      this.setData({
        hasData: true
      })
    }, 100)
    return canplay
  }
})