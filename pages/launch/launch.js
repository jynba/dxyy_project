// index.js
// 获取应用实例
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

let tempList = []; //活动列表

Page({
    data: {
        showCalendar: false, //日历
        // 赛制
        raceSystemNum: '',
        raceSystemOptions: [{
            text: '赛制选择',
            value: 0
        },
        {
            text: '个人赛',
            value: 1
        },
        {
            text: '团体赛',
            value: 2
        },
        ],

        // 列表信息
        eventList: [], //活动列表一开始为空数组
        itemName: '', //活动名称
        itemHost: '', //活动主办方
        itemPassword: '', //活动密码
        itemID: '', //活动ID
        itemDate: '', //活动日期
        itemTime: '', //活动时间，暂时没用
        itemMaxPeople: 1, //活动最大人数
        itemNowPeople: '', //活动现有人数，暂时没用
        itemMessage: '', //活动描述
        // itemRaceSystem: '',//活动赛制
        launchTeamNumber: '', //队伍数目

        selectedDatestamp: '', // 选中日期的时间戳
        users: [],
        returnPosMessage: [],
        markers: [],
        modeEditTip: '', //编辑成功或前往编辑，在onshow中调整
        active: "",
    },
    // 展示日历
    onDisplayCalendar() {
        this.setData({
            showCalendar: true
        });
    },
    // 关闭日历
    onCloseCalendar() {
        this.setData({
            showCalendar: false
        });
    },
    // 获取日期
    formatDate(date) {
        date = new Date(date);
        this.setData({
            selectedDatestamp: date.getTime()
        })
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    // 选择好日期
    onConfirmDate(event) {
        this.setData({
            showCalendar: false,
            itemDate: this.formatDate(event.detail),
        });
    },
    // 将密码转为数字
    // #region
    // onChangePassword() {
    //     this.setData({
    //         itemPassword: parseInt(this.data.itemPassword)
    //     })
    // },
    // #endregion

    // 活动赛制选择
    onChangeRace(value) {
        if (value.detail == 0) {
            this.setData({
                raceSystemNum: ''
            });
        } else {
            this.setData({
                raceSystemNum: value.detail
            });
        }
    },
    // 活动模式的提示
    showModeTip() {
        Dialog.alert({
            title: '活动模式',
            message: '1.地点随机模式：由系统随机生成几个有序坐标点，参与者依次打卡\n2.地点自定义模式：发起人自定义设置坐标点，参与者依次打卡\n3.猜地点模式：发起人给出地点描述或图片等提示，参与者到达地点指定范围即可打卡',
            messageAlign: 'left',
            confirmButtonText: '了解',
        }).then(() => {
            // on close
        });
    },

    //  活动最大人数的修改
    changeMaxNumber(e) {
        this.setData({
            itemMaxPeople: parseInt(e.detail)
        })
    },

    // 队伍数目
    changeTeamNumber(e) {
        this.setData({
            launchTeamNumber: parseInt(e.detail)
        })
    },

    onShow() {
        // 先判断缓存是否有数据，有则添加到tempList中
        if (wx.getStorageSync('itemInfo') != '')
            tempList = wx.getStorageSync('itemInfo');
        // 判断是否编辑好活动模式，调整文字
        if (this.data.markers.length > 0) {
            this.setData({
                modeEditTip: '编辑成功'
            })

        } else {
            this.setData({
                modeEditTip: '前往编辑'
            })
        }
    },

    // 某项为空提示
    async emptyTips() {
        let isEmpty = false;
        if (this.data.itemName.trim() == '') {
            Toast('活动名称不能为空');
            isEmpty = true;
        } else if (this.data.itemHost.trim() == '') {
            Toast('活动主办方不能为空');
            isEmpty = true;
        } else if (this.data.itemID == '' || this.data.itemID.length < 6) {
            Toast('请输入6位活动ID');
        } else if (this.data.itemPassword == '' || this.data.itemPassword.length < 4) {
            Toast('请输入4位活动密码');
            isEmpty = true;
        } else if (this.data.itemDate == '') {
            Toast('活动时间不能为空');
            isEmpty = true;
        } else if (this.data.markers.length == 0) {
            Toast('请编辑活动模式');
            isEmpty = true;
        } else if (this.data.raceSystemNum == '') {
            Toast('请选择活动赛制');
            isEmpty = true;
        } else if (this.data.launchTeamNumber > this.data.itemMaxPeople) {
            Toast("队伍数目不得大于活动最大人数！");
            isEmpty = true;
        } else {
            // 判断id是否在数据库中已重复
            await wx.cloud.database().collection('activity')
                .where({
                    _id: this.data.itemID + this.data.itemPassword
                })
                .get()
                .then((res) => {
                    console.log('返回的数据是', res);
                    if (res.data != '') {
                        Toast('活动ID重复，请重新设置！');
                        isEmpty = true;
                    } else {
                        isEmpty = false;
                    }
                })
        }
        return isEmpty;
        //#region 
        // let requiredOption = [
        //     { item: this.data.itemName, msg: '活动名称' },
        //     { item: this.data.itemHost, msg: '主办方' },
        //     { item: this.data.itemPassword, msg: '活动密码' },
        //     { item: this.data.itemDate, msg: '活动时间' },
        //     {item:this.data.raceSystemNum,msg:'活动赛制'}
        // ]
        // let isEmpty = false;
        // for (let key in requiredOption) {
        //     if (requiredOption[key].item == '') {
        //         Toast(`${requiredOption[key].msg}不能为空`);
        //         isEmpty = true;
        //         break;
        //     }
        // }
        // return isEmpty;
        //#endregion
    },

    // 点击提交后，处理发起活动的数据
    async toConfirmLaunchActivity() {
        let isEmpty = await this.emptyTips();
        if (isEmpty) return; //判断某项是否为空
        // 1.将数据存入缓存，供首页活动列表获取
        tempList.unshift({ // 从头部添加，因为最新的活动应该展示在首页列表前方
            itemName: this.data.itemName,
            itemHost: this.data.itemHost,
            _id: this.data.itemID + this.data.itemPassword,
            itemPassword: this.data.itemPassword,
            itemDate: this.data.itemDate,
            itemMaxPeople: this.data.itemMaxPeople,
            itemMessage: this.data.itemMessage,
            itemRaceSystem: this.data.raceSystemOptions[this.data.raceSystemNum].text,
            selectedDatestamp: this.data.selectedDatestamp,
            returnPosMessage: this.data.returnPosMessage,
            markers: this.data.markers,
            launchTeamNumber: this.data.launchTeamNumber,
            active:this.data.active,
        })
        console.log(tempList);
        wx.setStorageSync('itemInfo', tempList)

        // 给上个页面传选中的时间戳
        // let pages = getCurrentPages();//页面栈
        // let prevPage = pages[pages.length-2];//上一页面
        // console.log('当前页面栈',pages);        
        // console.log('上一页面',prevPage);        
        // prevPage.setData({//直接给上移页面赋值
        //     selectedDatestamp:this.data.selectedDatestamp
        //   });

        // 2.将数据发送到云数据库中，供加入活动时查询匹配
        wx.cloud.database().collection('activity')
            .add({
                data: {
                    _id: this.data.itemID + this.data.itemPassword,
                    itemName: this.data.itemName,
                    itemHost: this.data.itemHost,
                    itemPassword: this.data.itemPassword,
                    itemDate: this.data.itemDate,
                    itemMaxPeople: this.data.itemMaxPeople,
                    itemMessage: this.data.itemMessage,
                    itemRaceSystem: this.data.raceSystemOptions[this.data.raceSystemNum].text,
                    selectedDatestamp: this.data.selectedDatestamp,
                    returnPosMessage: this.data.returnPosMessage,
                    markers: this.data.markers,
                    active: this.data.active,
                    launchTeamNumber: this.data.launchTeamNumber,
                }
            })
            .then(res => {
                console.log('活动数据添加成功', res);
            })
            .catch(err => {
                console.log('活动数据添加失败', err);
            })
        // 弹出框表示创建成功
        Dialog.alert({
            title: '创建成功',
            message: `\n活动ID：${this.data.itemID}\n\n活动密码：${this.data.itemPassword}`,
            confirmButtonText: '确定',
        }).then(() => {
            wx.navigateBack({
                delta: 0,
            })
        });
    },

    handleTap: function () {
        wx.navigateTo({
            url: '../diymap/diymap'
        })
    }

})