const app = getApp()

Component({
  properties: {
    prop: String // 0 正常 1 无数据 2 网络异常 3 服务器异常 4 请求失败
  },
  data: {
    num: Math.floor(500 / 10),
    selected: 0,
    isSelectWorks: false,
    len: 10
  },
  methods: {
    selectThis(e) {
      this.setData({
        selected: e.currentTarget.dataset.index
      })
      this.triggerEvent('changeWords', {index: e.currentTarget.dataset.index, len: this.data.len})
    },
    closeWords (e) {
      this.setData({
        isSelectWorks: false
      })
    },
    hideShow(val) {
      this.setData({
        isSelectWorks: val
      })
    },
  },
  attached(options) {
  }
})