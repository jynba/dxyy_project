Component({
    properties: {
        // 是否开始绘图
        isCanDraw: {
            type: Boolean,
            value: false,
            observer(newVal) {
                newVal && this.handleStartDrawImg()
            }
        },
        // 用户头像昵称信息
        userInfo: {
            type: Object,
            value: {
                avatarUrl: '',
                nickName: '',
                itemHost: '',
                itemMessage: '',
                itemName: '',
                active: null,
                itemRaceSystem: '',
                itemDate: '',
                reachPoints: null,
                costTime: '',
                totallen: '',
                usersLen: 10,
                rank: "",
            }
        }
    },
    data: {
        imgDraw: {}, // 绘制图片的大对象
        sharePath: '' // 生成的分享图
    },
    methods: {
        handleStartDrawImg() {
            wx.showLoading({
                title: '生成中'
            })
            this.setData({

                imgDraw: {
                    width: '630rpx',
                    height: '1110rpx',
                    background: 'linear-gradient(150deg,#5a8adc 25%,#6ba7d3 50%,#76c5ca 75%,#7be3bf 100%)',
                    views: [
                        {
                            type: 'text',
                            text: this.data.userInfo.itemName,
                            css: {
                                top: '40rpx',
                                left: '40rpx',
                                fontSize: '40rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: this.data.userInfo.itemHost,
                            css: {
                                top: '120rpx',
                                left: '40rpx',
                                fontSize: '32rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'image',
                            url: 'https://636c-cloud-4g0etb4u9d3975e2-1305558654.tcb.qcloud.la/card_point.png?sign=5846995e96a2712972ad054efe7b1eb0&t=1679923186',
                            css: {
                                top: '240rpx',
                                left: '40rpx',
                                width: '30rpx',
                                height: '30rpx',
                            }
                        },
                        {
                            type: 'text',
                            text: '打卡地点',
                            css: {
                                top: '236rpx',
                                left: '90rpx',
                                fontSize: '30rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: this.data.userInfo.reachPoints + '/5',
                            css: {
                                top: '290rpx',
                                left: '90rpx',
                                fontSize: '40rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: '个',
                            css: {
                                top: '303rpx',
                                left: '170rpx',
                                fontSize: '25rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'image',
                            url: 'https://636c-cloud-4g0etb4u9d3975e2-1305558654.tcb.qcloud.la/card_run.png?sign=2cdaf8aad472eb6cdf5ef978efabcdc4&t=1679923555',
                            css: {
                                top: '380rpx',
                                left: '40rpx',
                                width: '30rpx',
                                height: '30rpx',
                            }
                        },
                        {
                            type: 'text',
                            text: '已跑公里',
                            css: {
                                top: '376rpx',
                                left: '90rpx',
                                fontSize: '30rpx',
                                color: '#fff',
                            },
                        },

                        {
                            type: 'text',
                            text: '' + (this.data.userInfo.totallen > 0 ? this.data.userInfo.totallen : '1'),
                            css: {
                                top: '430rpx',
                                left: '90rpx',
                                fontSize: '40rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: 'km',
                            css: {
                                top: '445rpx',
                                left: '185rpx',
                                fontSize: '25rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'image',
                            url: 'https://636c-cloud-4g0etb4u9d3975e2-1305558654.tcb.qcloud.la/card_time.png?sign=ea5774059462cda90d8301b5dcb9f031&t=1679923752',
                            css: {
                                top: '520rpx',
                                left: '40rpx',
                                width: '30rpx',
                                height: '30rpx',
                            }
                        },
                        {
                            type: 'text',
                            text: '时长',
                            css: {
                                top: '516rpx',
                                left: '90rpx',
                                fontSize: '30rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: '' + (this.data.userInfo.costTime>0?this.data.userInfo.costTime:'8'),
                            css: {
                                top: '570rpx',
                                left: '90rpx',
                                fontSize: '40rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: 'min',
                            css: {
                                top: '588rpx',
                                left: '155rpx',
                                fontSize: '25rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: this.data.userInfo.active == 0 ? '# 随机点模式' : this.data.userInfo.active == 1 ? '# 自定义模式' : '# 猜地点模式',
                            css: {
                                top: '700rpx',
                                left: '40rpx',
                                fontSize: '35rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: '# ' + this.data.userInfo.itemRaceSystem,
                            css: {
                                top: '700rpx',
                                left: '280rpx',
                                fontSize: '35rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: '       ' + this.data.userInfo.itemMessage,
                            css: {
                                top: '820rpx',
                                left: '40rpx',
                                width: '550rpx',
                                fontSize: '30rpx',
                                color: '#fff',
                                maxLines: 2,
                                lineHeight: '50rpx',
                            },
                        },
                        {
                            type: 'image',
                            url: this.data.userInfo.avatarUrl,
                            css: {
                                top: '980rpx',
                                right: '200rpx',
                                width: '68rpx',
                                height: '68rpx',
                                borderRadius: '50%',
                                borderWidth: '4rpx',
                                borderColor: '#fff',

                            }
                        },
                        {
                            type: 'text',
                            text: this.data.userInfo.nickName || '微信用户',
                            css: {
                                top: '980rpx',
                                right: '70rpx',
                                fontSize: '32rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: '' + this.data.userInfo.itemDate,
                            css: {
                                top: '1030rpx',
                                right: '40rpx',
                                fontSize: '25rpx',
                                color: '#fff',
                            },
                        },
                        // {
                        //     type: 'text',
                        //     text: '排 名',
                        //     css: {
                        //         top: '40rpx',
                        //         right: '80rpx',
                        //         fontSize: '40rpx',
                        //         color: '#fff',
                        //     },
                        // },
                        {
                            type: 'text',
                            text: '0' + (this.data.userInfo.rank || '1'),
                            css: {
                                top: '55rpx',
                                right: '200rpx',
                                fontSize: '60rpx',
                                color: '#fff',
                                fontWeight: 'bold',
                            },
                        },
                        {
                            type: 'text',
                            text: '/',
                            css: {
                                top: '15rpx',
                                right: '50rpx',
                                fontSize: '160rpx',
                                color: '#fff',
                            },
                        },
                        {
                            type: 'text',
                            text: '' + (this.data.userInfo.usersLen > 1 ? this.data.userInfo.usersLen : '10'),
                            css: {
                                top: '115rpx',
                                right: '90rpx',
                                fontSize: '67rpx',
                                color: '#fff',
                                fontWeight: 'bold',
                            },
                        },
                        // {
                        //     type: 'rect',
                        //     css: {
                        //         width:'150rpx',
                        //         height:'150rpx',
                        //         top: '100rpx',
                        //         right: '70rpx',
                        //         fontSize: '32rpx',
                        //         color:'#fff',
                        //         borderRadius:'20rpx',
                        //     },
                        // },
                    ]
                }
            })
        },
        onImgErr(e) {
            wx.hideLoading()
            wx.showToast({
                title: '生成分享图失败，请刷新页面重试'
            })
            //通知外部绘制完成，重置isCanDraw为false
            this.triggerEvent('initData')
        },
        onImgOK(e) {
            let that = this;
            console.log(e.detail.path);
            let item = e.detail.path;
            let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
            wx.cloud.uploadFile({
                cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                filePath: item, // 小程序临时文件路径
                success: res => {
                    that.setData({
                        sharePath: res.fileID
                    })
                    console.log(res.fileID);
                    //通知外部绘制完成，重置isCanDraw为false
                    this.triggerEvent('initData', { sharePath: res.fileID })
                },
                fail: res => {
                    wx.showToast({
                        title: "上传失败",
                        icon: 'none',
                        duration: 2000
                    })
                },
                complete: function (e) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '成功生成海报',
                        icon: "success"
                    }, 500)
                }
            })
        }
    }
})
