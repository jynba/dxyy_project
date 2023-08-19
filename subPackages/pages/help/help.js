// pages/help/help.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [{
                Q: "1.随机点模式有什么用？",
                content: '随机点模式会在所在位置附近自动生成随机点，随机点没有顺序，玩家可以自行选择路线前往，到达坐标点附近50米内时手机会震动，显示到达提示',
                show: false,
            }, {
                Q: "2.自定义模式有什么用？",
                content: "自定义模式用于创建者自行在地图上标记自定义坐标点，可添加坐标点描述信息，同时可以使用搜索功能对附近建筑进行搜索，直接点击提示栏地点即可设置对应坐标点。",
            },
            {
                Q: "3.在创建时如何删除自定义坐标？",
                content: "在自定义模式和猜地点模式中，选择要删除的标记点后点击“确定”即可删除对应坐标点，在随机点模式中可通过刷新按钮对地点进行刷新",
                show: false,
            }, {
                Q: "4.猜地点模式有什么用？",
                content: "在猜地点模式中，玩家的地图界面不会显示坐标点，而是会显示所有坐标点的描述信息，当玩家到达对应坐标点附近时，对应坐标点才会显示",
                show: false,
            },
            {
                Q: "5.如何反馈意见与建议？",
                content: "可在“我的运动”-“关于我们”添加开发者微信进行交流探讨，或通过“客服消息”反馈你宝贵的意见！",
                show: false,
            }
        ]
    },

    listTap(e) {
        let Index = e.currentTarget.dataset.parentindex, //获取点击的下标值
            list = this.data.list;
        for (let i = 0; i < list.length; i++) {
            if (i == Index) {
                list[i].show = !list[i].show;
                this.setData({
                    list: list
                })
                console.log(list[i])
                break;
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})