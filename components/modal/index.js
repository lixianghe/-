// components/story/story.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: { 
      type: Boolean,
      value: false
    },
    content: { 
      type: String,
      value: ''
    },
    noBack: { 
      type: Boolean,
      value: ''
    }
  },
  data: {
    mainColor: app.globalData.mainColor
  },
  methods: {
    close() {
      this.setData({showModal: false})
      console.log(this.data.noBack)
      if (!this.data.noBack) {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    linkMine() {
      wx.switchTab({
        url: '/pages/personalCenter/personalCenter'
      })
    }
  },

  attached: function () {
    
  }
})
