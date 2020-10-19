const option = require('./httpOpt')

const getData = (key, query) => {
  return new Promise((resolve, reject) => {
    if (option.api === 0) {
      resolve(option.showData[key])
    } else if(option.api === 1) {
      wx.request({
        url: option[key].url,
        method: option[key].method,
        data: query,
        success: function(res) {
          let result = formation[api](res.data)
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
