const options = {
  // 基础配置
  lalyLtn: {
    src: '/images/listen.png',
    title: '标题',
    icon: '/images/zjst.png'
  },
  info: [{
      src: '/images/nullPic.png',
      title: '专辑三'
    }
  ],
  // 请求数据
  getData: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:5000/api/musicData',
        success: function(res) {
          /**
           * 在这个位置处理数据格式
           */
          resolve(res.data)
        },
        fail: function (err) {
          reject(`数据请求失败: ${err}`)
        }
      })
    })
  }
}

exports.options = options
