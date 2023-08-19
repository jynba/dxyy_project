import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const db = wx.cloud.database();
const _ = db.command;
Page({
    data: {
        //  加入活动有关
        showJoinActivity: false, //加入活动的底部弹出框是否展示，初始不展示，点击加入活动才展示
        teamNumber: "",//队伍编号
        activityID: "", //活动ID
        activitypassword: "", //活动密码
        activityName: "", //活动内昵称
        active: null,//活动模式
        openid: '', //用户的openid
        avatarUrl: '', //用户的头像链接
        // 列表数据展示有关
        isHaveData: false, //是否今日活动数据

        eventList: [], //活动列表一开始为空数组
    },

    onLoad() {
        const clientid = wx.getStorageSync('clientId')
        if (clientid) {
            this.setData({
                openid: clientid,
            })
        } else {
            wx.cloud.callFunction({
                name: 'getOpenid'
            }).then(res => {
                console.log("openid获取成功", res);
                // clientid  为用户id 识别单个用户发布消息和订阅消息
                wx.setStorageSync("clientId", res.result.openid);
            }).catch(err => {
                console.log("失败", err)
            })
        }
        // 拿到用户头像的链接
        let avatarUrl = wx.getStorageSync('avatarUrl');
        this.setData({
            avatarUrl
        });
    },
    onShow() {
        // 页面一打开就从缓存中读数据存到eventList
        this.getEventList();
    },
    // 获取活动列表数据
    getEventList() {
        let eventList = wx.getStorageSync('itemInfo');
        if (eventList == '') return;
        this.setData({
            eventList: eventList,
        })
        this.showByDate();
    },
    // 根据日期分类展示今日活动
    showByDate() {
        let nowDate = new Date().getTime(); //获取当前时间戳
        // 获取各个活动选定日期的时间戳
        let eventList = this.data.eventList;

        eventList = eventList.filter(item => nowDate - item.selectedDatestamp < 86400000);

        if (eventList.length > 0) {
            this.setData({
                isHaveData: true
            })
        }
        this.setData({
            eventList,
        })
    },

    // 删除某一活动 （待定）
    onDeleteItem(event) {
        let that = this;
        const {
            position,
            instance
        } = event.detail;
        switch (position) {
            case 'cell':
                console.log("点击cell");
                instance.close();
                break;
            case 'right':
                Dialog.confirm({
                    message: '确定删除吗？',
                }).then(() => {
                    let tempList = that.data.eventList;
                    let deleteIndex = tempList.findIndex(item => item._id == event.detail.name)
                    tempList.splice(deleteIndex, 1);
                    that.setData({
                        eventList: tempList
                    })
                    wx.setStorageSync('itemInfo', that.data.eventList)
                    instance.close();
                }).catch(() => {
                    console.log("取消删除");
                    instance.close();
                });
                break;
        }
    },

    //   关闭加入活动弹出框
    onCloseJoinActivity() {
        this.setData({
            showJoinActivity: false
        });
    },
    //  展示加入活动弹出框
    onOpenJoinActivity() {
        this.setData({
            showJoinActivity: true
        });
    },
    // 加入活动时某项为空提示
    emptyTips() {
        let isEmpty = false;
        if (this.data.activityID == '' || this.data.activityID.length < 6) {
            Toast('请输入6位活动ID');
            isEmpty = true;
        } else if (this.data.activitypassword == '' || this.data.activitypassword.length < 4) {
            Toast('请输入4位活动密码');
            isEmpty = true;
        } else if (this.data.activityName == '') {
            Toast('活动昵称不能为空');
            isEmpty = true;
        }
        return isEmpty;
    },
    // 数据都不为空时匹配数据库
    async matchActivity() {
        let isMatch = false;
        let that = this;
        let _id = this.data.activityID + this.data.activitypassword;
        await db.collection('activity')
            .where({
                _id: _id,
            })
            .get()
            .then(res => {
                console.log('返回的数据是', res.data[0]);
                // 查不到该id对应的活动
                if (res.data == '') {
                    Toast('活动ID或密码错误!');
                }
                else if (typeof (res.data[0].endState) !== 'undefined' && res.data[0].endState == true) {
                    isMatch = false;
                    Toast('该活动已结束!');
                }
                else if (res.data[0].itemRaceSystem == '团体赛' && ( res.data[0].launchTeamNumber !== '' && res.data[0].launchTeamNumber < that.data.teamNumber || that.data.teamNumber <= 0 ||that.data.teamNumber == "")) {
                    isMatch = false;
                    Toast('队伍编号有误!');
                }
                else {
                    isMatch = true;
                    // 2.将该活动信息存入缓存
                    let tempList = this.data.eventList;
                    let isFind = tempList.find(item => res.data[0]._id == item._id);
                    if (!isFind) {
                        tempList.unshift({ // 从头部添加，因为最新的活动应该展示在首页列表前方
                            itemName: res.data[0].itemName,
                            itemHost: res.data[0].itemHost,
                            _id: res.data[0]._id,
                            itemPassword: res.data[0].itemPassword,
                            itemDate: res.data[0].itemDate,
                            itemMaxPeople: res.data[0].itemMaxPeople,
                            itemMessage: res.data[0].itemMessage,
                            itemRaceSystem: res.data[0].itemRaceSystem,
                            selectedDatestamp: res.data[0].selectedDatestamp,
                            returnPosMessage: res.data[0].returnPosMessage,
                            markers: res.data[0].markers,
                            active: res.data[0].active,
                        })
                        // console.log(tempList);
                        this.setData({
                            eventList: tempList
                        })
                        wx.setStorageSync('itemInfo', this.data.eventList)
                    }
                }
            })
            .catch(err => {
                console.log('查询失败', err);
            })
        return isMatch;
    },
    // 确认加入活动
    async toConfirmJoinActivity() {
        if (this.emptyTips()) return; //某项是否为空
        let isMatch = await this.matchActivity(); //是否匹配
        if (!isMatch) {
            return;
        }

        this.setData({
            showJoinActivity: false
        });
        Toast.success('加入成功')
        wx.navigateTo({
            url: '/subPackages/pages/gamemap/gamemap?id=' + this.data.activityID + this.data.activitypassword + '&name=' + this.data.activityName+'&teamNumber='+this.data.teamNumber,
        })
        this.setData({
            activityID: "",
            activitypassword: "",
            activityName: "",
        })
    },
    // 点击发起活动页面跳转
    launchActivity() {
        wx.navigateTo({
            url: '/subPackages/pages/launch/launch'
        })
    }
})