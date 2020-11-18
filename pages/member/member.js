const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
import { getInfo } from '../../developerHandle/playInfo'
import { vipList } from '../../utils/httpOpt/api'

// const { getData } = require('../../utils/https')

// 记录上拉拉刷新了多少次
let scrollTopNo = 0

// 选择的选集
let selectedNo = 0
Page({
  mixins: [require('../../developerHandle/abumInfo')],
  data: {
    vipList: [],
    // vipList: [
    //   {
    //     cardBasicId: 1,
    //     cardOriginPrice: 0,
    //     cardPrice: 348,
    //     cardSort: 8,
    //     cardTitle: '年卡',
    //     cardType: 1,
    //     isAdvertise: false,
    //     isMonthPrice: 1,
    //     lastMonthPrice: null,
    //     linkUrl: null,
    //     productId: 1709,
    //     subTitle: '凯叔三国演义、口袋神探、恐龙战士等，全年畅听',
    //     tagDesc: '',
    //     tagHeight: 0,
    //     tagUrl: '',
    //     tagWidth: 0,
    //   },
    //   {
    //     cardBasicId: 4,
    //     cardOriginPrice: 0,
    //     cardPrice: 98,
    //     cardSort: 5,
    //     cardTitle: '季卡',
    //     cardType: 5,
    //     isAdvertise: false,
    //     isMonthPrice: 1,
    //     lastMonthPrice: null,
    //     linkUrl: null,
    //     productId: 2464,
    //     subTitle: '',
    //     tagDesc: '额外送14天',
    //     tagHeight: 0,
    //     tagUrl: '',
    //     tagWidth: 0,
    //   },
    //   {
    //     cardBasicId: 2,
    //     cardOriginPrice: 0,
    //     cardPrice: 40,
    //     cardSort: 1,
    //     cardTitle: '月卡',
    //     cardType: 2,
    //     isAdvertise: false,
    //     isMonthPrice: 1,
    //     lastMonthPrice: null,
    //     linkUrl: null,
    //     productId: 1710,
    //     subTitle: '西游记、小马宝莉等10000+故事，全年畅听',
    //     tagDesc: '',
    //     tagHeight: 0,
    //     tagUrl: '',
    //     tagWidth: 0,
    //   }
    // ],
    showInfo: false,
    info: null
  },
  onReady() {},
  async onLoad(options) {
    this.getList()
  },
  getList() {
    vipList().then(res => {
      console.log('res', res.vipPackage)
      let vipList = res.vipPackage
      this.setData({vipList: vipList})
    })
  },
  showInfo(e) {
    let info = e.currentTarget.dataset.info
    this.setData({
      showInfo: true,
      info: info
    })
  },
  close() {
    this.setData({
      showInfo: false,
      info: null
    })
  }
})
