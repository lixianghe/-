const option = require('./httpOpt.js')

const getData = (key, query) => {
  return new Promise((resolve, reject) => {
    if (option.api === 0) {
      resolve(option.showData[key])
    } else if(option.api === 1) {
      wx.request({
        url: option.url[key].url,
        method: option.url[key].method,
        data: query,
        success: function(res) {
          let result = option.formation[key](res.data)
          resolve(result)
        },
        fail: function (err) {
          reject(`数据请求失败: ${err}`)
        }
      })
    }
  })
}



exports.getData = getData
