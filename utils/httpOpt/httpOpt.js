// 1.服务域名
const hostDomain = 'http://api.wecar.map.qq.com';

// 2.配置数据来源 0静态数据，1接口数据  配置0时需要配置showData
const api = 0 

// 3.接口地址
const url = {
  // 主页\推荐-专辑封面
  index: {method: 'POST', url: `${hostDomain}/api/xxx`},
  // 专辑详情-歌曲列表
  abumInfoList: {method: 'POST', url: `${hostDomain}/api/xxx`},
  // 播放详情
  playInfo: {method: 'POST', url: `${hostDomain}/api/xxx`},
  // 个人中心-登录验证
  codeSession: {method: 'POST', url: `${hostDomain}/account/mini/code2session`}
}

// 4.处理各界面请求的数据格式，开发者按注释的数据格式进行调整
const formation = {
  /**个人中心-登录验证
   * 数据格式: 
   * data: {
   *    errcode: '',
   *    data: {
   *      openid: '',
   *      session_key: '',
   *      unionid: ''
   *    }
   * }
   * 
   *  */ 
  codeSession: (res) => {
    console.log(res)
    const result = {
      data: {
        errcode: res.errcode,
        data: {
          openid: res.data.openid,
          session_key: res.data.session_key,
          unionid:  res.data.unionid
        }
      }
    }
    return result
  }
}

// 5. 静态展示数据，展示界面时应用，不会请求后台服务
const showData = {
  index: [{
      id: '0',  
      src: 'http://p1.music.126.net/pq6wgGmqiseGTVlNrP0Mkw==/109951164948535052.jpg',
      title: '超好听的翻唱合集'
    }, 
    {
      id: '1',
      src: 'http://p3.music.126.net/M-Are2JONsEGnOWOtNGomg==/109951164906980396.jpg',
      title: '睡前轻快音乐'
    },
    {
      id: '2',
      src: 'http://p3.music.126.net/UOhYjUFS7V-_RgXxQmrRKw==/109951165088874864.jpg',
      title: '甜甜夏日'
    }]
  
}

module.exports = {
  url,
  api,
  formation,
  showData
}