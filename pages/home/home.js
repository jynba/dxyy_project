// pages/home/home.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    goNewsDetail(e){
        // console.log('@'+e.currentTarget.dataset.index);
        wx.navigateTo({
          url: '/subPackages/pages/newsDetail/newsDetail?newsIndex='+e.currentTarget.dataset.index,
        })
    },
    goMoreNews(e){
        wx.navigateTo({
            url: '/subPackages/pages/newsMore/newsMore',
          })
    },
    goShare(e){
        wx.navigateTo({
            url: '/subPackages/pages/shareMyDesign/shareMyDesign',
          })
    },
    goActivityDetail(e){
        console.log(e.currentTarget.dataset.eventindex);
        wx.navigateTo({
            url: '/subPackages/pages/activityDetail/activityDetail?eventIndex='+e.currentTarget.dataset.eventindex,
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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