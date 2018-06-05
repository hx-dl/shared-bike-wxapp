// pages/login/login.js
const app = getApp();
Page({
  data: {
    inputText:'',
    disable: 'disable',
    toNext:''
  },
  //实现输入手机号自动分段，提升用户体验
  input(e){
    var value = e.detail.value;
    value = value.replace(/\s*/g, "");
    var result = [];
    for (var i = 0; i < value.length; i++) {
      if (i == 3 || i == 7) {
        result.push(" ",value.charAt(i));
      }
      else {
        result.push(value.charAt(i));
      }
    }
    this.setData({
      inputText: result.join("")
    })
    if (this.data.inputText.length == 13){
      this.setData({
        disable:'',
        toNext: 'toNext'
      })
    }else{
      this.setData({
        disable: 'disable',
        toNext: ''
      })
    }
    // console.log(this.data.inputText.length)
  },
  toNext(){
    // 定义手机号的正则
    var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    //拿到去除空格后的手机号
    var phoneNumber = this.data.inputText.replace(/\s+/g, "");
    console.log(phoneNumber)
    // 校验手机号
    if(isMobile.test(phoneNumber) == false){
      console.log('手机号校验失败');
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
        showCancel: false,
        success:()=>{
          this.setData({
            inputText:''
          })
        }
      })
    }else{
      wx.setStorage({
        key: "phone",
        data: this.data.inputText
      })
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
  },
  cleanInput(){
    this.setData({
      inputText: '',
      disable: 'disable',
      toNext: ''
    })
  }
})