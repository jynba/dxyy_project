const db = wx.cloud.database();
const activity = db.collection('activity');
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activitys: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let clientId = wx.getStorageSync('clientId');
        let activitys;
        activity
            .where({
                '_openid': clientId
            })
            .orderBy('selectedDatestamp', 'desc')
            .limit(10)
            .get()
            .then(res => {
                console.log(res.data);
                activitys = res.data.map(get_activity => {
                    let { _id, itemDate, itemHost, itemName, active, itemRaceSystem, users } = get_activity;
                    if (users) {
                        let user = users.find(item => item.clientId == clientId)
                        if(user)
                        var { reachPoints, totallen, costTime } = user;
                        else var { reachPoints, totallen, costTime } = '';
                    }
                    let mode = active == 0 ? '随机点模式' : active == 1 ? '自定义模式' : '猜地点模式'
                    return {
                        _id,
                        itemDate,
                        itemHost,
                        itemName,
                        mode,
                        itemRaceSystem,
                        reachPoints,
                        totallen,
                        costTime,
                        users,
                    }
                });
                this.setData({
                    activitys,
                })
            })
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