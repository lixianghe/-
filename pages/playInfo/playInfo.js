
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'

var timer = null
let copyData = []

Page({
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    current: null,
    btns: btnConfig.playInfoBtns,
    bigScreen:false,
    btnCurrent: null,
    noTransform: '',
    typelist: ['listLoop', 'singleLoop', 'shufflePlayback'],
    loopType: 'listLoop',   // 默认列表循环,
    audioManager: {}
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
  },
  onLoad(options) {
   
    // 获取歌曲列表
    const canplay = wx.getStorageSync('canplay')
    const songInfo = app.globalData.songInfo
    app.globalData.currentList = canplay
    wx.setStorage({
      key: "currentList",
      data: canplay
    })
    copyData = canplay
    songInfo.dt = String(songInfo.dt).split(':').length > 1 ? songInfo.dt : tool.formatduration(Number(songInfo.dt))
    this.setData({
      songInfo: songInfo,
      canplay: canplay
    })
    // 初始化audioManager
    this.initAudioManager(canplay)
    // 如果点击的还是当前播放的歌曲则不用重新播放
    if (options.noPlay !== 'true') {
      app.playing()
      this.playHandle()
    }

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
  onShow: function () {
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    tool.playAlrc(that, app);
    timer = setInterval(function () {
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
    app.cutplay(that, -1, this.playHandle)
  },
  // 下一首
  next() {
    console.log('已经播放下一首了')
    const that = this
    app.cutplay(that, 1, this.playHandle)
  },
  // 切换播放模式
  switchLoop() {
    let nwIndex = this.data.typelist.findIndex(n => n === this.data.loopType)
    let index = nwIndex < 2 ? nwIndex + 1 : 0
    app.globalData.loopType = this.data.typelist[index]
    // 根据播放模式切换currentList
    app.globalData.currentList = this.checkLoop(this.data.typelist[index], copyData)
    this.setData({
      loopType: this.data.typelist[index]
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
      loopList = [list[app.globalData.songInfo.index]]
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
  // 暂停
  togglePlay() {
    tool.toggleplay(this, app)
  },
  // 播放列表
  more() {
    this.data.canplay.forEach(item => {
      // item.dtFormat = tool.formatduration(Number(item.dt))
      item.dtFormat = String(item.dt).split(':').length > 1 ? item.dt : tool.formatduration(Number(item.dt))
    })
    this.setData({
      showList: true,
      current: app.globalData.songInfo.index,
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
    app.playing()
    this.setData({
      showList: false,
      songInfo: songInfo,
      current: e.currentTarget.dataset.no,
      noTransform: ''
    })
    this.animation.translate('-180vh', 0).step()
    this.setData({
      animation: this.animation.export()
    })
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
        // that.setData({
        //   drapType: false
        // })
        app.playing(time)
        timer = setInterval(function () {
          tool.playAlrc(that, app);
        }, 1000);
      }
      that.setData({
        percent: e.detail.value,
        // drapPercent: e.detail.value
      })
    }
  },
  // 拖拽改变进度
  dragPercent(e) {
    const that = this
    clearInterval(timer)
    tool.playAlrc(that, app, e.detail.value);
    that.setData({
      // drapType: true,
      percent: e.detail.value,
      // drapPercent: e.detail.value
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
  // 初始化 BackgroundAudioManager
  initAudioManager(list) {
    console.log('list', list)
    this.audioManager = wx.getBackgroundAudioManager()
    this.audioManager.playList = list
    // this.audioManager.srcType = 0
    // this.audioManager.setPlayMode = 0
    this.EventListener()
  },
  playHandle(){
    let media = this.data.songInfo
    console.log('播放触发',media, this.audioContext)
    this.audioManager.src = media.src
    this.audioManager.title = media.title
    this.audioManager.coverImgUrl = media.coverImgUrl
  },
  // 监听播放，上一首，下一首
  EventListener(){
    //播放事件
    this.audioManager.onPlay(() => {
      console.log('onPlay')
      if(!this.data.playing){
        this.setData({
          playing: true
        })
      }
    })
    //暂停事件
    this.audioManager.onPause(() => {
      console.log('触发播放暂停事件');
      if(this.data.playing){
        this.setData({
          playing: false
        })
      }
    })
    //上一首事件
    this.audioManager.onPrev(() => {
      console.log('触发上一首事件');
      this.pre()
    })
    //下一首事件
    this.audioManager.onNext(() => {
      console.log('触发下一首事件');
      this.next();
    })
    //停止事件
    this.audioManager.onStop(() => {
      console.log('触发停止事件');
    })
    //播放错误事件
    this.audioManager.onError(() => {
      console.log('触发播放错误事件');
    })
    //播放完成事件
    this.audioManager.onEnded(() => {
      console.log('触发播放完成事件');
    })
  }
})