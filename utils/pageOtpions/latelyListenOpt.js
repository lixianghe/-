// 最近收听（专辑）

const options = {
  // 基础配置
  // 数据为空时的状态图片
  noContent: '/images/nullContent.png',
  // 静态数据
  info: [
  ],
  // 请求数据
  getData: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:5000/api/musicData',   // 请求接口url
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
