const app = getApp();
const db = wx.cloud.database(); //初始化数据库
const mycommunity = db.collection('community')
const _ = db.command;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        moments: [
        ],
        photoWidth: wx.getSystemInfoSync().windowWidth / 5,

        popTop: 0, //弹出点赞评论框的位置
        popWidth: 0, //弹出框宽度
        isShow: true, //判断是否显示弹出框
        isFavorite: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this;
        console.log(options);
        let teamId = "";
        if (options.teamId) {
            teamId = options.teamId;
        }
        mycommunity
            .where({
                gameId: options.id,
            })
            .orderBy("createTime", 'desc')
            .get()
            .then((res) => {
                that.setData({
                    moments: res.data
                })
            })
    },
    islike() {
        let isFavorite = !this.data.isFavorite;
        this.setData({
            isFavorite,
        })
    },
    // 点击图片进行大图查看
    preViewimg: function (e) {
        console.log(e);
        let imgindex = e.target.dataset.imgindex; //预览图片的编号
        let parent = e.target.dataset.parent
        let that = this;
        wx.previewImage({
            current: that.data.moments[parent].imglist[imgindex], //预览图片链接
            urls: that.data.moments[parent].imglist, //图片预览list列表
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