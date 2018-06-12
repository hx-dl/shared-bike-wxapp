var amapFile = require('../../libs/amap-wx.js');
// 实例化API核心类
var myAmapFun = new amapFile.AMapWX({ key: '3ceda24f073cb81026899a937b3c7422' });
const app = getApp()

Page({
  data: {
    loading: true,
    longitude: 0,
    latitude: 0,
    markers: [],
    scale: 16,
    status:'开锁中',
    minute:0,
    second:0,
    cost:1,
    distance: 0
  },
  onLoad() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude:res.longitude,
          latitude:res.latitude
        })
        this.riding(res);
        wx.setStorage({
          key: 'startpoint',
          data: res
        })
      } 
    }) 
  }, 
  onReady() {
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
  },
  toReset() {
    this.mapCtx.moveToLocation();
    wx.getStorage({
      key: 'startpoint',
      success: (e) => {
        this.mapCtx.getCenterLocation({
          success: (res) => {
            myAmapFun.getRidingRoute({
              origin: `${e.data.longitude},${e.data.latitude}`,
              destination: `${res.longitude},${res.latitude}`,
              success: (data) => {
                console.log(data)
                let points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                  let steps = data.paths[0].steps;
                  for (let i = 0; i < steps.length; i++) {
                    let poLen = steps[i].polyline.split(';');
                    for (let j = 0; j < poLen.length; j++) {
                      points.push({
                        longitude: parseFloat(poLen[j].split(',')[0]),
                        latitude: parseFloat(poLen[j].split(',')[1])
                      })
                    }
                  }
                }
                let distance = Math.floor(data.paths[0].distance / 1000);
                this.setData({
                  distance: distance,
                });
              }
            })
          }
        })
      }
    })
  }, 
  toRepair(){
    wx.showToast({
      icon:'none',
      title: '待后续完善'
    })
    // wx.navigateTo({
    //   url: '/pages/repair/repair'
    // })
  },
  toLock() {
    clearInterval(this.timer);
    this.timer = "";
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },
  charge(){
    wx.navigateTo({
      url: '/pages/charge/charge',
    })
  },
  // 重置骑行中的单车
  riding(res){
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
    //模拟开锁过程 耗时1.5秒
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
    }, 1500)
    this.Time()
    wx.setStorage({
      key: 'cost',
      data: this.cost
    })
  },
  Time(){
    let s = 0;
    let m = 0
    // 计时开始
    this.timer = setInterval(() => {
      this.setData({
        second: s++
      })
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minute: m,
            cost: Math.ceil(m / 60)
          });
        }, 1000)
      };
    }, 1000)
  }
})