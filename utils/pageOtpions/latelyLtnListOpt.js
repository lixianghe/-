// 最近收听--->专辑列表

const options = {
  // 基础配置
  // 数据为空时的状态图片
  noContent: '/images/nullContent.png',
  // 静态数据
  data: [
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":0,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":1,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":2,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":3,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":4,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":5,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":6,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":7,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":8,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":9,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":10,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":11,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
    {
      "name":"若是没有身份吃醋都要把握分寸",
      "songpic":"http://p4.music.126.net/6cBvZ0GztcW-J5lw1kb0Mg==/109951165285986646.jpg",
      "index":12,
      "id":1471235612412,
      "pid":0,"duration":294000,
      "url":"https://win-web-rg01-sycdn.kuwo.cn/325c0a8cabd12ef0b2cfeb510bb2b771/5f81672f/resource/n3/36/94/3100927403.mp3",
      "dt":"04:54"
    },
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
