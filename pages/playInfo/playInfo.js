
const app = getApp()

Page({
  data: {
  },
  onLoad(options) {

  },
  onShow() {

  },
  // 调用子组件的方法，进行通讯,传值true显示选集列表
  changeProp() {
    this.selectWorks = this.selectComponent('#selectWorks')
    this.selectWorks.hideShow(true)
  },
  // 接受子组件传值
  changeWords(e) {
    console.log(e)
  }
})