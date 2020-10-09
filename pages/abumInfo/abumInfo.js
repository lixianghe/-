
const app = getApp()
const bsurl = 'http://localhost:3000/v1/'

Page({
  data: {
    canplay: [],
    percent: 0,
    downloadPercent: 0,
    id: null
  },
  onLoad(options) {
    this.getPlayList()
  },
  onShow() {

  },
  // 调用子组件的方法，进行通讯,传值true显示选集列表
  changeProp() {
    this.selectWorks = this.selectComponent('#selectWorks')
    console.log(this.selectWorks)
    this.selectWorks.hideShow(true)
  },
  // 接受子组件传值
  changeWords(e) {
    console.log(e)
  },
  // 跳转到歌曲详情
  goPlayInfo(e) {
    console.log(e)
    wx.navigateTo({
      url: `../playInfo/playInfo?no=${e.currentTarget.dataset.no}&id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}&duration=${e.currentTarget.dataset.duration}&songpic=${e.currentTarget.dataset.songpic}`,
      success: function(res) {
      }
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
            res.data.playlist.tracks[i].al.picUrl = res.data.playlist.tracks[i].al.picUrl.replace('==', '$')
            canplay.push(res.data.playlist.tracks[i])
          }
        }
        console.log('canplay', canplay)
        this.setData({
          canplay: canplay
        })

        wx.setNavigationBarTitle({
          title: res.data.playlist.name
        })
      }, fail: function (res) {
        // wx.navigateBack({
        //   delta: 1
        // })
      }
    })
  }
})