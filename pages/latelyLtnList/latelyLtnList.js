import {options as layLisOpt} from '../../utils/pageOtpions/latelyListenOpt'
const app = getApp()

Page({
  data: {
    noContent: layLisOpt.noContent,
    list: [
      {musicName: '音乐标题', time: '04:10'},
      {musicName: '音乐标题', time: '04:10'},
      {musicName: '音乐标题', time: '04:10'},
      {musicName: '音乐标题', time: '04:10'}
    ]
  },
  onLoad(options) {
    
  },
  onShow() {

  }
})