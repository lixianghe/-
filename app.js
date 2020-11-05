// var myPlugin = requirePlugin('inCar')
// var bsurl = 'http://localhost:3000/v1/'
import tool from './utils/util'

App({
  globalData: {
    appName: 'listenTemplate',
    // 屏幕类型
    screen: '',
    // 登录相关
    openid: '',
    userInfo: null,
    appId: '60008',
    userId: '-1',
    haveLogin: false,
    token: '',
    isNetConnected: true,
    indexData: [],
    abumInfoData: [],

    playing: false,
    percent: 0,
    curplay: {},
    globalStop: true,
    currentPosition: 0,
    canplay: [],
    currentList: [],
    loopType: 'listLoop',   // 默认列表循环
    useCarPlay: wx.canIUse('backgroundAudioManager.onUpdateAudio'),
    canUseImgCompress: false,
    imgCompresDomain: "",
  },
  audioManager: null,
  onLaunch: function () {
    // 初始化图片压缩
    this.initImgPress()
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
        success: (res)=> {
          let playing = res.data.playStatus
          wx.setStorageSync('playing', playing)
          console.log('res.data.playStatus!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + JSON.stringify(res.data) + '!!!!!!!!!' + res.data.playStatus)
        }
      })
    }
    if (wx.canIUse('getPlayInfoSync')) {
      let res = wx.getPlayInfoSync()
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'+JSON.stringify(res))
    }
    
  },
  
  vision: '1.0.0',
  cutplay: function (that, type) {
    // 判断循环模式
    let allList = wx.getStorageSync('allList')
    console.log('this.globalData.songInfo.episode', this.globalData.songInfo.episode)
    // 设置列表的index
    let no = this.globalData.songInfo.episode
    let index = this.setIndex(type, no, allList) - 1
    //播放列表中下一首
    this.globalData.songInfo = allList[index]
    wx.setStorage({
      key: "songInfo",
      data: allList[index]
    })
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    wx.pauseBackgroundAudio();
    this.globalData.loopType === 'singleLoop' ? this.playing(0) : this.playing()
    // 切完歌改变songInfo的index
    this.globalData.songInfo.episode = index + 1
    this.globalData.songInfo.dt = String(this.globalData.songInfo.dt).split(':').length > 1 ? this.globalData.songInfo.dt : tool.formatduration(Number(this.globalData.songInfo.dt))
    that.setData({
      songInfo: this.globalData.songInfo,
      currentId: allList[index].id
    })
  },
  // 根据循环模式设置切歌的index
  setIndex(type, no, list) {
    let index
    if (this.globalData.loopType === 'listLoop' || this.globalData.loopType === 'shufflePlayback') {
      if (type === 1) {
        index = no + 1 > list.length - 1 ? 0 : no + 1
      } else {
        index = no - 1 < 0 ? list.length - 1 : no - 1
      }
    } else {
      index = 0
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
      this.carHandle()
    } else {
      this.wxPlayHandle(songInfo, seek, cb)
    }
    
  },
  // 车载情况下的播放
  carHandle() {
    let media = wx.getStorageSync('songInfo') || {} 
    console.log('！！！！！！！！！！！！！！！！！！！！！！！' + JSON.stringify(media))
    this.audioManager.src = media.src
    this.audioManager.title = media.title
    this.audioManager.coverImgUrl = media.coverImgUrl
  },
  // 非车载情况的播放
  wxPlayHandle(songInfo, seek, cb) {
    console.log('songInfo', songInfo)
    var that = this
    wx.playBackgroundAudio({
      dataUrl: songInfo.src,
      title: songInfo.title,
      success: function (res) {
        console.log('res', res)
        if (seek != undefined && typeof(seek) === 'number') {
          console.log('seek', seek)
          wx.seekBackgroundAudio({ position: seek })
        };
        that.globalData.playing = true;
        cb && cb();
      },
      fail: function () {
        console.log(888)
      }
    })
  },
   /**
   * 初始化图片压缩
   */
  initImgPress: function () {
    let that = this
    let canUseImgCompress = false;
    let imgCompresDomain = "";
    console.log('===========准备====171========')
    if (wx.canIUse('getMossApiSync') && wx.canIUse('getMossApi')) {
      console.log('===========可以使用===========')
      const ret = wx.getMossApiSync({
        type: "image-compress"
      })
      console.log('getMossApiSync=======176========'+JSON.stringify(ret))
      if (typeof ret == null || ret == "" || ret == "undefined") {
        wx.getMossApi({
          type: "image-compress",
          success(ret) {
            console.log('getMossApi=======187========'+JSON.stringify(ret))
            that.globalData.canUseImgCompress = true;
            that.globalData.imgCompresDomain = ret.url;
          },
        });
      } else {
        console.log('getMossApiSync不好使=======188========')
        canUseImgCompress = true;
        imgCompresDomain = ret;
      }
    }
    this.globalData.canUseImgCompress = canUseImgCompress;
    this.globalData.imgCompresDomain = imgCompresDomain;
  },


  /**
   * 压缩图片
   */
  impressImg(imgUrl, widthheight) {
    const originImg = imgUrl;
    let impressImg = '';
    const canUseImgCompress = this.globalData.canUseImgCompress;
    const imgCompresDomain = this.globalData.imgCompresDomain;
    if (canUseImgCompress) { //可以使用压缩服务
      console.log('可以使用压缩服务=======207========')
      if (imgCompresDomain.length > 0) { //压缩域名获取成功
        console.log('压缩域名获取成功=======209========')
        const encodeImgUrl = encodeURIComponent(imgUrl);
        if (widthheight) {
          impressImg = `${imgCompresDomain}${widthheight}&url=${encodeImgUrl}`;
          console.log('压缩图片成功=======213========')
        } else {
          impressImg = `${imgCompresDomain}w=400&h=544&url=${encodeImgUrl}`;
        }
      } else { //压缩域名获取失败
        console.log('压缩域名获取失败=======218========')
        this.initImgPress();
        impressImg = ''; //显示默认图
      }
    } else { //不可以使用压缩服务，pad环境使用原图
      console.log('不可以使用压缩服务，pad环境使用原图=======223========')
      impressImg = originImg;
    }
    return impressImg;
  },
})
