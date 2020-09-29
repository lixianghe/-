
const app = getApp()
const bsurl = 'http://localhost:3000/v1/'

Page({
  data: {
    canplay: [],
    percent: 0,
    id: null,
    songpic: null,
    name: null
  },
  onLoad(options) {
    // 初始化歌曲的名字和歌曲封面，获取歌单列表
    const songInfo = wx.getStorageSync('songInfo')
    this.setData({
      songpic: songInfo.songpic,
      name: songInfo.name,
      canplay: songInfo.canplay
    })
    this.getPlayList()
  },
  onShow() {

  },
  // 跳转到歌曲详情
  goPlayInfo(e) {
    console.log(e)
    // 跳转的时候把歌名，歌曲封面，歌单序号，歌曲id存在本地缓存
    const songInfo = {
      name: e.currentTarget.dataset.name,
      songpic: e.currentTarget.dataset.songpic,
      index: e.currentTarget.dataset.no,
      id: e.currentTarget.dataset.id,
      duration: e.currentTarget.dataset.duration
    }
    console.log(songInfo)
    wx.setStorage('songInfo', songInfo)
    wx.navigateTo({
      url: '../playInfo/playInfo'
    })
  },
  // 获取歌曲列表
  getPlayList() {
    wx.request({
      url: bsurl + 'playlist/detail',
      data: {
        id: 5157518567,
        limit: 1000
      },
      success:  (res) => {
        var canplay = [];
        for (let i = 0; i < res.data.playlist.tracks.length; i++) {
          if (res.data.privileges[i].st >= 0) {
            res.data.playlist.tracks[i].al.picUrl = res.data.playlist.tracks[i].al.picUrl
            canplay.push(res.data.playlist.tracks[i])
          }
        }
        console.log('canplay', canplay)
        this.setData({
          canplay: canplay
        })
        wx.setStorage({
          key: "canplay",
          data: canplay
        })
        wx.setNavigationBarTitle({
          title: res.data.playlist.name
        })
      }
    })
  }
})