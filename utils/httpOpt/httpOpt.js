// 1.服务域名
// const hostDomain = 'http://api.wecar.map.qq.com';
const hostDomain = 'http://118.24.105.14:5000';

// 2.配置数据来源 0静态数据，1接口数据  配置0时需要配置showData
const api = 1

// 3.接口地址
const url = {
  // 主页\推荐-专辑封面
  index: {method: 'POST', url: `${hostDomain}/api/index`},
  // 专辑详情-歌曲列表
  abumInfo: {method: 'GET', url: `${hostDomain}/api/abumInfo`},
  // 播放详情
  playInfo: {method: 'POST', url: `${hostDomain}/api/xxx`},
  // 个人中心-登录验证
  codeSession: {method: 'POST', url: `${hostDomain}/account/mini/code2session`}
}

// 4.处理各界面请求的数据格式，开发者按注释的数据格式进行调整
const formation = {
  /**
   * 主页\推荐-专辑封面
   * 数据格式
   * [{
   *  id: '0',  
   *   src: 'http://p1.music.126.net/pq6wgGmqiseGTVlNrP0Mkw==/109951164948535052.jpg',
   *   title: '超好听的翻唱合集'
   * },.....]
   */
  index: (res) => {
    return res
  },

  /**
   * 辑详情-歌曲列表
   * 数据格式: 
   * {
   *    total: 100,
   *    page: 1,
   *    pagesize: 10,
   *    data: [{
   *      name: '沉默是金',
   *      pid: 2,
   *      id: 1475436266,
   *      index: 0,
   *      url: 'https://music.163.com/song/media/outer/url?id=1456615795.mp3',
   *      al: {
   *        picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=774527905,3502625772&fm=26&gp=0.jpg'
   *      },
   *      dt: 177000,
   *    },
   *  ....]
   *  }
   * }
   * 
   */
  abumInfo: (result) => { 
    // const result = res ? JSON.parse(res) : null
    // console.log(result)
    return result
  },
  /**
   * 个人中心-登录验证
   * 数据格式: 
   * data: {
   *    errcode: '',
   *    data: {
   *      openid: '',
   *      session_key: '',
   *      unionid: ''
   *    }
   * }
   */ 
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
      id: '1',  
      src: 'http://p1.music.126.net/pq6wgGmqiseGTVlNrP0Mkw==/109951164948535052.jpg',
      title: '超好听的翻唱合集'
    }],
  // 专辑-歌曲列表
  getmusicList: {
    total: 100,
    page: 1,
    pagesize: 10,
    data: []
  }
}

module.exports = {
  url,
  api,
  formation,
  showData
}