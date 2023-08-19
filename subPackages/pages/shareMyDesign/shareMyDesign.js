// pages/shareMyDesign/shareMyDesign.js
import Toast from '@vant/weapp/toast/toast';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        modeEditTip: '', //编辑成功或前往编辑，在onshow中调整
        setImage: '/images/banner.png',
        itemTitle: '',
        itemMsg: '',
        itemCity: '',
        active: null,
        itemMore: '',
        returnPosMessage: [],
    },

    goDiyMap() {
        wx.navigateTo({
            url: '/subPackages/pages/diymap/diymap',
        })
    },
    setImage() {
        let that = this;
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success(res) {
                that.uploadImage(res.tempFiles[0].tempFilePath)
            }
        })
    },
    // 某项为空提示
    async emptyTips() {
        let isEmpty = false;
        if (this.data.itemTitle.trim() == '') {
            Toast('活动标题不能为空');
            isEmpty = true;
        } else if (this.data.itemMsg.trim() == '') {
            Toast('活动特色不能为空');
            isEmpty = true;
        }else if (this.data.itemCity.trim() == '') {
            Toast('活动城市不能为空');
            isEmpty = true;
        }else if (this.data.markers.length == 0) {
            Toast('请编辑活动模式');
            isEmpty = true;
        }else if (this.data.setImage == '/images/banner.png') {
            Toast('活动封面不能为空');
            isEmpty = true;
        }
        return isEmpty;
    },

    async submit() {
        let isEmpty = await this.emptyTips();
        if (isEmpty) return; //判断某项是否为空
        wx.cloud.database().collection('diy_activity')
            .add({
                data: {
                    setImage: this.data.setImage,
                    itemTitle: this.data.itemTitle,
                    itemMsg: this.data.itemMsg,
                    itemCity: this.data.itemCity,
                    active: this.data.active,
                    itemMore: this.data.itemMore,
                    returnPosMessage: this.data.returnPosMessage,
                }
            })
            .then(res => {
                console.log('活动数据添加成功', res);
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                }).then(res => {
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1000);
                })
            })
            .catch(err => {
                console.log('活动数据添加失败', err);
            })
    },
    uploadImage(fileURL) {
        var that = this
        //上传文件
        const filePath = fileURL // 小程序临时文件路径
        const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}`
        // 给文件名加上时间戳和一个随机数，时间戳是以毫秒计算，而随机数是以 1000 内的正整数，除非 1 秒钟（1 秒=1000 毫秒）上传几十万张照片，不然文件名是不会重复的。
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
            cloudPath, // 指定上传到的云路径
            filePath // 指定要上传的文件的小程序临时文件路径
        }).then(res => {
            // 上传一张图片就会打印上传成功之后的 res 对象，里面包含图片在云存储里的 fileID，注意它的文件名和文件后缀
            console.log("res.fileID", res.fileID)
            // 上传完成需要更新 fileList
            const setImage = res.fileID
            that.setData({
                setImage
            })
            wx.showToast({
                title: '上传成功',
                icon: 'none'
            })
        }).catch((e) => {
            wx.showToast({
                title: '上传失败',
                icon: 'none'
            })
        });

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
        // 判断是否编辑好活动模式，调整文字
        if (this.data.markers) {
            this.setData({
                modeEditTip: '编辑成功'
            })
        } else {
            this.setData({
                modeEditTip: '前往编辑'
            })
        }
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