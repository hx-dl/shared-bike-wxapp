// pages/homepage/index.js

import { BICYCLE } from '../../config/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 116.397390,
    latitude: 39.908860,
    markers: [],
    mapText:'你在这里',
    topText:'仿🍊单车 by 行无忌',
    scale: 17
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    wx.getLocation({
      success: (res) => {
        console.log(res)
        let longitude = res.longitude;
        let latitude = res.latitude;
        this.setData({
          longitude,
          latitude
        }) 
        this.tocreate(res)
      }
    })
  },
  onReady() {
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
    console.log(this.mapCtx);
  },
  //复位按钮
  toReset(){
    //调回缩放比，提升体验
    setTimeout(()=>{
      this.setData({
        scale: 17
      })
    },1000)
    this.mapCtx.moveToLocation();
  }, 
  // 跳转到个人中心
  toUser(){
    wx.navigateTo({
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
  toScan(){
    wx.scanCode({
      success: (res) => {
        onlyFromCamera: false,
          console.log(res)
      }
    })
  },
  showbicycle(){
      this.mapCtx.getCenterLocation({
        success: (res) => {
          this.setData({
            markers: []
          })
          this.tocreate(res)
        }
      })  
  },
  //随机函数，根据所在地  模拟请求数据单车数据生成单车
  tocreate(res) {
    var markers = this.data.markers;
    var ran = Math.ceil(Math.random() * 30);
    // console.log(ran);
    for(var i = 0; i < ran; i++) {
      // 定义一个临时单车对象
      var t_bic = {
        "id": 0,
        "iconPath": "/images/map-bicycle.png",
        "latitude": 0,
        "longitude": 0,
        "width": 52.5,
        "height": 30
      }
      // 随机条件
      var sign_a = Math.random();
      var sign_b = Math.random();
      var a = (Math.ceil(Math.random() * 50)) * 0.0001;
      var b = (Math.ceil(Math.random() * 99)) * 0.0001;
      t_bic.id = i;
      t_bic.longitude = (sign_a > 0.5 ? res.longitude + a : res.longitude - a);
      t_bic.latitude = (sign_b > 0.5 ? res.latitude + b : res.latitude - b);
      markers.push(t_bic);
    }
    // console.log(markers)
    setTimeout(()=>{
      this.setData({
        markers
      })
    }) 
  }
})
