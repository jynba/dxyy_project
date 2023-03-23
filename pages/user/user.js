var app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        username: ''
    },
    // 失去焦点时
    nameOnblur(e) {
        this.setData({
            username: e.detail.value
        })
        wx.setStorageSync('username', this.data.username)
    },
    bindchooseavatar(e) {
        const { avatarUrl } = e.detail
        const filePath = avatarUrl;
        let suffix = /\.\w+$/.exec(filePath)[0];
        const cloudPath = new Date().getTime() + suffix;
        wx.cloud.uploadFile({
            cloudPath: cloudPath, // 上传至云端的路径
            filePath: filePath, // 小程序临时文件路径
            success: res => {
                // 返回文件 ID
                wx.setStorageSync('avatarUrl', res.fileID)
            },
            fail: console.error
        })

        this.setData({
            avatarUrl: res.fileID
        })
        wx.setStorageSync('avatarUrl', this.data.avatarUrl)
    },
    // 
    onLoad() {
        let username = wx.getStorageSync('username');
        let avatarUrl = wx.getStorageSync('avatarUrl');
        if (username) {
            this.setData({
                username,
            })
        }
        if (avatarUrl)
            this.setData({
                avatarUrl
            })
    },
    myLaunch() {

    },
    myJoin() {

    }

})