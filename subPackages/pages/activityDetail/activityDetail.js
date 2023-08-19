import Dialog from '@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventIndex: '',
        showJoin: false,
        userName: '',
        isBaomin: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let eventIndex = options.eventIndex;
        this.setData({
            eventIndex
        })

    },
    onshowJoin() {
        this.setData({ showJoin: true });
    },

    onCloseJoin() {
        this.setData({
            showJoin: false,
        });
    },
    oninputName(event) {
        console.log(event.detail);
    },
    getMap() {
        wx.navigateTo({
            url: '/subPackages/pages/activityDetailPoints/activityDetailPoints?id=' + this.data.eventIndex,
        })
    },
    CheckRanking() {
        wx.navigateTo({
            url: '/subPackages/pages/ranking/ranking',
        })
    },
    goToShare() {
        wx.navigateTo({
            url: '/subPackages/pages/moments/moments',
        })
    },
    toConfirmSetMode() {
        if (this.data.isBaomin) {
            wx.navigateTo({
                url: '/subPackages/pages/activityDetailPoints/activityDetailPoints?id=' + this.data.eventIndex,
            })
        } else {
            this.onshowJoin()
        }
    },
    getUserName(){
        this.setData({
            isBaomin: true,
        },res=>{
            wx.showToast({
                title: '报名成功',
                icon:"success"
              },1000)
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