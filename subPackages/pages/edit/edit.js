// pages/fb/fb.js
var utils = require('../../../utils/util.js')
const app = getApp()
const db = wx.cloud.database(); //初始化数据库
const community = db.collection('community')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imglist: [], //选择图片
        fileIDs: [], //上传云存储后的返回值
        name: "",
        describe: "",
        submit: false,
        _id: "",
        nickName: "",
        avatarUrl: "",
        like_nums: 0,
        _openid: "",
        gameId:'',
        teamId:'',
    },

    onLoad: function (options) {
        let nickName = wx.getStorageSync('username')
        let avatarUrl = wx.getStorageSync('avatarUrl')
        if(options.sharePath){
            let sharePath = options.sharePath;
            let gameId = options.gameId;
            let teamId = options.teamId;
            let imglist = this.data.imglist;
            imglist.unshift(sharePath);
            this.uploadOneByOne(imglist, 0, 0, 0, imglist.length);
            this.setData({
                imglist,
                gameId,
                teamId,
                nickName,
                avatarUrl,
            })
        }else{
            this.setData({
                nickName,
                avatarUrl,
            })
        }
    },

    // 选择图片 &&&
    addpic: function (e) {
        return new Promise(resolve => {
            var imglist = this.data.imglist;
            var that = this;
            var n = 8;
            if (8 > imglist.length > 0) {
                n = 8 - imglist.length;
            } else if (imglist.length == 8) {
                n = 1;
            }
            wx.chooseMedia({
                count: n, // 默认8，设置图片张数
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // console.log(res.tempFiles)
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    console.log(res);
                    var tempFiles = res.tempFiles.map(item => item.tempFilePath)
                    if (imglist.length == 0) {
                        imglist = tempFiles
                    } else if (8 > imglist.length) {
                        imglist = imglist.concat(tempFiles);
                    }
                    var successUp = 0; //成功
                    var failUp = 0; //失败
                    var length = tempFiles.length; //总数
                    var count = 0; //第几张
                    //上传到云存储
                    that.uploadOneByOne(tempFiles, successUp, failUp, count, length);
                    //本地数据更新
                    that.setData({
                        imglist: imglist
                    });
                    return resolve();
                }
            })
        });
    },

    //递归上传；防止异步导致顺序出错
    uploadOneByOne(imgPaths, successUp, failUp, count, length) {
        let that = this;
        let item = imgPaths[count];
        let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
        wx.showLoading({
            title: '上传中',
        })
        wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
                successUp++; //成功+1
                //更新本地路径为云存储路径
                imgPaths[count] = res.fileID;
            },
            fail: res => {
                failUp++; //失败+1
                wx.showToast({
                    title: '第' + failUp + '张' + "上传失败",
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function (e) {
                count++; //下一张
                if (count == length) {
                    //上传完毕，作一下提示
                    that.setData({
                        fileIDs: that.data.fileIDs.concat(imgPaths)
                    }, res => {
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success'
                        })
                    });
                } else {
                    //递归调用，上传下一张
                    that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
                }
            }
        })
    },

    // 删除照片 &&
    imgDelete1: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.deindex;
        let imglist = this.data.imglist;
        let imgPath = this.data.fileIDs;
        imglist.splice(index, 1);
        imgPath.splice(index, 1)
        that.setData({
            imglist: imglist,
            fileIDs: imgPath,
        });
    },

    //发布按钮
    onSubmit: function (e) {
        var that = this;
        that.data.submit = true;
        if (that.data.imglist.length === 0) {
            wx.showToast({
                title: '请上传图片后再提交',
                icon: "none",
            })
        } else if (that.data.imglist.length != that.data.fileIDs.length) {
            wx.showToast({
                title: '等待图片上传完后再提交',
                icon: "none",
            })
        } else {
            var openid = wx.getStorageSync('clientId')
            that.setData({
                name: e.detail.value.name,
                imglist: that.data.fileIDs,
                describe: e.detail.value.describe,
                _openid: openid,
            })
            community.add({
                data: {
                    name: e.detail.value.name,
                    imglist: that.data.fileIDs,
                    describe: e.detail.value.describe,
                    createTime: db.serverDate(),
                    updateTime: utils.formatTime(new Date()),
                    nickName: that.data.nickName,
                    avatarUrl: that.data.avatarUrl,
                    like_users: [], //记录点赞的用户
                    like_nums: 0,
                    gameId:that.data.gameId,
                    teamId:that.data.teamId
                }
            }).then(res => {
                that.data._id = res._id;
                wx.hideLoading();
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1000,
                    success: res2 => {
                        setTimeout(function () {
                            wx.reLaunch({
                              url: '/pages/community/community',
                            })
                        }, 1000)
                    },
                })
            })
        }
    },
    preViewimg: function (e) {
        let index = e.target.dataset.index; //预览图片的编号
        let that = this;
        wx.previewImage({
            current: that.data.imglist[index], //预览图片链接
            urls: that.data.imglist, //图片预览list列表
        })
    },
    imgbox: function (e) {
        this.setData({
            imgbox: e.detail.value
        })
    },
})