import { init, checkStatus } from './utils/httpOpt/api'
import btnConfig from './utils/pageOtpions/pageOtpions'
import { getMedia } from './developerHandle/playInfo'
import tool from './utils/util'
import { albumMedia, mediaUrlList } from './utils/httpOpt/api'

require('./utils/minixs')

App({
  globalData: {
    appName: 'kaishustory',
    // 屏幕类型
    screen: '',
    mainColor: btnConfig.colorOptions.mainColor,
    // 登录相关
    openid: '',
    appId: '60008',
    userId: '-1',
    haveLogin: false,
    token: '',
    appId: '60180',
    // 版本号
    version: '1.0.195.20200928',
    isNetConnected: true,
    indexData: [], // 静态首页数据
    latelyListenId: [], // 静态记录播放id
    abumInfoData: [],
    playing: false,
    percent: 0,
    curplay: {},
    globalStop: true,
    currentPosition: 0,
    currentList: [],
    loopType: 'loop', // 默认列表循环
    PIbigScreen: null
  },
  // 小程序颜色主题
  sysInfo: {
    colorStyle: 'dark',
    backgroundColor: 'transparent',
    defaultBgColor: '#151515'
  },
   // 用户信息
   userInfo: {
    userId: null,
    token: '',
    refreshToken: ''
  },
  // 用户认证信息
  authInfo: {
    openId: '',
    unionId: '',
    authCode: ''
  },
  // 访客信息
  guestInfo: {
    token: '',
    refreshToken: '',
    deviceId: ''
  },
   // token状态，0-正常，1001-token过期，1003-refresh-token过期，1004-登录过期
  tokenStatus: 0,
  // 日志文本
  logText: '',
  audioManager: null,
  currentIndex: null,
  onLaunch: function () {
    this.initCode()
    // 获取小程序颜色主题
    this.getTheme()
    // 判断playInfo页面样式，因为这里最快执行所以放在这
    this.setStyle()
    this.audioManager = wx.getBackgroundAudioManager()
    // 判断用户是否已经登录了
    this.checkStatus()
    // wx.setStorageSync('username', 'T-mac')
    
    // 判断横竖屏
    if (wx.getSystemInfoSync().windowWidth > wx.getSystemInfoSync().windowHeight) {
      this.globalData.screen = 'h'
    } else {
      this.globalData.screen = 'v'
    }
    // myPlugin.injectWx(wx)
    // 关于音乐播放的
    var that = this;
    //播放列表中下一首
    wx.onBackgroundAudioStop(function () {
      console.log('自动播放完成事件')
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      let songInfo = that.globalData.songInfo
      if (songInfo.dataUrl) that.cutplay(currentPage, 1, true)
    });
    //监听音乐暂停，保存播放进度广播暂停状态
    wx.onBackgroundAudioPause(function () {
      that.globalData.playing = false;
      wx.getBackgroundAudioPlayerState({
        complete: function (res) {
          that.globalData.currentPosition = res.currentPosition ? res.currentPosition : 0
        }
      })
    });
    wx.setStorageSync('playing', false)
  },

  // 保存用户信息
  setUserInfo(userInfo) {
    this.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
  },
  // 获取用户信息
  getUserInfo(key) {
    let userInfo = this.userInfo.userId ? this.userInfo : wx.getStorageSync('userInfo')
    if (key) {
      return userInfo[key]
    }
    return userInfo
  },
  vision: '1.0.0',
  cutplay: async function (that, type, cutFlag, panelCut) {
    wx.showLoading({
      title: '加载中',
    })
    // 判断循环模式
    var cutList = wx.getStorageSync('canplaying') || []
    // 如果是在播放面板，剔除掉没有dataUrl的
    if (panelCut) {
      if (wx.canIUse('getPlayInfoSync')) {
        let res = wx.getPlayInfoSync()
        let panelSong = JSON.parse(res.context)
        if (panelSong.dataUrl) {
          this.globalData.songInfo = panelSong
        }
        const list = wx.getStorageSync('canplaying')
        cutList = list.filter(n => n.dataUrl)
        wx.setStorageSync('canplaying', cutList)
        wx.setStorageSync('currentPageNo', panelSong.currentPageNo)
        let noOrderList = tool.randomList(JSON.parse(JSON.stringify(cutList)))
        wx.setStorageSync('noOrderList', noOrderList)
      }
      
    }
    // 根据循环模式设置数组
    let loopType = wx.getStorageSync('loopType') || 'loop'
    // 如果缓存没有abumInfoName，说明是从首页单曲进入，list为单首
    let abumInfoName = wx.getStorageSync('abumInfoName')
    // 歌曲列表
    cutList = abumInfoName ? this.setList(loopType, cutList, cutFlag, panelCut) : [this.globalData.songInfo]
    // 当前歌曲的索引
    // let no = cutList.findIndex(n => n.dataUrl === this.globalData.songInfo.dataUrl.split('?')[0])
    let no = cutList.findIndex(n => n.id === this.globalData.songInfo.id)
    let index = this.setIndex(type, no, cutList)
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    let song = cutList[index] || cutList[0]

    let currentPageNo = wx.getStorageSync('currentPageNo')
    // 如果是专辑类型才会执行下面代码
    if (Number(wx.getStorageSync('total'))) {
      let maxPageNo = Math.ceil(wx.getStorageSync('total') / 15)
      // 下一首的情况
        // if (type == 1 && this.globalData.songInfo.dataUrl == cutList[cutList.length - 1].dataUrl && loopType !== 'singleLoop') {
        if (type == 1 && this.globalData.songInfo.id == cutList[cutList.length - 1].id && loopType !== 'singleLoop') {
        let params
        let abumInfoId = wx.getStorageSync('abumInfoId')
        // 如果不是最后一页
        if (currentPageNo < maxPageNo) { 
          params = {pageNum: Number(currentPageNo) + 1, albumId: abumInfoId}
          currentPageNo = Number(currentPageNo) + 1
        } else {
          params = {pageNum: 1, albumId: abumInfoId}
          currentPageNo = 1
        }
        cutList = await this.getList(params)

        // 判断这首歌是否是最后一首歌，如果是看是跳到第一首还是翻页
        if (!cutList[0].dataUrl) {
          let params = {pageNum: 1, albumId: abumInfoId}
          cutList = await this.getList(params)
          currentPageNo = 1
        }
        song = cutList[0]
        wx.setStorageSync('canplaying', cutList)
        wx.setStorageSync('currentPageNo', currentPageNo)
        let noOrderList = tool.randomList(JSON.parse(JSON.stringify(cutList)))
        wx.setStorageSync('noOrderList', noOrderList)
      } 
      // 上一首的情况
      if (type == -1 && this.globalData.songInfo.dataUrl == cutList[0].dataUrl && loopType !== 'singleLoop') {
        let params
        let abumInfoId = wx.getStorageSync('abumInfoId')
        // 如果不是第一页
        if (currentPageNo > 1) { 
          params = {pageNum: Number(currentPageNo) - 1, albumId: abumInfoId}
          currentPageNo = Number(currentPageNo) - 1
        } else {
          params = {pageNum: Number(maxPageNo), albumId: abumInfoId}
          currentPageNo = Number(maxPageNo)
        }
        cutList = await this.getList(params)
        // 判断这首歌是否是最后一首歌，如果是看是跳到第一首还是翻页
        if (!cutList[0].dataUrl) {
          let params = {pageNum: 1, albumId: abumInfoId}
          cutList = await this.getList(params)
          currentPageNo = 1
        }
        song = cutList[cutList.length - 1]
        wx.setStorageSync('canplaying', cutList)
        wx.setStorageSync('currentPageNo', currentPageNo)
        let noOrderList = tool.randomList(JSON.parse(JSON.stringify(cutList)))
        wx.setStorageSync('noOrderList', noOrderList)
      } 
    }
    // console.log('ssong', song.id)

    // console.log('song------------------------'+JSON.stringify(song))
    // console.log('cutList------------------------'+JSON.stringify(cutList))
    // wx.pauseBackgroundAudio();
    that.setData({
      // currentId: wx.getStorageSync('canplaying').filter(n => n.dataUrl === song.dataUrl)[0].id
      currentId: Number(song.id) || wx.getStorageSync('canplaying').filter(n => n.dataUrl === song.dataUrl)[0].id
    })
    that.triggerEvent('current', song.id)
    // 获取歌曲的url
    let params = {
      mediaId: song.id,
      song: song,
      contentType: 'story'
    }
    console.log('根据index在列表拿到的song', index, song)
    await getMedia(params, that)
    // 如果没有dataUrl playinfo给出弹框，其他页面给出toast提示
    let songInfo = this.globalData.songInfo
    if (!songInfo.dataUrl) {
      if (that.route === 'pages/playInfo/playInfo') {
        that.setData({
          showModal: true, 
          noBack: true,
          playing: false,
          playtime: '00:00',
          percent:0,
        })
        wx.hideLoading()
        wx.setStorageSync('playing',false)
      } else {
        wx.hideLoading()
        const pages = getCurrentPages()
        let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
        if (miniPlayer) {
          miniPlayer.setData({ playing: false })
        }
          pages[pages.length - 1].setData({
            playing: false
        })
        wx.setStorageSync('playing',false)
        setTimeout(() => {
          wx.showToast({
            title: '该内容为会员付费内容，请先成为会员再购买收听~',
            icon: 'none'
          })
        }, 500)
      }
      wx.stopBackgroundAudio()
      return false
    }else{
      let songInfo = wx.getStorageSync('songInfo')
      let isInclusion = this.cardPplayList.findIndex(item=>item.title == songInfo.title) !=-1
      if(this.cardPplayList.length && isInclusion){
        let song =  this.cardPplayList.find(item=>item.title == songInfo.title)
        songInfo.title = song.title
        songInfo.dataUrl = song.dataUrl
        songInfo.coverImgUrl = song.coverImgUrl
      }
      wx.setStorageSync('songInfo',songInfo)
      loopType === 'singleLoop' || !abumInfoName ? this.playing(0, that) : this.playing(null, that)
    }
  },
  // 根据循环模式设置播放列表
  setList(loopType, list, cutFlag, panelCut){
    let loopList = []
    // 列表循环
    if (loopType === 'loop') {
      loopList = list     
    } else if (loopType === 'singleLoop') {
      
      // 单曲循环
      loopList = cutFlag ? [this.globalData.songInfo] : list
    } else {
      let noOrderList = wx.getStorageSync('noOrderList') || []
      if (panelCut) noOrderList = noOrderList.filter(n => n.dataUrl)
      loopList = noOrderList
    }
    return loopList
  },
  // 根据循环模式设置切歌的index,cutFlag为true时说明是自然切歌
  setIndex(type, no, list) {
    let index
    if (type === 1) {
      index = no + 1 > list.length - 1 ? 0 : no + 1
    } else {
      index = no - 1 < 0 ? list.length - 1 : no - 1
    }
    return index
  },
  // 获取歌曲列表
  async getList(params) {
    let [canplay, idList] = [[], []]
    try {
      let res = await albumMedia(params)
      res.mediaList.map((item, index) => {
        idList.push(item.mediaId)
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
        item.dataUrl = item.mediaUrl
      })
      console.log('---------', canplay)
      return canplay
    } catch (error) {
      return []
    }
  },
  // 暂停音乐
  stopmusic: function () {
    wx.pauseBackgroundAudio();
  },
  // 根据歌曲url播放歌曲
  playing: function (seek, that) {
    const songInfo = wx.getStorageSync('songInfo')
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (!songInfo.dataUrl) return
    // 播放错误时，调起播放的标识符
    let fl = true
    if (miniPlayer) miniPlayer.setData({ playing: true })
    pages[pages.length - 1].setData({
        playing: true
    })
    wx.setStorageSync('playing',true)
    // setTimeout(() => {
      tool.initAudioManager(this, that, songInfo, fl)
      this.carHandle(songInfo, seek)
    // }, 200)
    // wx.hideLoading()
    
  },
  // 车载情况下的播放
  carHandle(songInfo, seek) {
    this.audioManager.src = songInfo.dataUrl
    this.audioManager.title = songInfo.title
    this.audioManager.coverImgUrl = songInfo.coverImgUrl
    // this.audioManager.play()
    if (seek != undefined && typeof (seek) === 'number') {
      // wx.seekBackgroundAudio({
      //   position: seek
      // })
      this.audioManager.seek(seek)
    }
  },
  // 获取网络信息，给出相应操作
  getNetWork(that) {
    // 监听网络状态
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    wx.onNetworkStatusChange(res => {
      const networkType = res.isConnected
      if (!networkType) {
        that.setData({showNonet: true})
        wx.hideLoading()
      } else {
        that.setData({showNonet: false})
        // currentPage.onLoad(currentPage.options)
      }
    })
  },
  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth = wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.globalData.PIbigScreen = false
    } else {
      // 1920*720
      this.globalData.PIbigScreen = true
    }
  },
  // 初始化token、deviceId、refreshToken
  initCode() {
    // let guestInfo = wx.getStorageSync('guestInfo');
    let userInfo = wx.getStorageSync('userInfo');
    let authInfo = wx.getStorageSync('authInfo');
    if (authInfo){
      console.log(authInfo)
      this.authInfo = authInfo;
    }
    if (userInfo){
      this.userInfo = userInfo;
      return;
    }

    
    const token = wx.getStorageSync('token')
    if (token) return false
    let deviceInfo = {
      phoneDeviceCode: this.uuid()
    }
    wx.getSystemInfo({
      success: async (res) => {
        deviceInfo.phoneModel = res.system
        deviceInfo.sysVersion = res.version
        let initData = await init(deviceInfo)
        wx.setStorageSync('deviceId', initData.deviceId)
        wx.setStorageSync('refreshToken', initData.refreshToken)
        wx.setStorageSync('token', initData.token)
      }
    })
  },
  checkStatus(){
    console.log('this.userInfo.token', this.userInfo.token)
    if(!this.userInfo.token){
      return
    }
    checkStatus({}).then(res => {
      // 若code为0且changeFlag为true，更新token和refreshToken
      console.log('checkStatus---302行-----------', JSON.stringify(res))
      if (res.changeFlag){
        this.userInfo.token = res.token
        this.userInfo.refreshToken = res.refreshToken
        wx.setStorageSync('token', res.token)
        wx.setStorageSync('refreshToken', res.refreshToken)
      }

      this.tokenStatus = 0
      wx.setStorageSync('userInfo', this.userInfo)
    }).catch(err => {
      console.log('checkStatus失败437-----------')
      console.log(err)
    })
  },
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },
  // 获取颜色主题
  getTheme: function () {
    if (wx.canIUse("getColorStyle")) {
      wx.getColorStyle({
        success: (res) => {
          this.sysInfo.colorStyle = res.colorStyle
          this.sysInfo.backgroundColor = res.backgroundColor
          this.globalData.themeLoaded = true
          console.log(JSON.stringify(res)+'获取配色成功387行')
          // this.initTabbar()
        },
        fail: (res) => {
          this.log('配色加载失败')
          console.log('配色加载失败')
          this.sysInfo.backgroundColor = this.sysInfo.defaultBgColor
          this.globalData.themeLoaded = true
          // this.initTabbar()
        }
      })
    } else{
      this.sysInfo.backgroundColor = this.sysInfo.defaultBgColor
      this.globalData.themeLoaded = true
      // this.initTabbar()
    }
    if(wx.canIUse('onColorStyleChange')){
      wx.onColorStyleChange((res) => {
        this.sysInfo.colorStyle = res.colorStyle
        this.sysInfo.backgroundColor = res.backgroundColor
        wx.setTabBarStyle({
          color: res.colorStyle == 'dark'?'#FFFFFF':'#c4c4c4'
        })
      })
    }
  },
  // 设置页面配色
  setTheme(page) {
    if (this.globalData.themeLoaded) {
      page.setData({
        colorStyle: this.sysInfo.colorStyle,
        backgroundColor: this.sysInfo.backgroundColor
      })
    } else {
      this.watch(page, 'themeLoaded', val => {
        if (val) {
          page.setData({
            colorStyle: this.sysInfo.colorStyle,
            backgroundColor: this.sysInfo.backgroundColor
          })
        }
      })
    }
    if(wx.canIUse('onColorStyleChange')){
      wx.onColorStyleChange((res) => {
        this.sysInfo.colorStyle = res.colorStyle
        console.log(JSON.stringify(res)+'获取配色成功999行')
        this.sysInfo.backgroundColor = res.backgroundColor
        page.setData({
          colorStyle: this.sysInfo.colorStyle,
          backgroundColor: this.sysInfo.backgroundColor
        })
      })
    }
  },
  // 记录日志
  log(...text) {
    // 全局log开关
    for (let e of text) {
      if (typeof e == "object") {
        try {
          if (e === null) {
            this.logText += "null";
          } else if (e.stack) {
            this.logText += e.stack;
          } else {
            this.logText += JSON.stringify(e);
          }
        } catch (err) {
          this.logText += err.stack;
        }
      } else {
        this.logText += e;
      }
      this.logText += "\n";
    }
    this.logText += "#############\n";
  },
  version:'2.2.5',
  // log - 日志文本
  logText: "",
  // log - 日志开关，1 => 开启，0 => 关闭
  openLog: 0,
  cardPplayList:[],
})