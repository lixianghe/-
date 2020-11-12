// 1.服务域名
const hostDomainLogin = 'http://api.wecar.map.qq.com';
const hostDomain = 'http://118.24.105.14:5000';

// 2.请求方法和接口地址
const url = {
  // 主页\推荐-专辑封面
  index: {
    method: 'POST',
    url: `${hostDomain}/api/index`
  },
  // 专辑详情-歌曲列表
  abumInfo: {
    method: 'GET',
    url: `${hostDomain}/api/abumInfo`
  },
  // 播放详情
  playInfo: {
    method: 'POST',
    url: `${hostDomain}/api/xxx`
  },
  // 个人中心-登录验证
  codeSession: {
    method: 'POST',
    url: `${hostDomainLogin}/account/mini/code2session`
  }
}

// 3.处理各界面请求的数据格式，开发者按注释的数据格式进行调整
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
   *      title: '沉默是金',
   *      pid: 2,
   *      id: 1475436266,
   *      index: 0,
   *      url: 'https://music.163.com/song/media/outer/url?id=1456615795.mp3',
   *      coverImgUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=774527905,3502625772&fm=26&gp=0.jpg',
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
          unionid: res.data.unionid
        }
      }
    }
    return result
  }
}

// 4.配置数据来源 0静态数据，1接口数据  配置0时需要配置showData
const api = 1

// 5. 静态展示数据，展示界面时应用，不会请求后台服务
const showData = {
  index: [{
      id: "1",
      src: "http://p1.music.126.net/pq6wgGmqiseGTVlNrP0Mkw==/109951164948535052.jpg",
      title: "超好听的翻唱合集"
    },
    {
      id: "2",
      src: "http://p3.music.126.net/M-Are2JONsEGnOWOtNGomg==/109951164906980396.jpg",
      title: "睡前轻快音乐"
    },
    {
      id: "3",
      src: "http://p3.music.126.net/UOhYjUFS7V-_RgXxQmrRKw==/109951165088874864.jpg",
      title: "甜甜夏日"
    },
    {
      id: "1",
      src: "http://p1.music.126.net/pq6wgGmqiseGTVlNrP0Mkw==/109951164948535052.jpg",
      title: "超好听的翻唱合集"
    },
    {
      id: "2",
      src: "http://p3.music.126.net/M-Are2JONsEGnOWOtNGomg==/109951164906980396.jpg",
      title: "睡前轻快音乐"
    },
    {
      id: "3",
      src: "http://p3.music.126.net/UOhYjUFS7V-_RgXxQmrRKw==/109951165088874864.jpg",
      title: "甜甜夏日"
    }
  ],
  // 专辑-歌曲列表
  abumInfo: {
    id: 1,
    total: 5,
    pageNo: 1,
    pageSize: 10,
    data: [{
        title: "是想你的声音啊",
        episode: 1,
        id: 1481657185,
        index: 0,
        src: "https://music.163.com/song/media/outer/url?id=1481657185.mp3",
        singer: "傲七爷",
        coverImgUrl: "http://p4.music.126.net/cIR63lyPGgQ4mAyuOTg8lA==/109951165109878587.jpg",
        dt: 159121
      },
      {
        title: "他只是经过",
        episode: 2,
        id: 1443838552,
        index: 1,
        src: "https://music.163.com/song/media/outer/url?id=1443838552.mp3",
        singer: "Felix Bennett",
        coverImgUrl: "http://p4.music.126.net/wUog39IHoJb76pL0AVCFNQ==/109951165348116023.jpg",
        dt: 215381
      },
      {
        title: "爱的恰恰",
        episode: 3,
        id: 1456200611,
        index: 2,
        src: "https://music.163.com/song/media/outer/url?id=1456200611.mp3",
        singer: "宝石Gem",
        coverImgUrl: "http://p4.music.126.net/YWlJNcWJz8jo6-I31HUJBA==/109951165069475099.jpg",
        dt: 194717
      },
      {
        title: "画画的Baby",
        episode: 4,
        id: 1474342935,
        index: 3,
        src: "https://music.163.com/song/media/outer/url?id=1474342935.mp3",
        singer: "黑猫警长Giao哥",
        coverImgUrl: "http://p3.music.126.net/MuhJIkUIN2_j7Cg38t3ogQ==/109951165273552799.jpg",
        dt: 97200
      },
      {
        title: "所爱隔山海",
        episode: 5,
        id: 1348896822,
        index: 4,
        src: "https://music.163.com/song/media/outer/url?id=1348896822.mp3",
        singer: "CMJ",
        coverImgUrl: "http://p3.music.126.net/MOmuZfdM4aUBgleLUDevoA==/109951164269620044.jpg",
        dt: 112908
      }
    ]
  }
}

module.exports = {
  url,
  api,
  formation,
  showData
}