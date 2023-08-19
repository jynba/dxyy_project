
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        builddata: app.globalData.map,
        markers: [],
        PosId:'',
    },


    onLoad(options) {
        let idx = options.id;
        let that = this;
        let markers = that.data.builddata[+idx].data
        for (var i = 0; i < markers.length; i++) {
            let lat = markers[i].latitude;
            let lon = markers[i].longitude;
            let image = markers[i].image;
            let name = markers[i].name;
            markers[i] = {
                id: i,
                latitude: lat,
                longitude: lon,
                iconPath: image,
                width: 30,
                height: 30,
                label: {
                    content: name,
                    color: '#FFFFFF',
                    bgColor: '#6495ED',
                    fontSize: 13,
                    anchorX: 16,
                    anchorY: -22.5,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#6495ED',
                    padding: 2,
                    //display: 'ALWAYS'
                }
            }
        }
        that.setData({
            markers,
            PosId:options.id
        })
    },

    onReady() {
        this.mapCtx = wx.createMapContext('myMap', this)
        this.showPoint();
    },

    onShow() {
        this.showPoint();
    },

    // 显示所有标记点到屏幕上
    showPoint() {
        try {
            if (!this.mapCtx) return;
            //包含所有坐标点
            let includePointsData = []
            if (this.data.markers)
                for (let i = 0; i < this.data.markers.length; i++) {
                    includePointsData.push({
                        latitude: this.data.markers[i].latitude,
                        longitude: this.data.markers[i].longitude
                    })
                }
            this.mapCtx.includePoints({
                padding: [90, 60, 150, 60],
                points: includePointsData
            })
        } catch (e) {
            console.log(e);
        } finally { }
    },

    // 点击标记点跳转
    onPointTap: function (e) {
        console.log(e);
        let id = ""+ this.data.PosId+e.detail.markerId
        console.log(id);
        wx.navigateTo({
          url: '/subPackages/pages/specificSite/specificSite?id='+id,
        })
    },
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