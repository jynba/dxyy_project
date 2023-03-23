// app.js


App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                env: 'cloud-4g0etb4u9d3975e2',
                traceUser: true,
            })
        }
        // 获取设备信息
        wx.getSystemInfo({
            success: (res) => {
                // console.log(res);
                this.globalData.systeminfo = res
            },
        })

        const clientid = wx.getStorageSync('clientId')
        //获取openid
        console.log(clientid);
        if (!clientid) {
            wx.cloud.callFunction({
                name: 'getOpenid'
            }).then(res => {
                console.log("openid获取成功", res);
                // clientid  为用户id 识别单个用户发布消息和订阅消息
                wx.setStorageSync("clientId", res.result.openid);
            }).catch(err => {
                console.log("失败", err)
            })
        }

        const avatarUrl = wx.getStorageSync('avatarUrl');
        if(!avatarUrl){
            wx.setStorageSync('avatarUrl', "cloud://cloud-4g0etb4u9d3975e2.636c-cloud-4g0etb4u9d3975e2-1305558654/avatar.png")
        }
    },
    globalData: {
        systeminfo: {}, // 系统信息
    }

})