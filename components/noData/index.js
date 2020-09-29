const app = getApp()

Component({
  properties: {
    prop: String // 0 正常 1 无数据 2 网络异常 3 服务器异常 4 请求失败
  },
  data: {
    isNoData: true
  },
  methods: {
  
  },
  attached(options) {
  }
})