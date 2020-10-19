// 一些基础配置，比如按钮个数
const btnConfig = {
  // mini player按钮配置
  miniBtns: [
    {
      name: 'pre',
      img: '../../static/images/pre.png',
    },
    {
      name: 'toggle',
      img: {
        stopUrl: '../../static/images/stop.png' ,
        playUrl: '../../static/images/play.png'
      }
    },
    {
      name: 'next',
      img: '../../static/images/next.png'
    }
  ],
  // 播放详情页面按钮配置
  playInfoBtns: [
    {
      name: 'pre',
      img: '../../static/images/pre2.png',
    },
    {
      name: 'toggle',
      img: {
        stopUrl: '../../static/images/stop2.png' ,
        playUrl: '../../static/images/play2.png'
      }
    },
    {
      name: 'next',
      img: '../../static/images/next2.png'
    },
    {
      name: 'more',
      img: '../../static/images/more2.png'
    }
  ]
}

export default btnConfig