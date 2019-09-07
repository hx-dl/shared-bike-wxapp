// pages/homepage/index.js
// import { BICYCLE } from '../../config/api';
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({
  key: '3ceda24f073cb81026899a937b3c7422'
});

const app = getApp();
Page({
  data: {
    //当前经纬度对
    longitude: 116.397390,
    latitude: 39.908860,
    //单车数组
    markers: [],
    //缩放比
    scale: 18,
    // 记录上一次的经纬度
    lastLongitude: 0,
    lastLatitude: 0,
    //绘制线路的数组
    polyline: [],
    distanceArr: []
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    //获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let longitude = res.longitude;
        let latitude = res.latitude;
        this.setData({
          longitude,
          latitude
        }, () => {
          this.tocreate(res) //生成随机单车
          this.mapCtx.getCenterLocation({
            type: 'gcj02',
            success: (res) => {
              //计算最近的单车
              this.nearestBic(res)
            }
          })
          wx.hideLoading(); //隐藏loading
        })

      }
    })
  },
  onReady() {
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
  },
  onHide: function() {
    //清除单车数据
    wx.removeStorage({
      key: 'bicycle'
    })
  },
  //复位按钮  已完成
  toReset() {
    //复位后调整缩放比，提升体验
    this.mapCtx.moveToLocation();
    this.setData({
      scale: 18
    })
  },
  // 跳转到个人中心
  toUser() {
    //模拟鉴权
    if (!app.globalData.loginStatus) {
      return wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
    //若为模拟登录状态直接跳转
    return wx.navigateTo({
      url: '/pages/userCenter/userCenter',
    })
  },
  // 跳转到消息
  toMsg() {
    wx.navigateTo({
      url: '/pages/messageCenter/messageCenter',
    })
  },
  // 扫码开锁
  toScan() {
    if (!app.globalData.loginStatus) {
      return wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
    return wx.scanCode({
      success: (res) => {
        onlyFromCamera: false,
        console.log('扫码成功');
        wx.navigateTo({
          url: '/pages/unlock/unlock',
        })
      }
    })
  },
  regionchange(e) {
    this.mapCtx.getCenterLocation({
      type: 'gcj02',
      success: (res) => {
        if (e.type == 'begin') {
          // 拿到起点经纬度
          this.setData({
            lastLongitude: res.longitude,
            lastLatitude: res.latitude,
            polyline: []
          })
        } else {
          // 拿到当前经纬度
          let lon_distance = res.longitude - this.data.lastLongitude;
          let lat_distance = res.latitude - this.data.lastLatitude;
          // 判断屏幕移动距离，如果超过设定的阈值，模拟刷新单车
          if (Math.abs(lon_distance) >= 0.005 || Math.abs(lat_distance) >= 0.001) {
            this.setData({
              // 清空
              markers: []
            })
            this.tocreate(res)
          }
        }
        this.nearestBic(res)
      }
    })
  },
  //随机函数，根据所在地  模拟单车经纬度数据伪造单车
  tocreate(res) {
    // 随机单车数量设置
    let markers = this.data.markers;
    let ran = Math.ceil(Math.random() * 20 + 5);
    for (let i = 0; i < ran; i++) {
      // 定义一个临时单车对象
      var t_bic = {
        "id": 0,
        "iconPath": "/images/map-bicycle.png",
        "callout": {},
        "latitude": 0,
        "longitude": 0,
        "width": 52.5,
        "height": 30
      }
      // 随机
      var sign_a = Math.random();
      var sign_b = Math.random();
      // 单车分布密集度设置
      var a = (Math.ceil(Math.random() * 99)) * 0.00002;
      var b = (Math.ceil(Math.random() * 99)) * 0.00002;
      t_bic.id = i;
      t_bic.longitude = (sign_a > 0.5 ? res.longitude + a : res.longitude - a);
      t_bic.latitude = (sign_b > 0.5 ? res.latitude + b : res.latitude - b);
      markers.push(t_bic);
    }
    // console.log(markers)
    //将模拟的单车数据暂时存储到本地
    wx.setStorageSync('bicycle', markers);
    this.setData({
      markers
    })
  },
  // 自动判断距离最近的单车的方法
  nearestBic(res) {
    // 找出最近的单车
    let markers = this.data.markers;
    let min_index = 0;
    let distanceArr = [];
    for (let i = 0; i < markers.length; i++) {
      let lon = markers[i].longitude;
      let lat = markers[i].latitude;
      // 计算距离
      let t = Math.sqrt((lon - res.longitude) * (lon - res.longitude) + (lat - res.latitude) * (lat - res.latitude));
      let distance = t;
      // 将每一次计算的距离加入数组 distanceArr
      distanceArr.push(distance)
    }
    //从距离数组中找出最小值，js是弱类型，数字不能直接比较大小。需要进行转换用 parseFloat（小数）  | parseInt（整数）
    let min = distanceArr[0];
    for (let i = 0; i < distanceArr.length; i++) {
      if (parseFloat(distanceArr[i]) < parseFloat(min)) {
        min = distanceArr[i];
        min_index = i;
      }
    }
    // console.log(distanceArr)
    // console.log(min_index)
    let callout = `markers[${min_index}].callout`;
    // 清楚旧的气泡，设置新气泡
    wx.getStorage({
      key: 'bicycle',
      success: (res) => {
        this.setData({
          markers: res.data,
          [callout]: {
            "content": '离我最近',
            "color": "#ffffff",
            "fontSize": "16",
            "borderRadius": "50",
            "padding": "10",
            "bgColor": "#0082FCaa",
            "display": 'ALWAYS'
          }
        })
      }
    })
  },
  toVisit(e) {
    let bic = e.markerId;
    wx.getStorage({
      key: 'bicycle',
      success: (res) => {
        this.route(res.data[bic])
      }
    })
  },
  route(bic) {
    // 获取当前中心经纬度
    this.mapCtx.getCenterLocation({
      success: (res) => {
        // 调用高德地图步行路径规划API
        myAmapFun.getWalkingRoute({
          origin: `${res.longitude},${res.latitude}`,
          destination: `${bic.longitude},${bic.latitude}`,
          success: (data) => {
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
            // 设置map组件polyline，绘制线路
            this.setData({
              polyline: [{
                points: points,
                color: "#ffffffaa",
                arrowLine: true,
                borderColor: "#E5B140",
                borderWidth: 1,
                width: 5,
              }]
            });
          }
        })
      }
    })
  }
})