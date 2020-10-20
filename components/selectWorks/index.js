const app = getApp()

Component({
  properties: {
    prop: String // 0 正常 1 无数据 2 网络异常 3 服务器异常 4 请求失败
  },
  data: {
    data: [],
    selected: 0,
    isSelectWorks: false,
    sum: 0,
    len: 10,
    order: true
  },
  methods: {
    selectThis(e) {
      this.setData({
        selected: e.currentTarget.dataset.index
      })
      this.triggerEvent('changeWords', {pageNo: e.currentTarget.dataset.index + 1, pageSize: this.data.len})
    },
    closeWords (e) {
      this.setData({
        isSelectWorks: false
      })
    },
    hideShow(val) {
      this.setData({
        isSelectWorks: val.hidShow,
        sum: val.sum
      })
      // 加载选集
      this.loadWorks()
    },
    loadWorksUp () {
      let arr = []
      for (let i = 1; i <= this.data.sum; i++) {
        if (i === this.data.sum && i % this.data.len !== 0) {
          let start = arr[arr.length - 1].end + 1
          arr.push({
            start: start,
            end: i
          })
        }

        if (i % this.data.len === 0) {
          arr.push({
            start: i - this.data.len + 1,
            end: i
          })
        }
      }
      return arr
    },
    loadWorksDown() {
      let arr = []
      let endRes = this.data.sum % this.data.len
      for (let i = this.data.sum; i >= 1; i--) {
        let temp = this.data.sum - i
        if (temp % this.data.len === 0 && i > endRes) {
          console.log(temp)
          arr.push({
            start: i,
            end:  i - this.data.len + 1
          })
        }
        if (i < endRes) {
          arr.push({
            start: endRes,
            end:  1
          })
          return arr
        }
      }
      return arr
    },
    loadWorks () {
      let result = this.data.order ? this.loadWorksUp() : this.loadWorksDown()
      this.setData({
        data: result
      })
    },
    changeOrder() { // 改变排序方式
      let currentOrder = !this.data.order
      this.setData({
        order: currentOrder,
        selected: null
      })
      this.loadWorks()
    }
  },
  attached(options) {

  }
})