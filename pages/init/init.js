// pages/homepage/index.js
import { BICYCLE } from '../../config/api';
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '3ceda24f073cb81026899a937b3c7422' });

const app = getApp();
Page({
  data: {
    longitude: 116.397390,
    latitude: 39.908860,
    markers: [],
    topText:'🍊单车改良版 by 行无忌',
    scale: 18,
    lastLongitude:0,
    lastLatitude: 0,
    polyline: [],
    distanceArr:[]
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) { 
    //获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let longitude = res.longitude;
        let latitude = res.latitude;
        this.setData({
          longitude,
          latitude
        })
        //模拟请求单车数据
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(()=>{
          wx.request({
            url: BICYCLE,
            method:'GET',
            success:(res)=>{
              wx.setStorage({
                key: 'bicycle',
                data: res.data.data.markers
              })
              this.setData({
                markers: res.data.data.markers
              })
              this.mapCtx.getCenterLocation({
                type: 'gcj02',
                success: (res) => {
                  this.nearestBic(res)
                }
              })
              wx.hideLoading();
            }
          })
        },1000)
      }
    })
  },
  onReady() {
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
  },
  onHide: function () {
    wx.removeStorage({
      key: 'bicycle',
      success:  (res) => {
        console.log('模拟单车数据已清除')
      }
    })
  },
  //复位按钮  已完成
  toReset(){
    //调回缩放比，提升体验
    setTimeout(()=>{
      this.setData({
        scale: 18
      })
    },1000)
    this.mapCtx.moveToLocation();
  }, 
  // 跳转到个人中心
  toUser(){
    if (!app.globalData.loginStatus){
      wx.showModal({
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
    }else{
      wx.navigateTo({
        url: '/pages/userCenter/userCenter',
      })
    }
  },
  // 跳转到消息  已完成
  toMsg() {
    wx.navigateTo({
      url: '/pages/messageCenter/messageCenter',
    })
  },
  // 扫码开锁
  toScan(){
    if (!app.globalData.loginStatus) {
      wx.showModal({
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
    } else {
      wx.scanCode({
        success: (res) => {
          onlyFromCamera: false,
          console.log('扫码成功');
          wx.navigateTo({
            url: '/pages/unlock/unlock',
          })
        }
      })
    }
  },
  regionchange(e){ 
    // 拿到起点经纬度
    if(e.type == 'begin') {
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          this.setData({
            lastLongitude: res.longitude,
            lastLatitude: res.latitude,
            polyline:[]
          })
        }
      })
    }
    // 拿到当前经纬度
    if (e.type == 'end') {
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          let lon_distance = res.longitude - this.data.lastLongitude;
          let lat_distance = res.latitude - this.data.lastLatitude;
          // console.log(lon_distance,lat_distance)
          // 判断屏幕移动距离，如果超过设定的阈值，模拟刷新单车
          if (Math.abs(lon_distance) >= 0.0035 || Math.abs(lat_distance) >= 0.0022){
            console.log('刷新单车')
            this.setData({
              // 清空
              markers: []
            })
            this.tocreate(res)
          }
        }
      })
    }
    this.mapCtx.getCenterLocation({
      type: 'gcj02',
      success: (res) => {
        this.nearestBic(res)
      }
    })
    
    
  },

  //随机函数，根据所在地  模拟单车经纬度数据伪造单车
  tocreate(res) {
    // 随机单车数量设置
    let markers = this.data.markers;
    console.log(markers)
    let ran = Math.ceil(Math.random() * 20);
    // console.log(ran);
    for(let i = 0; i < ran; i++) {
      // 定义一个临时单车对象
      var t_bic = {
        "id": 0,
        "title":'去这里',
        "iconPath": "/images/map-bicycle.png",
        "callout":{},
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
    wx.setStorage({
      key: 'bicycle',
      data: markers
    })
    this.setData({
      markers
    })
    
  },
  // 自动判断距离最近的单车的方法
  nearestBic(res) {
    // 找出最近的单车
    let markers = this.data.markers;
    let min_index = 0, last_min_index = 0;
    let distanceArr = [];

    for (let i = 0; i < markers.length; i++) {
      let lon = markers[i].longitude;
      let lat = markers[i].latitude;
      // 计算距离  sqrt(（x1-x2）^2 + (y1-y2)^2 )
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
    let callout = "markers[" + min_index + "].callout";
    // 清楚旧的气泡，设置新气泡
    wx.getStorage({
      key: 'bicycle',
      success: (res) => {
        // console.log(res)
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
  toVisit(e){
    let bic = e.markerId;
    wx.getStorage({
      key: 'bicycle',
      success: (res) => {
        console.log(res.data[bic])
        this.route(res.data[bic])
      }
    })
  },
  route(bic){
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
                arrowLine:true,
                borderColor: "#3CBCA3",
                borderWidth:2,
                width: 5,
              }]
            });
          }
        })
      }
    })
    
  }
})