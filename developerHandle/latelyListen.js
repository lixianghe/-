/**
 * @name: latelyListen
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、播放列表：canplay(注：canplay需要存在Storage里面)
 * 2、此专辑总曲目数：total
 * @param {*}
 * @return {*}
 */
const app = getApp()
const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
    info: [],
  },
  onShow() {
    console.log('Log from mixin!')
  },
  onLoad(options) {
    console.log(111)
    this.getData(0)
  },
  onReady() {

  },
  // 跳转到最近收听页面
  tolatelyListen () {
    wx.navigateTo({
      url: '../latelyListen/latelyListen'
    })
  },
  // 跳转到播放详情界面
  linkAbumInfo (e) {
    let id = e.currentTarget.dataset.id
    const no = e.currentTarget.dataset.no
    const src = e.currentTarget.dataset.src.replace('==', '$')
    const title = e.currentTarget.dataset.title
    // 静态实现最近收听
    if (!app.globalData.latelyListenId.includes(id)) {
      app.globalData.latelyListenId.push(id)
    }
    console.log(app.globalData.latelyListenId)
    wx.navigateTo({
      url: `../abumInfo/abumInfo?id=${id}&no=${no}&src=${src}&title=${title}`
    })
  },
  getData(idx) {
    let res = showData.index.slice(0, idx+1)
    app.globalData.indexData = res
    setTimeout(()=> {
      this.setData({
        info: res,
        retcode: 1
      })
    }, 500)
  },
  // 懒加载
  getLayoutData() {

  },
}