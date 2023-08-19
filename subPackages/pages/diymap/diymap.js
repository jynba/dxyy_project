var QQMapWX = require('../../../qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
import Toast from '@vant/weapp/toast/toast';

Page({
    data: {
        randomRange:260,
        randomNum:5,
        setRandom:false,
        markers: [],
        isChoosePos: false,
        latitude: 22.902684,
        longitude: 113.875159,
        setting: {
            skew: 0,
            rotate: 0,
            showLocation: true,
            showScale: false,
            subkey: "EPKBZ-6PG63-UQZ3M-33CHO-IEW7V-CPB55",
            layerStyle: 4,
            scale: 16,
            showCompass: true,
            enableBuilding: true,
            layerStyle: 1,
            enableZoom: true,
            enableScroll: true,
            enableRotate: true,
            showCompass: false,
            enable3D: false,
            enableOverlooking: false,
            enableSatellite: false,
            enableTraffic: false,
        },
        pageIndex: 1,
        count: 0,
        suggestion: null,
        sugFlag: false,
        scrollT: 0,
        iptValue: '',
        focus: false,
        keyword: '',
        showSearch: false,
        active: 1,
        // 坐标点信息
        setModal: false,
        showModal: false,
        beforeClose: {},
        Postitle: '',
        Posmessage: '',
        fileList: [],
        returnPosMessage: [],
        markerId: '',
        addIndexId: 1,
    },
    onLoad: function (options) {
        let that = this
        
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: '6ATBZ-4F4C2-G7RU3-CUZE5-QVTFH-Y6FHU'
        });
        // 获取当前位置
        that.showCurPos();

        // 弹窗返回
        const beforeClose = (action) => new Promise((resolve) => {
            setTimeout(() => {
                if (action === 'confirm') {
                    // 拦截确认操作
                    resolve(false);
                } else {
                    resolve(true);
                }
            }, 0);
        });
        that.setData({
            beforeClose,
            // 设置上一次编辑好的数据
        })
    },
    onReady: function (e) {
        this.mapCtx = wx.createMapContext('myMap', this)
        this.showCurPos();
    },

    // 切换模式 
    onChange(event) {
        let showSearch = this.data.showSearch;
        let setRandom = this.data.setRandom;
        // 清空随机点
        let markers = this.data.markers;
        let len = markers.length;
        markers.splice(0);
        this.setData({
            active: event.detail.index,
            markers: markers,
            Postitle: '',
            Posmessage: '',
            returnPosMessage: [],
        })
        // 切换
        switch (event.detail.index) {
            case 0:
                showSearch = false;
                setRandom = true;
                this.getMaxMinLongitudeLatitude();
                break;
            case 1:
                showSearch = true;
                setRandom =false;
                break;
            case 2:
                showSearch = true;
                setRandom=false;
                break;
            default:
                break;
        }
        this.setData({
            showSearch,
            setRandom,
        })
        wx.showToast({
            title: `${event.detail.title}`,
            icon: 'none',
        });
    },
    // 移动回到当前位置
    showCurPos() {
        if (!this.mapCtx) return;
        // 地图移动回当前位置
        this.mapCtx.moveToLocation({
            success: res => {
                // 防止重复触发
                clearTimeout(this.data.mapT);
                // 获取当前位置的经纬度
                this.setData({
                    mapT: setTimeout(() => {
                        this.getMyLocation()
                    }, 500)
                });
            }
        });
    },
    // 获取当前位置
    getMyLocation: function (e) {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                const latitude = res.latitude
                const longitude = res.longitude
                this.setData({
                    longitude: longitude,
                    latitude: latitude
                });
            }
        })
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
        } finally {}
    },
    // 点击标记点
    onPointTap: function (e) {
        let that = this;
        var lat = ''; // 获取点击的markers经纬度
        var lon = ''; // 获取点击的markers经纬度
        var Postitle = ''; // 获取点击的markers名称
        var markerId = e.detail.markerId; // 获取点击的markers  id
        let currentdatabase = this.data.returnPosMessage;
        that.setData({
            markerId, //方便外部获取
        })
        var markersda = this.data.markers;
        //定位所点击的坐标点
        let index = markersda.findIndex(item => item.id == markerId)
        console.log(index);
        if (currentdatabase[+index]) {
            // markerid从1开始
            that.setData({
                showModal: true,
                Postitle: currentdatabase[index].Postitle,
                Posmessage: currentdatabase[index].Posmessage,
                fileList: currentdatabase[index].fileList,
            })
        }
    },

    // 记录轨迹
    ShowPolyline: function () {
        console.log("set 轨迹"), console.log(this.data.enableShowPolyline), this.setData({
            enableShowPolyline: !this.data.enableShowPolyline
        }), this.data.enableShowPolyline ? (this.setData({
            polylinecolor: "#1e90ff",
            lenmessage: "点击标记开始记录轨迹"
        }), wx.showToast({
            title: "打开轨迹显示,请点击标记开始记录",
            icon: "none",
            duration: 2e3
        })) : (this.setData(o({
            polylinecolor: 0,
            recordname: "",
            lenmessage: "",
            totallen: 0,
            lastlat: 0
        }, "lastlat", 0)), this.data.polyline[0].points.splice(0), wx.showToast({
            title: "关闭轨迹显示",
            icon: "none",
            duration: 2e3
        }));
    },
    // 显示卫星图
    satelliteChange: function () {
        let setting = this.data.setting;
        setting['enableSatellite'] = !setting['enableSatellite']
        this.setData({
            setting: setting
        });
        if (setting.enableSatellite) {
            this.setData({
                satellitecolor: "#1e90ff"
            });
            wx.showToast({
                title: "打开卫星地图显示",
                icon: "none",
                duration: 2e3
            })
        } else {
            this.setData({
                satellitecolor: 0
            });
            wx.showToast({
                title: "关闭卫星地图显示",
                icon: "none",
                duration: 2e3
            })
        }
    },

    /* 坐标随机模式*/
    // 获取5个随机坐标点
    refreshLoc: function (lng_min, lng_max, lat_min, lat_max) {
        let that = this;
        // let lat_max = 22.91575;
        // let lat_min = 22.891144;
        // let lng_max = 113.883874;
        // let lng_min = 113.869188;
        let lat_range = lat_max - lat_min;
        let lng_range = lng_max - lng_min;
        var x = 0;
        var y = 0;
        let num = that.data.randomNum;
        let markers = that.data.markers;
        markers.splice(0);//先清空已有markers
        that.setData({
            markers
        })
        for (var i = 0; i < num; i++) {
            x = (lng_min * 100) / 100 + (Math.random() * lng_range);
            y = (lat_min * 100) / 100 + (Math.random() * lat_range);
            var index = "markers[" + (i) + "]";
            that.setData({
                [index]: {
                    latitude: y,
                    longitude: x,
                    iconPath: "/images/location_green.png",
                    id: +i,
                    width: 30,
                    height: 30,
                    label: {
                        content: `随机点${i+1}`,//设置标记点到达的先后顺序？
                        color: '#FFFFFF',
                        bgColor: '#6495ED',
                        fontSize: 13,
                        anchorX: 14,
                        anchorY: -25,
                        borderRadius: 5,
                        borderWidth: 0.8,
                        borderColor: '#6495ED',
                        padding: 2,
                        display: 'ALWAYS'
                    }
                }
            })
        }
        that.showPoint()
    },
    //随机显示附近260m的坐标点
    getMaxMinLongitudeLatitude() { //默认附近0.26千米
        let distince = this.data.randomRange;
        distince/=1000;
        let r = 6371.393; // 地球半径千米
        let lng = this.data.longitude;
        let lat = this.data.latitude;
        let dlng = 2 * Math.asin(Math.sin(distince / (2 * r)) / Math.cos(lat * Math.PI / 180));
        dlng = dlng * 180 / Math.PI; // 角度转为弧度
        let dlat = distince / r;
        dlat = dlat * 180 / Math.PI;
        let minlat = lat - dlat;
        let maxlat = lat + dlat;
        let minlng = lng - dlng;
        let maxlng = lng + dlng;
        // console.log(minlng + "-" + maxlng + "-" + minlat + "-" + maxlat);

        this.refreshLoc(minlng, maxlng, minlat, maxlat)
    },

    /* 坐标自定义模式*/
    // 记录在地图上点击的坐标点
    bindtap: function (e) {
        let that = this;
        // console.log(e.detail);
        let lat = e.detail.latitude;
        let lng = e.detail.longitude;
        let isChoosePos = that.data.isChoosePos;
        if (isChoosePos) {
            let addIndexId = that.data.addIndexId;
            let len = that.data.markers.length
            var index = "markers[" + len + "]";
            that.setData({
                [index]: {
                    latitude: lat,
                    longitude: lng,
                    iconPath: "/images/location_green.png",
                    id: +addIndexId,
                    width: 30,
                    height: 30,
                },
            })
            // 填写表单
            addIndexId += 1;
            that.setData({
                setModal: true,
                addIndexId,
            })
        }
    },

    // 确认提交modal
    onConfirm(event) {
        let that = this
        let isChoosePos = that.data.isChoosePos;
        if (that.data.Postitle == '') {
            wx.showToast({
                title: '名称不能为空',
                icon: 'none',
            })
            return
        }
        // console.log(event);
        let addIndex = that.data.markers.length - 1;
        let newmarker = that.data.markers[addIndex]
        newmarker.label = {
            content: that.data.Postitle,
            color: '#FFFFFF',
            bgColor: '#6495ED',
            fontSize: 13,
            anchorX: 14,
            anchorY: -25,
            borderRadius: 5,
            borderWidth: 0.8,
            borderColor: '#6495ED',
            padding: 2,
            display: 'ALWAYS'
        }
        let {
            Postitle,
            Posmessage,
            fileList
        } = that.data
        let returnPosMessage = that.data.returnPosMessage;
        returnPosMessage.push({
            Postitle,
            Posmessage,
            fileList
        })
        that.setData({
            isChoosePos: !isChoosePos,
            ["markers[" + addIndex + "]"]: newmarker,
            returnPosMessage,
        })
        wx.showToast({
            title: "设置标记点成功",
            icon: 'success',
            duration: 2000
        })
        that.onClose();
    },
    // 取消提交
    onCancel(event) {
        let that = this
        let isChoosePos = that.data.isChoosePos;
        let markers = that.data.markers;
        markers.pop()
        that.setData({
            markers,
            isChoosePos: !isChoosePos,
        })
    },
    // 删除marker
    IsDelete() {
        let markerId = this.data.markerId;
        let markers = this.data.markers;
        let returnPosMessage = this.data.returnPosMessage;
        if (markerId != '') {
            let index = markers.findIndex(item => item.id == markerId)
            markers.splice(index, 1)
            returnPosMessage.splice(index, 1)
            this.setData({
                markers,
                returnPosMessage,
                markerId: '',
            })
        }

    },
    // 关闭modal 
    onClose() {
        let that = this;
        that.setData({
            setModal: false,
            showModal: false,
        }, res => {
            that.setData({
                Posmessage: '',
                Postitle: '',
                fileList: [],
            })
        });
    },
    ChoosePos: function () {
        let isChoosePos = this.data.isChoosePos;
        this.setData({
            isChoosePos: !isChoosePos
        })
        if (!isChoosePos) {
            wx.showToast({
                title: "请选择你要的自定义标记点",
                icon: 'none',
                duration: 2000
            })
        }
    },

    /* 搜索框 */
    //点击提示框mask
    clickMask(e) {
        if (e.target.dataset.type == 'mask') {
            // 隐藏提示框
            this.setData({
                sugFlag: false
            });
        }
    },
    // 输入框内容
    iptInput(e) {
        // 0.5秒内只能触发一次
        clearTimeout(this.data.iptT);
        this.setData({
            iptT: setTimeout(() => {
                let value = e.detail.value;
                this.setData({
                    count: null,
                    suggestion: null,
                    pageIndex: 1,
                    scrollT: 0,
                    sugFlag: true
                })
                if (!value) {
                    this.setData({
                        count: 0
                    });
                    return;
                }
                this.setData({
                    keyword: value,
                });
                this.getSuggestion(value);
            }, 500)
        });
    },
    //触发关键词输入提示事件
    getSuggestion: function (keyword, page_index = 1) {
        var that = this;
        //调用关键词提示接口
        qqmapsdk.getSuggestion({
            //获取输入框值并设置keyword参数
            keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
            //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
            location: `${that.data.latitude},${that.data.longitude}`, //设置周边搜索中心点
            page_index,
            page_size: 5, //一次显示5条
            success: function (res) { //搜索成功后的回调
                console.log(res);
                let sug = [];
                console.log(res.data);
                for (var i = 0; i < res.data.length; i++) {
                    sug.push({ // 获取返回结果，放到sug数组中
                        title: res.data[i].title,
                        id: res.data[i].id,
                        addr: res.data[i].address,
                        city: res.data[i].city,
                        district: res.data[i].district,
                        latitude: res.data[i].location.lat,
                        longitude: res.data[i].location.lng
                    });
                }
                let count = res.count;
                that.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
                    // suggestion: sug,
                    count: count,
                });

                // 如果是第一页，则重新赋值
                if (page_index == 1) {
                    that.setData({
                        suggestion: sug
                    });
                } else {
                    // 非第一页则添加在数据末尾
                    that.setData({
                        suggestion: that.data.suggestion.concat(sug)
                    });
                }
            },
            fail: function (error) {
                console.error(error);
            },
            complete: function (res) {
                console.log(res);
            }
        });
    },
    //点击提示事件
    //选择提示框地点
    selectSite(e) {
        console.log(e);
        let index = e.currentTarget.dataset.index;
        let item = this.data.suggestion[index];
        let title = item.title;
        let lat = item.latitude;
        let lng = item.longitude;
        let addIndexId = this.data.addIndexId;
        var addIndex = "markers[" + this.data.markers.length + "]";
        this.setData({
            sugFlag: false,
            iptValue: title,
            Postitle: title,
            [addIndex]: {
                latitude: lat,
                longitude: lng,
                iconPath: "/images/location_green.png",
                id: +addIndexId,
                title: title,
                width: 30,
                height: 30,
            },
            setModal: true
        });
        addIndexId += 1;
        this.setData({
            isChoosePos: true,
            addIndexId,
        })
        // this.showPoint();
    },
    // 显示提示框
    iptFocus() {
        this.setData({
            sugFlag: true
        });
    },
    // 清空搜索框
    delectValue() {
        // 停止获取关键词提示
        clearTimeout(this.data.iptT);
        this.setData({
            count: 0,
            suggestion: null,
            pageIndex: 1,
            scrollT: 0,
            sugFlag: true,
            focus: true,
            iptValue: '',
            keyword: ''
        });
    },
    // 显示更多提示内容
    moreSuggestion() {
        let keyword = this.data.keyword;
        if (!keyword) return;
        let pageIndex = this.data.pageIndex;
        if (pageIndex * 10 < this.data.count) {
            this.getSuggestion(keyword, pageIndex + 1);
            this.setData({
                pageIndex: pageIndex + 1
            })
        }
    },
    // 选择图片 预览图片
    //before-read 事件可以在上传前进行校验，调用 callback 方法传入 true 表示校验通过，传入 false 表示校验失败。
    beforeRead(event) {
        const {
            file,
            callback
        } = event.detail;
        callback(file.type === 'image');
    },

    afterRead(event) {
        const file = event.detail.file

        //还没上传时将选择的图片的上传状态设置为加载    
        var that = this
        const fileList = that.data.fileList
        fileList.push({})
        fileList[fileList.length - 1].status = 'uploading'
        that.setData({
            fileList
        })

        this.uploadImg(file.url)
    },

    // 上传图片到云开发的存储中
    uploadImg(fileURL) {
        var that = this
        //上传文件
        const filePath = fileURL // 小程序临时文件路径
        const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}` + filePath.match(/\.[^.]+?$/)[0]
        // 给文件名加上时间戳和一个随机数，时间戳是以毫秒计算，而随机数是以 1000 内的正整数，除非 1 秒钟（1 秒=1000 毫秒）上传几十万张照片，不然文件名是不会重复的。
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
            cloudPath, // 指定上传到的云路径
            filePath // 指定要上传的文件的小程序临时文件路径
        }).then(res => {
            // 上传一张图片就会打印上传成功之后的 res 对象，里面包含图片在云存储里的 fileID，注意它的文件名和文件后缀
            console.log("res.fileID", res.fileID)
            // 上传完成需要更新 fileList
            const fileList = that.data.fileList
            fileList[fileList.length - 1].url = res.fileID
            fileList[fileList.length - 1].status = 'done' //将上传状态修改为已完成
            that.setData({
                fileList
            })
            console.log("fileList", fileList)
            wx.showToast({
                title: '上传成功',
                icon: 'none'
            })
        }).catch((e) => {
            wx.showToast({
                title: '上传失败',
                icon: 'none'
            })
            const fileList = that.data.fileList
            fileList[fileList.length - 1].status = 'failed' //将上传状态修改为已完成
            that.setData({
                fileList
            })
            console.log(e)
        });
    },

    // 点击预览的x号，将图片删除
    deleteImg(event) {
        let that = this;
        // event.detail.index: 删除图片的序号值
        const delIndex = event.detail.index
        const fileList = that.data.fileList

        // 云存储删除（真删除）
        var fileID = fileList[delIndex].url
        that.deleteCloudImg(fileID)
        // 页面删除（假删除）
        // 添加或删除 array.splice(index,howmany,item1,.....,itemX)
        fileList.splice(delIndex, 1)
        this.setData({
            fileList
        })
    },

    // 删除云存储的图片
    deleteCloudImg(fileID) {
        wx.cloud.deleteFile({
            fileList: [fileID],
        }).then(res => {
            // handle success
            console.log(res.fileList)
        }).catch((e) => {
            wx.showToast({
                title: '删除失败',
                icon: 'none'
            })
            console.log(e)
        })
    },
    /* 猜地点模式*/

    // 确定设置为以上模式
    toConfirmSetMode() {
        if (this.data.markers.length > 0) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
                markers: this.data.markers,
                active: this.data.active, //模式 0表示随机点模式 ...以此类推
                returnPosMessage: this.data.returnPosMessage,
            })
            wx.navigateBack({
                delta: 1
            });
        } else {
            Toast('您未设置好活动模式！');
        }
    },
})