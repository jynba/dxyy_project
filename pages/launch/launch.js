// index.js
// 获取应用实例
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

Page({
  data: {
    value: '',
    launchName:'',//活动名称
    launchHost:'',//活动主办方
    launchPassword:'',//活动密码
    launchPerNumber:'',//活动人数
    date: '',//活动时间
    show: false,
    detail:'',
    option1: [
      { text: '赛制选择', value: 0 },
      { text: '个人赛', value: 1 },
      { text: '团体赛', value: 2 },
    ],
    value1: 0,
    radio: '1',//单选框
    activeNames: ['0'],//活动模式
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  onSwitch1Change(value) {
    console.log(value.detail);
    this.setData({ detail: value.detail });

  },
    //活动模式  
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
    Dialog.confirm({
        title: '活动模式',
        message: '是否前往地图编辑',
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    
  },
  onChangeMode(event){
    this.setData({
        activeNames: event.detail,
      });
  },
  toConfirm(){
    Toast.success('创建成功')
  }
})
