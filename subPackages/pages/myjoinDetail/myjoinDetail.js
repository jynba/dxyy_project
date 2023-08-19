const app = getApp()
const db = wx.cloud.database();
const activity = db.collection('activity');
const _ = db.command;
Page({
    data: {
        defaultSrc: "/images/01.png",
        defaultDes: "打卡信息描述",
        markers: [],
        polyline: [],
        isCanDraw: false,
        userInfo: "",
        user: {},
        active: 0,
        itemDate: "2023/3/26",
        itemHost: "jy",
        itemMessage: "",
        itemName: "test",
        itemRaceSystem: "个人赛",
        users: [],
        id: "",
    },
    onLoad(options) {
        let that = this;
        let clientId = wx.getStorageSync('clientId');
        console.log(options);
        let id = options.id;
        activity
            .doc(id)
            .get()
            .then(res => {
                console.log(res.data);
                let { active, itemDate, itemHost, itemMessage, itemName, itemRaceSystem, markers, users } = res.data
                let user = users.find(item => item.clientId == clientId);
                let polyline = user.polyline
                markers.push({
                    latitude: polyline[0].points[0].latitude,
                    longitude: polyline[0].points[0].longitude,
                    id: 20,
                    iconPath: '/images/location_green.png',
                    width: 30,
                    height: 30,
                    anchor: {
                        x: 0.5,
                        y: 0.9
                    }
                })
                that.setData({
                    id, users, user, active, itemDate, itemHost, itemMessage, itemName, itemRaceSystem, markers, polyline
                })
                that.init()
            })
    },
    onShow() {
    },
    
    init() {
        let that = this;
        const mapCtx = wx.createMapContext('myMap', this)
        const points = this.data.polyline[0].points
        mapCtx.includePoints({
            points,
            padding: [90, 60, 150, 60],
        })
        mapCtx.moveAlong({
            markerId: 20,
            autoRotate: false,
            path: points,
            duration: 15000,
            success: function () {
                console.log("调用成功");
            },
            fail: function () {
                that.init(); 
            }
        })
    },

    handleClose() {
        this.setData({
            isCanDraw: !this.data.isCanDraw
        })
    },
    startDraw() {
        console.log("213");
        this.setData({
            userInfo: "/images/person.png",
            isCanDraw: true // 开始绘制海报图
        })
    },
    goRanking() {
        let users = this.data.users;
        users.sort(function (a, b) {
            if (a.reachPoints !== b.reachPoints) {
                // reachPoints从大到小
                return b.reachPoints - a.reachPoints;
            } else {
                // costTime从小到大排序
                return a.costTime - b.costTime;
            }
        });
        users = JSON.stringify(users);
        wx.navigateTo({
            url: '/subPackages/pages/ranking/ranking?id=' + this.data.id + '&users=' + users
        })
    },
    goToMoments() {
        let { teamId } = this.data.user
        wx.navigateTo({
            url: '/subPackages/pages/moments/moments?id=' + this.data.id + '&teamId=' + teamId
        })
    },
    goToMomentsDetail() {
        wx.navigateTo({
            url: '/pages/community/community'
        })
    },
    goToShare() {
        let { user, itemDate, itemHost, itemMessage, itemName, itemRaceSystem, active, users } = this.data
        let usersLen = users.length;
        let data = JSON.stringify({ usersLen, user, itemDate, itemHost, itemMessage, itemName, itemRaceSystem, active });
        wx.navigateTo({
            url: '/subPackages/pages/shareCard/shareCard?id=' + this.data.id + '&data=' + data
        })
    }

})
