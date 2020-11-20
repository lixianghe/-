import tool from './utils/util'
import { init } from './utils/httpOpt/api'
require('./utils/minixs')

App({
  globalData: {
    appName: 'listenTemplate',
    // 屏幕类型
    screen: '',
    // 登录相关
    openid: '',
    appId: '60008',
    userId: '-1',
    haveLogin: false,
    token: '',
    // API域名
    // domain: http.domain.prod,
    // 服务端appId
    // backendAppId: http.appId.prod,
    // AppId
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
    canplay: [],
    currentList: [],
    loopType: 'listLoop', // 默认列表循环
    useCarPlay: wx.canIUse('backgroundAudioManager.onUpdateAudio'),
    PIbigScreen: null
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
  onLaunch: function () {
    this.initCode()
    // 判断playInfo页面样式，因为这里最快执行所以放在这
    this.setStyle()
    this.audioManager = wx.getBackgroundAudioManager()
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
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      console.log('playnext', currentPage)
      that.cutplay(currentPage, 1)
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
    if (wx.canIUse('getShareData')) {
      wx.getShareData({
        name: this.globalData.appName,
        success: (res) => {
          let playing = res.data.playStatus
          wx.setStorageSync('playing', playing)
        }
      })
    }
    // 测试getPlayInfoSync
    if (wx.canIUse('getPlayInfoSync')) {
      let res = wx.getPlayInfoSync()
      console.log('$$$$$$getPlayInfoSync' + JSON.stringify(res))
    }

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
  cutplay: async function (that, type, getUrl) {
    // 判断循环模式
    let allList = wx.getStorageSync('allList')
    // 根据循环模式设置数组
    let loopType = wx.getStorageSync('loopType')
    allList = this.setList(loopType, allList)
    let no = this.globalData.songInfo.episode
    let index = this.setIndex(type, no, allList, loopType) - 1
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    wx.pauseBackgroundAudio();
    // 获取歌曲的url
    let params = {
      mediaId: allList[index].id,
      contentType: 'story'
    }
    if (getUrl) await getUrl(params, that)
    loopType === 'singleLoop' ? this.playing(0) : this.playing()
    // 切完歌改变songInfo的index
    this.globalData.songInfo.episode = index + 1
    that.setData({
      currentId: allList[index].mediaId
    })
    wx.setStorage({
      key: "songInfo",
      data: allList[index]
    })
  },
  // 根据循环模式设置播放列表
  setList(loopType, allList){
    let loopList = []
    // 列表循环
    if (loopType === 'listLoop') {
      loopList = allList     
    } else if (loopType === 'singleLoop') {
      // 单曲循环
      loopList = [this.globalData.songInfo]
    } else {
      // 随机播放
      loopList = this.randomList(allList)
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
  // 根据循环模式设置切歌的index
  setIndex(type, no, list, loopType) {
    let index
    if (loopType === 'listLoop' || loopType === 'shufflePlayback') {
      if (type === 1) {
        index = no + 1 > list.length ? 1 : no + 1
      } else {
        index = no - 1 < 1 ? list.length : no - 1
      }
    } else {
      index = 1
    }
    return index
  },
  // 暂停音乐
  stopmusic: function () {
    wx.pauseBackgroundAudio();
  },
  // 根据歌曲url播放歌曲
  playing: function (seek, cb) {
    const songInfo = this.globalData.songInfo
    // 如果是车载情况
    if (this.globalData.useCarPlay) {
      console.log('车载情况')
      this.carHandle(seek)
    } else {
      console.log('非车载情况')
      this.wxPlayHandle(songInfo, seek, cb)
    }

  },
  // 车载情况下的播放
  carHandle(seek) {
    let media = this.globalData.songInfo || wx.getStorageSync('songInfo')
    this.audioManager.src = media.src
    this.audioManager.title = media.title
    this.audioManager.coverImgUrl = media.coverImgUrl
    if (seek != undefined && typeof (seek) === 'number') {
      wx.seekBackgroundAudio({
        position: seek
      })
    }
  },
  // 非车载情况的播放
  wxPlayHandle(songInfo, seek, cb) {
    var that = this
    wx.playBackgroundAudio({
      dataUrl: songInfo.src,
      title: songInfo.title,
      success: function (res) {
        if (seek != undefined && typeof (seek) === 'number') {
          console.log('seek', seek)
          wx.seekBackgroundAudio({
            position: seek
          })
        };
        that.globalData.playing = true;
        cb && cb();
      },
      fail: function () {
        console.log(888)
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
    let guestInfo = wx.getStorageSync('guestInfo');
    let userInfo = wx.getStorageSync('userInfo');
    let authInfo = wx.getStorageSync('authInfo');
    if (authInfo){
      console.log(authInfo)
      this.authInfo = authInfo;
    }
    if (userInfo){
      this.userInfo = userInfo;
      this.guestInfo = guestInfo;
      return;
    }
    if (guestInfo){
      this.guestInfo = guestInfo;
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
    console.log('校验!!')
    if(!this.userInfo.token){
      return
    }
    this.get({
      url: 'checkStatus',
      data: {
      }
    }, (res) => {
      // console.log(res)
      // 若code不为0，退出登录
      if (res.code !== 0) {
        wx.showToast({
          icon: '',
          title: res.message || 'checkStatus失败',
        })
        // this.userInfo.token = ''
        // wx.removeStorageSync('userInfo');
        // let targetPath = '/pages/index/index';
        // if (this.getCurrentPath() != targetPath) {
        //   wx.switchTab({
        //     url: targetPath,
        //   })
        // }
      }
      // 若code为0且changeFlag为true，更新token和refreshToken
      if (res.code === 0) {
        if (res.changeFlag){
          this.userInfo.token = resRefresh.data.token
          this.userInfo.refreshToken = resRefresh.data.refreshToken
        }
        this.tokenStatus = 0
        // for (let e of this.requestQueue) {
        //   this.http(e.param, e.method, e.callback);
        // }
        // this.requestQueue = []
        wx.setStorageSync('userInfo', this.userInfo)
      }
    })
  },
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },
  /**
   * 记录日志
   */
  log(...text){
    for(let e of text){
      if(typeof e == 'object'){
        try{
          if(e===null){
            this.logText += 'null'
          } else if(e.stack){
            this.logText += e.stack
          } else{
            this.logText += JSON.stringify(e)
          }
        }catch(err){
          this.logText += err.stack
        }
      } else {
        this.logText += e
      }
      this.logText += '\n'
    }
    this.logText += '########################\n'
  },
  _log(val, num) {
    console.log(val, num)
    if(typeof val == 'string') {
      console.log(1)
      this.logText += val + '---' + num + '行'
    }
    if (typeof val == 'object') {
      console.log(2)
      this.logText += JSON.stringify(val) + '---' + num + '行'
    }
    console.log(this.logText)
  },
  
})