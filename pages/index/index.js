//index.js
import navItem from '../../utils/navItem.js';
// 导入请求函数
import {
  getIndexBanner,
  getRecommendList,
  getTopList
} from '../../utils/ajax.js';
Page({
  data: {
    bannerList: [], //轮播图数据
    navItem: [], //公共导航栏
    recommendList: [], //推荐歌单数据
    TopList: [] //音乐排行榜数据
  },
  //跳转至每日推荐歌曲页面
  toRecommendSong(event) {
    //console.log(event);
    let title = event.currentTarget.dataset.title;
    if (title === '每日推荐') {
      wx.navigateTo({
        url: '/pages/recommendSong/recommendSong'
      });
    }
  },
  //请求数据
  async onLoad() {
    this.setData({
      navItem
    });
    //获取首页轮播图数据
    const result = await getIndexBanner(1);
    const bannerList = [...result.banners];
    // 获取首页推荐歌单数据
    const res = await getRecommendList(30);
    const recommendList = res.result;
    this.setData({
      bannerList,
      recommendList
    });

    //获取音乐排行榜数据

    let idx = 0;
    let TopList = [];
    while (idx < 5) {
      const topListData = await getTopList(idx++);
      let topItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3)
      };
      //topItem:{name:string,tracks:array}
      TopList.push(topItem);
      this.setData({
        TopList
      });
    }
  }
});
