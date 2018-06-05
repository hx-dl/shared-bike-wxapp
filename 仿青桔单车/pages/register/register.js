// pages/register/register.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputText:'',
    time:60,
    showTime:false,
    btnText:"获取验证码"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'phone',
      success: (res) => {
        console.log(res)
        this.setData({
          inputText:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  handleClick(){
    this.setData({
      showTime:true,
      btnText:'秒后重发'
    })
    // 验证码倒计时
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        let time = this.data.time;
        time--;
        this.setData({
          time
        })
        if (time == 0) {
          this.setData({
            time:60,
            showTime: false,
            btnText: '重新获取'
          })
        }
      }, i*1000)
      
    }
  }
})