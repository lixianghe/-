
const app = getApp()

Component({
  properties: {
    percent: {
      type: Number,
      default: 0
    },
    downloadPercent: {
      type: Number,
      default: 0
    }
  },
  data: {
    // minibar的按钮
    items: [
      {
        name: 'pre',
        img: '../../static/images/pre.png'
      },
      {
        name: 'stop',
        img: '../../static/images/stop.png'
      },
      {
        name: 'next',
        img: '../../static/images/next.png'
      },
      {
        name: 'song',
        img: '../../static/images/song.jpg',
        content: '周杰伦：夜曲'
      }
    ]
  },
  observers: {
    
  },
  lifetimes: {
    attached: function() {
      console.log(this.data)
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    showModal () {
      this.setData({
        showTip: true
      })
    }
  }
})
