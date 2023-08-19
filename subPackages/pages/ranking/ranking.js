const activity = wx.cloud.database().collection('activity');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        users: [
        ],
        defaultUsers:[
        // 排行榜
            {
                iconPath: 'https://pica.zhimg.com/80/v2-da2b0a3b96103d87a682409fc5a261a9_1440w.webp?source=1940ef5c',//用户头像
                username: '杨雪斌',//用户昵称
                totallen: 3.34,
                reachPoints: 4,//完成地点个数
                costTime: '23'//时间
            }, {
                iconPath: 'https://picx.zhimg.com/80/v2-6c5ff4ef0bb78991ed03ab720f1b2447_1440w.webp?source=1940ef5c',//用户头像
                username: '杨智翔',//用户昵称
                totallen: 3.35,
                reachPoints: 4,//完成地点个数
                costTime: '20'//时间
            }, {
                iconPath: 'https://picx.zhimg.com/80/v2-6606555d10fd91e4b9b581f841fab966_1440w.webp?source=1940ef5c',//用户头像
                username: '杨澄晖',//用户昵称
                totallen: 2.43,
                reachPoints: 3,//完成地点个数
                costTime: '15'//时间
            },{
                iconPath: 'https://636c-cloud-4g0etb4u9d3975e2-1305558654.tcb.qcloud.la/1680437712216.jpg?sign=f8c3c32451e0e239a98b5ba94fb0560a&t=1680437750',//用户头像
                username: '许佳宇',//用户昵称
                totallen: 3.42,
                reachPoints: 2,//完成地点个数
                costTime: '23'//时间
            },
            {
                iconPath: 'https://img.wxcha.com/m00/c9/b7/6ad76b377c3d4fa68f1c32f98666d323.jpg?down',//用户头像
                username: '陈丽芳',//用户昵称
                totallen: 2.23,
                reachPoints: 2,//完成地点个数
                costTime: '18'//时间
            },
            {
                iconPath: 'https://img.wxcha.com/m00/1a/55/9bfb881ff9df9030942d60ff0a06c3c9.jpg?down',//用户头像
                username: '余子成',//用户昵称
                totallen: 2.72,
                reachPoints:  2,//完成地点个数
                costTime: '19'//时间
            },
            {
                iconPath: 'https://img.wxcha.com/m00/d9/a0/94eea9006f573b11f4f3bdf88eb8afb4.jpg?down',//用户头像
                username: '唐毅',//用户昵称
                totallen: 2.34,
                reachPoints: 1,//完成地点个数
                costTime: '16'//时间
            },
            {
                iconPath: 'https://img.wxcha.com/m00/ce/25/ef89cd675b6ee8826846b3b008181c0f.jpg?down',//用户头像
                username: '杨冬娇',//用户昵称
                totallen: 1.02,
                reachPoints: 1,//完成地点个数
                costTime: '10'//时间
            },
        ],
        isHavePeople: true,//是否有足够多的人来显示排行榜,
        isDK:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad(options) {
        console.log(options);
        if (options.users) {
            let that = this;
            let users = that.data.users;
            let addusers = JSON.parse(options.users);
            console.log(addusers);
            activity.doc(options.id).get().then(res => {
                console.log(res);
                if (addusers) {
                    if (addusers.length < 3) {
                        let defaultUsers = this.data.defaultUsers;
                        users.unshift(...defaultUsers)
                        users.push(...addusers)
                        that.setData({
                            users,
                            isDK:false
                        })
                    } else if (addusers.length >= 3) {
                        that.setData({
                            users: addusers
                        })
                    }
                }
            });

        }else{
            let defaultUsers = this.data.defaultUsers;
            this.setData({
                users:defaultUsers,
                isDK:true
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})