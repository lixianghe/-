
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
var timer, timer4, timer5;
let showIndex = 0

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
    clearInterval(timer4)
    
    showIndex = 0
    // 根据分辨率设置样式
    this.setStyle()
    if (options.noPlay !== 'true') {
      console.log('options.noPlay', options.noPlay)

      wx.getStorage({
        key: 'allList',
        success (res) {
          let data = res.data
          wx.setStorageSync('cutAllList', data)
        }
      })
      wx.getStorage({
        key: 'noOrderList',
        success (res) {
          let data = res.data
          wx.setStorageSync('cutNoOrderList', data)
        }
      })


      timer4 = setInterval(() => {
        wx.getStorage({
          key: 'allList',
          success (res) {
            let data = res.data
            wx.setStorageSync('cutAllList', data)
          }
        })
        wx.getStorage({
          key: 'noOrderList',
          success (res) {
            let data = res.data
            wx.setStorageSync('cutNoOrderList', data)
          }
        })
      }, 500)
      setTimeout(() => {
        clearInterval(timer4)
      }, 5000)
    }
    this.setData({
      // songInfo: songInfo,
      id: options.id,
      // allList: allList,
      noPlay: options.noPlay || null,
      abumInfoName: options.abumInfoName || null,
      loopType: wx.getStorageSync('loopType') || 'loop'
    })
    wx.setStorageSync('abumInfoName', options.abumInfoName)
    // 如果没有abumInfoName就把more按钮删掉
    if (!options.abumInfoName) {
      let index = this.data.playInfoBtns.findIndex(n => n.name === 'more')
      this.data.playInfoBtns.splice(index, 1)
      this.setData({playInfoBtns: this.data.playInfoBtns})
    }
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
  onShow: function (options) {
    showIndex++
    // console.log('options------' + this.data.id + '-----')
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    clearInterval(timer)
    tool.playAlrc(that, app);
    timer = setInterval(() => {
      tool.playAlrc(that, app);
    }, 1000);
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
  play() {
    // 初始化audioManager
    let that = this
    // tool.initAudioManager(that, app.globalData.songInfo)
    

    // 从统一播放界面切回来，根据playing判断播放状态options.noPlay为true代表从minibar过来的
    const playing = wx.getStorageSync('playing')
    if (playing || this.data.noPlay !== 'true') app.playing(null, that)
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
  more() {
    
    let cutAllList = wx.getStorageSync('cutAllList')
    let canplaying = wx.getStorageSync('canplaying') || []
    if (this.data.noPlay == 'true' || canplaying[0].id == cutAllList[0].id) {
      this.setData({
        showList: true
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
      this.setData({
        currentId: this.data.currentId || this.data.songInfo.id,
        allList: cutAllList
      })
      setTimeout(()=> {
        this.setScrollTop()
      }, 100)
      return
    }
    
    timer5 = setInterval(() => {
      cutAllList = wx.getStorageSync('cutAllList')
      canplaying = wx.getStorageSync('canplaying') || []
      if (canplaying[0].id == cutAllList[0].id) {
        
        this.setData({
          currentId: this.data.currentId || this.data.songInfo.id,
          allList: cutAllList
        })
        setTimeout(()=> {
          this.setScrollTop()
        }, 100)
        clearInterval(timer5)
      }
    }, 200)
    this.setData({
      showList: true
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
  async playSong(e) {
    let that = this
    let songInfo = e.currentTarget.dataset.song
    // 获取歌曲详情
    let params = {mediaId: songInfo.id, contentType: 'story'}
    await this.getMedia(params)
    this.setData({
      songInfo: songInfo,
      currentId: songInfo.id,
      playing: true
      // noTransform: ''
    })
    // 如果没有src playinfo给出弹框，其他页面给出toast提示
    if (!app.globalData.songInfo.src) {
      this.setData({showModal: true, noBack: true})
      wx.hideLoading()
      wx.stopBackgroundAudio()
    }
    app.playing(null, that)
    wx.setStorage({
      key: "songInfo",
      data: app.globalData.songInfo
    })
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
    let index = this.data.allList.findIndex(n => Number(n.id) === Number(this.data.songInfo.id))
    let query = wx.createSelectorQuery();
    query.select('.songList').boundingClientRect(rect=>{
      let listHeight = rect.height;
      this.setData({
        scrolltop: index > 2 ? listHeight / this.data.allList.length * (index - 2) : 0
      })
    }).exec();
  }
})