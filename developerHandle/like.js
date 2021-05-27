/**
 * @name: like
 * 开发者编写的最近收听like,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels: [
 *   {value: 'album', label: '专辑'},
 *   {value: 'media', label: '故事'}
 * ]
 * 2、_getList函数，这里我们给开发者提供labels对应点击的的值，其余参数开发者自行添加；
 *    _getList函数获取的list最终转换为模板需要的字段，并setData给info。
 * 3、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下以本页列表数据为例
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.src = item.coverUrl                                  // 歌曲的封面
      item.contentType = 'album'                                // 类别（例如专辑或歌曲）
      item.isVip = true                                         // 是否是会员
    })
 * 4、likePic: ['/images/info_like.png', '/images/info_like_no.png'],
 * 收藏和取消收藏图片
 */
import tool from '../utils/util'
const app = getApp();
import {
  albumFavorite,
  mediaFavorite,
  albumFavoriteCancel,
  albumFavoriteAdd,
  mediaFavoriteCancel,
  mediaFavoriteAdd,
  mediaUrlList,
  albumMedia,
} from "../utils/httpOpt/api";
import { getMedia,isFavorite } from '../developerHandle/playInfo'
module.exports = {
  data: {
    info: [],
    showModal: false,
    req: false,
    likePic: ["/images/info_like.png", "/images/info_like_no.png"],
    labels: [
      { value: "album", name: "专辑" },
      { value: "media", name: "故事" },
    ],
    scrollLeft: 0,
  },
  onShow() {
    if (!app.userInfo.token) {
      wx.switchTab({
        url: "/pages/personalCenter/personalCenter",
      });
    }
  },
  onLoad(options) {
    this._getList(this.data.labels[0].value);
  },
  onReady() {},
  // 跳转到播放详情界面
  linkAbumInfo(e) {
    let id = e.currentTarget.dataset.id;
    const src = e.currentTarget.dataset.src;
    const title = e.currentTarget.dataset.title;
    wx.setStorageSync("img", src);
    const routeType = e.currentTarget.dataset.contentype;
    let url;
    if (routeType === "album") {
      url = `../abumInfo/abumInfo?id=${id}&title=${title}&routeType=${routeType}`;
      wx.navigateTo({
        url: url,
      });
    } else if (routeType === "media") {
      let opt = {
        mediaId: id,
        contentType: "story",
      };
      mediaUrlList(opt).then((res2) => {
        let canplay = res2.mediaPlayVoList;
        canplay.map((item, index) => {
          item.title = item.mediaName;
          item.id = item.mediaId;
          item.dt = item.timeText;
          item.coverImgUrl = item.coverUrl;
          item.dataUrl = item.mediaUrl;
        });

        wx.setStorageSync("canplay", canplay);
        url = `../playInfo/playInfo?id=${id}`;
        wx.navigateTo({
          url: url,
        });
      });
    }
  },
  selectTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTap: index,
      req: false,
      scrollLeft: 0,
    });
    wx.showLoading({
      title: "加载中",
    });
    this._getList(this.data.labels[index].value);
  },
  _getList(value) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    if (value == "album") {
      this.getAlbum(currentPage.options.playing);
    } else if (value == "media") {
      this.getMedia(currentPage.options.playing);
    }
  },
  getAlbum(playing) {
    let params = {
      pageNum: 1,
      pageSize: 20,
    };
    albumFavorite(params)
      .then((res) => {
        let layoutData = [];
        res.albumList.forEach((item) => {
          layoutData.push({
            id: item.albumId,
            title: item.albumName,
            src: item.coverUrl,
            contentType: "album",
            isVip:
              item.feeType == "01" &&
              (item.product ||
                (item.product &&
                  [2, 3].indexOf(item.product.vipLabelType) < 0)),
          });
        });
        this.setData({
          info: layoutData,
          req: true,
        });
        playing = true
        if(playing && layoutData.length) this.pathPlay(layoutData[0])
        if (layoutData.length === 0) {
          this.setData({
            showModal: true,
          });
        }
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },
  getMedia() {
    let params = {
      pageNum: 1,
      pageSize: 20,
    };
    mediaFavorite(params)
      .then((res) => {
        let layoutData = [];
        res.list.forEach((item) => {
          layoutData.push({
            id: item.mediaId,
            title: item.mediaName,
            src: item.coverUrl,
            contentType: "media",
          });
        });
        this.setData({
          info: layoutData,
          req: true,
        });
        if (layoutData.length === 0) {
          this.setData({
            showModal: true,
          });
        }
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },
  like(e) {
    if (e.detail.contentType === "album") {
      this.likeAbum(e.detail.flag, e.detail.typeid);
    } else if (e.detail.contentType === "media") {
      this.likeMedia(e.detail.flag, e.detail.typeid);
    }
  },
  likeAbum(flag, id) {
    let { info } = this.data;
    if (flag) {
      albumFavoriteCancel({ albumId: id }).then((res) => {
        wx.showToast({ icon: "none", title: "取消收藏成功" });
        this.setData({
          existed: false,
          info: info.filter((item) => item.id != id) || [],
        });
      });
    } else {
      albumFavoriteAdd({ albumId: id }).then((res) => {
        wx.showToast({ icon: "none", title: "收藏成功" });
        this.setData({
          existed: true,
        });
      });
    }
  },
  likeMedia(flag, id) {
    let { info } = this.data;
    if (flag) {
      mediaFavoriteCancel({ mediaId: id }).then((res) => {
        wx.showToast({ icon: "none", title: "取消收藏成功" });
        this.setData({
          existed: false,
          info: info.filter((item) => item.id != id) || [],
        });
        let minibar = this.selectComponent("#miniPlayer");
        minibar.setOnShow();
      });
    } else {
      mediaFavoriteAdd({ mediaId: id }).then((res) => {
        wx.showToast({ icon: "none", title: "收藏成功" });
        this.setData({
          existed: true,
        });
        let minibar = this.selectComponent("#miniPlayer");
        minibar.setOnShow();
      });
    }
  },
  close() {
    this.setData({ showModal: false });
  },
  async pathPlay(item){
      let [canplay, idList, auditionDurationList, total] = [[], [], [], 0]
      try {
        let res = await albumMedia({pageNum: 1, albumId: item.id})
        total = res.totalCount
        // 处理字段不一样的情况
        res.mediaList.map((item, index) => {
          idList.push(item.mediaId)
          auditionDurationList.push(item.auditionDuration)
        })
        // 获取带url的list
        let opt = {
          mediaId: idList.toString(),
          contentType: 'story'
        }
        let res2 = await mediaUrlList(opt)
        canplay = res2.mediaPlayVoList
        canplay.map((item, index) => {
          item.title = item.mediaName
          item.id = item.mediaId
          item.dt = item.timeText
          item.coverImgUrl = item.coverUrl
          item.auditionDuration = auditionDurationList[index]
          item.dataUrl = item.mediaUrl
          return item
        })
        wx.setStorageSync('canplay',canplay)
        wx.setStorageSync('canplaying', canplay)
        wx.setStorageSync('abumInfoName', item.title)
        wx.setStorageSync('abumInfoId', item.id)
        wx.setStorageSync('total', total)
        wx.setStorageSync('currentPageNo', 1)
        let noOrderList = tool.randomList(JSON.parse(JSON.stringify(canplay)))
        wx.setStorageSync('noOrderList', noOrderList)
        app.globalData.songInfo = canplay[0]
        let that = this
        if (getMedia) await getMedia({
          mediaId: app.globalData.songInfo.id,
          contentType: 'story'
        }, that)
        if (!app.globalData.songInfo.dataUrl) {
          wx.hideLoading()
          wx.showToast({
            title: '该内容为会员付费内容，请先成为会员再购买收听~',
            icon: 'none'
          })
          wx.stopBackgroundAudio()
          return
        }
        // 判断是否收藏
        if (app.userInfo && app.userInfo.token) {
          isFavorite({mediaId: app.globalData.songInfo.id}, that)
        }else{
          that.setData({
            existed:false
          })
        }
        app.playing(null, that)
      } catch (error) {
        wx.setStorageSync('canplay',[])
      }
  }
};
