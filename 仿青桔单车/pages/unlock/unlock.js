var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()

Page({
  data: {
    loading: true,
    longitude: 0,
    latitude: 0,
    markers: [],
    scale: 16,
    status:'开锁中',
    kilometre:0,
    minute:0,
    charge:0
  },
  onLoad() {
    // 实例化API核心类
    wx.getLocation({
      success: (res) => {
        this.setData({
          longitude:res.longitude,
          latitude:res.latitude
        })
        this.riding(res);
      }
    }) 
    qqmapsdk = new QQMapWX({
      key: 'ZDDBZ-YRCLQ-5XM5R-GNEDY-ERXPJ-OGBFB'
    });
    qqmapsdk.calculateDistance({
      mode: "walking",
      to: [{
        latitude: 28.674758328257077,
        longitude: 115.95637595764161
      }],
      success: (res) => {
        console.log('距离');
        console.log(res);
      },
      fail: function (res) {
        console.log('距离');
        console.log(res);
      },
      complete: function (res) {
        console.log('距离');
        console.log(res);
      }
    });
  }, 
  onReady() {
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
  },
  toReset() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.riding(res);
      }
    })
  }, 
  toRepair(){
    wx.navigateTo({
      url: '/pages/repair/repair'
    })
  },
  toLock() {
    wx.navigateTo({
      url: '/pages/end/end'
    })
  },
  charge(){
    wx.navigateTo({
      url: '/pages/charge/charge',
    })
  },
  // 重置骑行中的单车
  riding(res){
    this.mapCtx.moveToLocation();
    let longitude = res.longitude;
    let latitude = res.latitude;
    // 初始化骑行中的单车
    let markers = [{
      "id": 0,
      "iconPath": "/images/map-bicycle.png",
      "callout": {},
      "longitude": longitude,
      "latitude": latitude,
      "width": 52.5,
      "height": 30
    }]
    this.setData({
      scale: 18,
      longitude,
      latitude,
      markers
    })
    //模拟开锁过程 几时3秒
    setTimeout(() => {
      let callout = "markers[" + 0 + "].callout";
      this.setData({
        loading: false,
        status: '解锁成功',
        [callout]: {
          "content": '骑行中',
          "color": "#ffffff",
          "fontSize": "16",
          "borderRadius": "50",
          "padding": "10",
          "bgColor": "#0082FCaa",
          "display": 'ALWAYS'
        }
      })
    }, 3000)
  }
})