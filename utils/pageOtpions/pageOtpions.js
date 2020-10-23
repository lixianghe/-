// 一些基础配置，比如按钮个数
const btnConfig = {
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
  ]
}

export default btnConfig