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
      name: 'pre',
      img: '/images/pre2.png',
    },
    {
      name: 'toggle',
      img: {
        stopUrl: '/images/stop2.png' ,
        playUrl: '/images/play2.png'
      }
    },
    {
      name: 'next',
      img: '/images/next2.png'
    },
    {
      name: 'loopType',
      img: {
        listLoop: '/images/listLoop.png' ,
        singleLoop: '/images/singleLoop.png',
        shufflePlayback: '/images/shufflePlayback.png'
      }
    },
    {
      name: 'more',
      img: '/images/more2.png'
    }
  ]
}

export default btnConfig