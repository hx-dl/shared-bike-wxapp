//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    longitude: 0,
    latitude: 0,
    controls:[],
    windowHeight:0,
    windowWidth:0,
    markers: [{
      "id": 0,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.714621,
      "longitude": 115.82749,
      "width": 42,
      "height": 26
    },
    {
      "id": 1,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.715375,
      "longitude": 115.828924,
      "width": 42,
      "height": 26
    },
    {
      "id": 2,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.711442,
      "longitude": 115.827014,
      "width": 42,
      "height": 26
    },
    {
      "id": 3,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.71259,
      "longitude": 115.828344,
      "width": 42,
      "height": 26
    },
    {
      "id": 4,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.717671,
      "longitude": 115.825963,
      "width": 42,
      "height": 26
    },
    {
      "id": 5,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.731232,
      "longitude": 115.832978,
      "width": 42,
      "height": 26
    },
    {
      "id": 6,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.724559,
      "longitude": 115.834195,
      "width": 42,
      "height": 26
    },
    {
      "id": 7,
      "title": "去这里",
      "iconPath": "/images/markers.png",
      "latitude": 28.682892,
      "longitude": 115.858198,
      "width": 42,
      "height": 26
    }],
    scale:16
  },
  onLoad(){
    wx.getLocation({
      success: (res) => {
        let longitude = res.longitude;
        let latitude = res.latitude;
        console.log(res);
        this.setData({
          longitude,
          latitude
        })
      },
    })
    //获取设备信息，初始化地图控件
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        this.setData({
          controls: [
            {
              //定位控件
              id: 1,
              iconPath: '/images/position.png',
              position: {
                width: 40,
                height: 40,
                left: windowWidth-50,
                top: windowHeight-145
              },
              clickable: true
            },
            {
              //中心坐标
              id: 2,
              iconPath: '/images/center.png',
              position: {
                width: 80,
                height: 60,
                left: windowWidth/2 -40,
                top: windowHeight/2 -95
              }
            },
            {
              id: 3,
              iconPath: '/images/personal.png',
              position: {
                width: 40,
                height: 40,
                left: windowWidth - 50,
                top: windowHeight - 200
              },
              clickable: true
            },
            {
              id: 4,
              iconPath: '/images/banner.png',
              position: {
                width: windowWidth-16,
                height: 58,
                left: 8,
                top: 8
              }
            },
            {
              id: 5,
              iconPath: '/images/info.png',
              position: {
                width: 40,
                height: 40,
                left: windowWidth - 50,
                top: windowHeight - 255
              },
              clickable: true
            }
          ]
        })
      },
    })
  },
  onReady(){
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
    console.log(this.mapCtx)
  },
  unlock(){
    var regstatus = app.globalData.regstatus;
    console.log(regstatus);
    if (!regstatus){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success:(res)=>{
          if(res.confirm){
            wx.navigateTo({
              url: '../register/register'
            })
          }
        }
      })
    }else{
      // 扫码或者相册
      wx.scanCode({
        success: (res) => {
          onlyFromCamera: true,
          console.log(res)
        }
      })
    } 
  },
  controltap(e){
    console.log(e)
    let cid = e.controlId;
    console.log(cid);
    switch (cid){
      case 1: {
        this.mapCtx.moveToLocation();
        setTimeout(()=>{
          this.setData({
            scale: 16,
          })
        },1000)
        this.mapCtx.moveToLocation();           
      };break;
      case 3: {
        wx.navigateTo({
          url: '../my/my',
        })
      }; break;
      case 5: {
        wx.navigateTo({
          url: '../info/info',
        })
      }; break;
    }
  }
})
