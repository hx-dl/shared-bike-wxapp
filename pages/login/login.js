// pages/register/register.js
const app = getApp();
let utils = app.utils;

Page({
  data: {
    show: false,
    phoneText: '',
    smsText: '',
    time: 30,
    showTime: false,
    btnText: "获取验证码",
    sms_disable: 'disable',
    btn_disable: 'disable',
    toNext: '',
    handleClick:'handleClick'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 手机号输入
  input(e) {
    let value = e.detail.value;
    value = value.replace(/[\u4E00-\u9FA5`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-\sa-zA-Z]*/g, "");
    let result = [];
    for (let i = 0; i < value.length; i++) {
      if (i == 3 || i == 7) {
        result.push(" ", value.charAt(i));
      }
      else {
        result.push(value.charAt(i));
      }
    }
    this.setData({
      phoneText: result.join("")
    })
    if (this.data.phoneText.length == 13) {
      this.setData({
        sms_disable: '',
        show:true
      })
      if (this.data.smsText.length == 4){
        this.setData({
          btn_disable: ''
        })
      }
    } else {
      this.setData({
        sms_disable: 'disable',
        toNext: '',
        btn_disable: 'disable',
        show: false
      })
    }
    // console.log(this.data.phoneText.length)
  },
  //验证码输入
  smsinput(e) {
    var value = e.detail.value;
    value = value.replace(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-\sa-zA-Z]*/g, "");
    this.setData({
      smsText: value
    })
    console.log(this.data.smsText.length)
    if (value.length == 4 && this.data.phoneText.length == 13){
      this.setData({
        btn_disable:'',
        toNext: 'toNext'
      })
    }else{
      this.setData({
        btn_disable: 'disable',
        toNext:'',

      })
    }
  },
  //清空输入框内容
  cleanInput() {
    this.setData({
      smsText:'',
      phoneText: '',
      sms_disable: 'disable',
      btn_disable: 'disable',
      toNext: '',
      show: false
    })
  },
  // 发送验证码
  handleClick() {
    var phoneNumber = this.data.phoneText.replace(/\s+/g, "");
    if (!this.toCheck(phoneNumber)) {
      console.log('手机号校验失败');
      wx.showToast({
        title: '手机号码不正确',
        image: '/images/warning.png',
        success: () => {
          this.setData({
            phoneText: '',
            show: false,
            smsText: '',
            toNext: '',
            btn_disable: 'disable'
          })
        }
      })
    } else {
      wx.setStorage({
        key: "phone",
        data: phoneNumber
      })
      this.setData({
        sms_disable: 'disable',
        handleClick: '',
        showTime: true,
        btnText: '秒后重发'
      })
      // 验证码倒计时
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          let time = this.data.time;
          time--;
          this.setData({
            time,
            handleClick: '',
            sms_disable: 'disable'
          })
          if (time == 0) {
            this.setData({
              time: 30,
              showTime: false,
              btnText: '重新获取',
              sms_disable: '',
              handleClick: 'handleClick'
            })
          }
        }, i * 1000)
      }
    }
  },
  // 下一步按钮
  toNext(info) {
    var phoneNumber = this.data.phoneText.replace(/\s+/g, "");
    if (!this.toCheck(phoneNumber)) {
      console.log('手机号校验失败');
      wx.showToast({
        title: '手机号码不正确',
        image: '/images/warning.png',
        success: () => {
          this.setData({
            phoneText: '',
            show: false,
            smsText: '',
            toNext: '',
            btn_disable: 'disable'
          })
        }
      })
    }else{
      wx.setStorage({
        key: "loginStatus",
        data: 1
      })
      app.globalData.loginStatus = 1;
      console.log(app.globalData.loginStatus)
      wx.redirectTo({
        url: '/pages/userCenter/userCenter'
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/init/init'
        })
      },500)
    }
  },
  // 正则校验手机号
  toCheck(str){
    // 定义手机号的正则
    var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    //拿到去除空格后的手机号
    // 校验手机号
    return isMobile.test(str);
  }
})