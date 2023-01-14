// index.js
// 获取应用实例
const app = getApp()
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    // optionCard:['全部活动','正在进行','已结束'],
    // currentIndex:0
    show: false,
    activityID:"",
    password:"",
    activityName:"",
    active: 0
  },
    // tabBtn(index){
    //     this.currentIndex=index;
    //     console.log('lalala');
    //   }
    onClose() {
        this.setData({ show: false });
      },
      showPopup(){
        this.setData({ show: true });
      },
      onChangePwd(event){
        //监听密码输入并同步到pwd中
        this.data.password = event.detail
      },
      onInputID(event){
        this.data.activityID = event.detail
      },
      toConfirm(){
        this.setData({ show: false });
        Toast.success('加入成功')
      },
      onChange(event) {
        wx.showToast({
          // title: `切换到标签 ${event.detail.index + 1}`,
          icon: 'none'
        });
      },
      launchActivity(){
        wx.navigateTo({
          url: '/pages/launch/launch'
        })
      }
    })