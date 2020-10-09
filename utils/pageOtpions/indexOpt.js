const options = {
  // 基础配置
  lalyLtn: {
    src: '/images/zjbf.jpg',
    title: '最近播放',
    icon: '/images/zjst.png'
  },
  // 静态数据
  info: [{
      src: 'http://p1.music.126.net/pq6wgGmqiseGTVlNrP0Mkw==/109951164948535052.jpg',
      title: '超好听的翻唱合集'
    }, 
    {
      src: 'http://p3.music.126.net/M-Are2JONsEGnOWOtNGomg==/109951164906980396.jpg',
      title: '睡前轻快音乐'
    },
    {
      src: 'http://p3.music.126.net/UOhYjUFS7V-_RgXxQmrRKw==/109951165088874864.jpg',
      title: '甜甜夏日'
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
