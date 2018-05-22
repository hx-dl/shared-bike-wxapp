//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    longitude: 120.128330,
    latitude: 30.222100,
    controls:[],
    windowHeight:0,
    windowWidth:0,
    markers:[],
    scale:16
  },
  onLoad(){
    wx.getLocation({
      success:(res) => {
        let longitude = res.longitude;
        let latitude = res.latitude;
        console.log(res);
        this.setData({
          longitude,
          latitude
        })
      },
    })
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
              iconPath: '/images/定位.png',
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
              iconPath: '/images/中心.png',
              position: {
                width: 80,
                height: 60,
                left: windowWidth/2 -40,
                top: windowHeight/2 -95
              }
            },
            {
              id: 3,
              iconPath: '/images/个人.png',
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
              iconPath: '/images/横幅.png',
              position: {
                width: windowWidth-16,
                height: 58,
                left: 8,
                top: 8
              }
            }
          ]
        })
      },
    })
    
  },
  onReady(){
    // 创建map上下文  保存map信息的对象
    this.mapCtx = wx.createMapContext('myMap');
    // console.log(this.mapCtx)
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
      // 待完成
      } 
  },
  controltap(e){
    // console.log(e)
    let cid = e.controlId;
    // console.log(cid);
    switch (cid){
      case 1: {
        this.mapCtx.moveToLocation();
        setTimeout(()=>{
          this.setData({
            scale: 16
          })
        },1000)   
      };break;
      case 3: {
        wx.navigateTo({
          url: '../info/info',
        })
      }
    }
  }
})
