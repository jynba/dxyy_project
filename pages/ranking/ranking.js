const activity = wx.cloud.database().collection('activity');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 第四名开始的排行榜
        joiners: [{
            avatarUrl:'https://tse3-mm.cn.bing.net/th/id/OIP-C.GEcZ2444RZwbVxng3NWL6gAAAA?w=203&h=203&c=7&r=0&o=5&dpr=2&pid=1.7',//用户头像
            activityName:'陈依扬',//用户昵称
            finishNum:1,//完成地点个数
            finishkm:2,//已跑公里数
            finishTime:40//时间
        },{
            avatarUrl:'https://pica.zhimg.com/80/v2-da2b0a3b96103d87a682409fc5a261a9_1440w.webp?source=1940ef5c',//用户头像
            activityName:'杨雪斌',//用户昵称
            finishNum:1,//完成地点个数
            finishkm:3,//已跑公里数
            finishTime:20//时间
        },{
            avatarUrl:'https://picx.zhimg.com/80/v2-6c5ff4ef0bb78991ed03ab720f1b2447_1440w.webp?source=1940ef5c',//用户头像
            activityName:'杨智翔',//用户昵称
            finishNum:1,//完成地点个数
            finishkm:1.3,//已跑公里数
            finishTime:10//时间
        },{
            avatarUrl:'https://picx.zhimg.com/80/v2-6606555d10fd91e4b9b581f841fab966_1440w.webp?source=1940ef5c',//用户头像
            activityName:'杨澄晖',//用户昵称
            finishNum:1,//完成地点个数
            finishkm:1.4,//已跑公里数
            finishTime:12//时间
        },
],
        isHavePeople: true,//是否有足够多的人来显示排行榜
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        let that = this;
        let joiners = that.data.joiners;
        activity.doc(options.id).get().then(res => {
            if(res.data.users){
                joiners.unshift(...res.data.users)
                that.setData({
                    joiners
                })
            }
        });
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