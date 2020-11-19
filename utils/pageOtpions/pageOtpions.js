// 一些基础配置，比如按钮个数
const btnConfig = {
  // 小程序的主色值
  colorOptions: {
    // 进度条、播放全部、登录按钮色值
    mainColor: '#fa6500',
    // 小程序背景色值
    bgColor: '#151515'
  },
  // 选集按钮是否展示
  selectWordBtn: true,
  // 进度条是否展示
  percentBar: true,
  // mini player按钮配置
  miniBtns: [
    {
      name: 'pre',
      img: '/images/pre.png',
    },
    {
      name: 'toggle',
      img: {
        stopUrl: '/images/stop.png' ,
        playUrl: '/images/play.png'
      }
    },
    {
      name: 'next',
      img: '/images/next.png'
    }
  ],
  // 播放详情页面按钮配置
  playInfoBtns: [
    {
      name: 'pre',                                             // 上一首
      img: '/images/pre2.png',                                 // 上一首对应的图标
    },
    {
      name: 'toggle',                                          // 播放/暂停
      img: {
        stopUrl: '/images/stop2.png' ,                         // 播放状态的图标
        playUrl: '/images/play2.png'                           // 暂停状态的图标
      }
    },
    {
      name: 'next',                                             // 下一首
      img: '/images/next2.png'                                  // 下一首对应的图标
    },
    {
      name: 'like',                                             // 收藏
      img: {
        noLike: '/images/info_like_no.png' ,                    // 未收藏的图标
        liked: '/images/info_like.png'                          // 已收藏的图标
      }
    },
    {
      name: 'loopType',                                         // 循环模式
      img: {
        listLoop: '/images/listLoop.png' ,                      // 列表循环对应的图标
        singleLoop: '/images/singleLoop.png',                   // 单曲循环对应的图标
        shufflePlayback: '/images/shufflePlayback.png'          // 随即循环对应的图标
      }
    },
    {
      name: 'more',                                             // 弹出播放列表
      img: '/images/more2.png'                                  // 弹出播放列表对应的图标
    }
  ],
  personalCenter: [{
    type: 'order',
    icon: '/images/icon-personCenter.png',
    title: '开通/续费会员'
  }, {
    type: 'coupon',
    icon: '/images/icon-personCenter.png',
    title: '我喜欢的' 
  }, {
    type: 'latelyListen',
    icon: '/images/icon-personCenter.png',
    title: '最近收听' 
  }, {
    type: 'VIP',
    icon: '/images/icon-personCenter.png',
    title: '我购买的0'
  }]
}

export default btnConfig