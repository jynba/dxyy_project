var QQMapWX = require('../../qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
// mqtt
const mqtt = require("../..//utils/mqtt")
const en = require("../../utils/public.js")
const activity = wx.cloud.database().collection('activity');
const connect = mqtt.connect
var nt = 0;
var lt = 0;
var p = !1;
var I = 0;
var r = !1;
var u = !1;
var connectT = false;

Page({
    data: {
        isHost: false,
        openid: "",//活动管理员id
        onlyOneFn: null,//一次调用函数
        throttle: null,//节流函数
        startState: false,//判断活动开始状态
        endState: false,//判断活动结束状态
        receiveflag: "", //用于判断接收状态
        settimer: "", //用于长时间未连接则关闭

        enableShowPolyline: false,//默认不显示路径
        recoredPolyline:true,//记录路径，默认记录
        polylinecolor: 0,
        polyline: [{
            points: [],
            color: "#cd3530",
            width: 4,
            dottedLine: false
        },
        {
            points: [],
            color: "#1e90ff",
            width: 4,
            dottedLine: false
        }],
        mypoints: [], //记录轨迹点
        positionArr: [], //所有轨迹
        firstlat: 0, //记录上一个经纬度
        firstlng: 0,
        lastlat: 0, //记录最新的经纬度
        lastlng: 0,
        totallen: 0, //记录总长
        starttime: 0,//记录开始时间
        lenmessage: "",//记录距离、花费时间

        markers: [
            //   {
            //   iconPath: "https://mmbiz.qpic.cn/mmbiz_png/ymce5HAJXspzHSgfqhNRrfZ2FAic4JMmZ0AM5aIe84WF1J4gYdLBAgdxrvKSia8Zh475s0TVL2salmaicLMbjPy9A/0?wx_fmt=png",
            //   id: 0,
            //   timestamp: 0,
            //   clientId: 0,
            //   latitude: 22.902684,
            //   longitude: 113.875159,
            //   width: 30,
            //   height: 30,
            //   callout: {
            //     fontSize: 15,
            //     padding: 3,
            //     borderRadius: 3,
            //     color: "#2F4F4F",
            //     bgColor: "#E6E6FA",
            //     content: "",
            //     display: "BYCLICK"
            //   }
            // }
        ],
        markersLen: 0,
        nowMarkersLen: 0,
        markerid: 10,
        clickmarkerId: null,
        returnPosMessage: null,
        showModal: false,
        showTips: false,
        //该点是否完成
        isFinish: false,
        active: 0,
        mode: '',
        hiddenMarkers: null,
        tipsMessage: null,

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
        // 用户通讯
        udp: null,
        client: null,
        host: "gps.osdiy.cn",
        options: {
            protocolVersion: 4,
            keepalive: 10,
            clientId: "",
            clean: !0,
            password: "weijia",
            username: "weijia",
            reconnectPeriod: 1e3,
            connectTimeout: 3e4,
            resubscribe: !0
        },
        roomId: "",
        devGetTopic: "",
        devUpdateTopic: "",
        name: "",
        avatarUrl: "",
    },

    onLoad: function (option) {
        let that = this;
        const username = wx.getStorageSync('username')
        const avatarUrl = wx.getStorageSync('avatarUrl')
        if (username) {
            that.setData({
                name: username,
                avatarUrl: avatarUrl,
            })
        } else {
            that.setData({
                name: option.name,
                avatarUrl: avatarUrl,
            })
            wx.setStorageSync('username', option.name)
        }
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: '6ATBZ-4F4C2-G7RU3-CUZE5-QVTFH-Y6FHU'
        });

        console.log(option);
        const clientId = wx.getStorageSync('clientId')
        if (clientId) {
            that.setData({
                "options.clientId": clientId,
            })
        }
        if (clientId) {
            activity.doc(option.id).get().then(res => {
                console.log(res.data);
                if (res.data._openid === clientId) {
                    let mode = that.data.mode;
                    switch (res.data.active) {
                        case 0:
                            mode = '随机点模式';
                            break;
                        case 1:
                            mode = '自定义模式';
                            break;
                        case 2:
                            mode = '猜地点模式';
                    }
                    that.setData({
                        isHost: true,
                        mode,
                    })
                }
                let roomId = option.id;
                that.setData({
                    roomId: roomId,
                })
                wx.setStorageSync('roomId', roomId)
                that.getbackgroudloation()//开始通讯
            })
        }

        // 记录开始时间
        let starttime = that.data.starttime
        starttime = new Date().getTime();
        that.setData({
            starttime,
            lenmessage: "记录" + that.data.name + "的轨迹",
        })

        // 一次调用的函数
        that.onlyOneFn = once(function () {
            //获取活动信息
            activity.doc(option.id).get().then(res => {
                console.log(res);
                let markers = that.data.markers;
                markers.unshift(...res.data.markers);
                let markersLen = res.data.markers.length;
                let nowMarkersLen = markersLen;
                let returnPosMessage = res.data.returnPosMessage;
                let active = res.data.active;
                let mode = that.data.mode;
                let tipsMessage = that.data.tipsMessage;
                let hiddenMarkers = that.data.hiddenMarkers;
                let tmp; //用于拷贝posmessage
                let num = returnPosMessage.length;
                // 判断游戏模式
                switch (active) {
                    case 0:
                        mode = '随机点模式';
                        break;
                    case 1:
                        mode = '自定义模式';
                        break;
                    case 2:
                        mode = '猜地点模式';
                        hiddenMarkers = markers.splice(0);
                        nowMarkersLen = 0;
                        //清空markers，赋值到hiddenMarkers
                        tipsMessage = returnPosMessage.map(item => {
                            return {
                                Posmessage: item.Posmessage,
                                fileList: item.fileList
                            }
                        });

                        // // 清空名称
                        tmp = returnPosMessage.map(item => item.Postitle = '');
                        returnPosMessage = tmp;
                        break;
                    default:
                        break;
                }
                // 设置活动信息
                that.setData({
                    markers,
                    markersLen,
                    nowMarkersLen,
                    returnPosMessage,
                    active,
                    mode,
                    tipsMessage,
                    hiddenMarkers,
                })
            })
        })
        // 节流函数，3s调用全览函数
        that.throttle = throttle(that.showPoint, 3000);
    },


    onReady: function (e) {
        this.mapCtx = wx.createMapContext('myMap', this)
        this.getMyLocation();
    },
    onHide: function () {
        console.log("onHide");
        console.log("Hide,stop timer!");
        r && (clearTimeout(r), r = !1);
        u && (clearTimeout(u), u = !1);
        this.data.settimer && (clearInterval(this.data.settimer),
            this.data.settimer = !1), this.data.client && this.data.client.connected && (console.log("onHide:执行client.end"),
                this.data.client.end(!0));
    },
    onUnload: function () {
        console.log("onUnload");
        r && (clearTimeout(r), r = !1);
        u && (clearTimeout(u), u = !1);
        this.data.settimer && (clearInterval(this.data.settimer),
            this.data.settimer = !1), this.data.client && this.data.client.connected && (console.log("onHide:执行client.end"),
                this.data.client.end(!0));
    },

    // 第一次加载坐标
    getbackgroudloation: function () {
        let that = this
        var o = function (e) {
            console.log(e);
            var lat = e.latitude,
                lon = e.longitude;
            let y = Date.parse(new Date()) / 1e3;
            console.log("locattionnowtime时间戳为：" + y);
            console.log("locattionlasttime时间戳为：" + I);
            if (y - I <= 2)
                console.log("auto update time <2s ,break!");
            else {
                I = y;
                console.log("gcj02本机lat:" + lat);
                console.log("gcj02本机lon:" + lon);
                console.log("lat:" + lat);
                console.log("lon:" + lon);
                console.log("name:" + that.data.name);
                console.log("avatarUrl:" + that.data.avatarUrl);
                var d = new Object();
                //发送更新命令
                d.cmd = "update",
                    d.clientId = that.data.options.clientId,
                    d.timestamp = y,
                    d.lat = lat,
                    d.lon = lon,
                    d.type = "gcj02",
                    d.name = that.data.name;
                d.avatarUrl = that.data.avatarUrl;
                d.startState = that.data.startState;
                d.endState = that.data.endState;
                var r = new Date();
                d.time = r.toString();
                d.topic = that.data.devUpdateTopic;
                console.log(d);
                console.log("TOPIC:" + that.data.devUpdateTopic);

                if (that.data.devUpdateTopic) {
                    // var g = new Object();
                    // g.topic = d.topic,
                    //     g.clientId = d.clientId,
                    //     g.type = d.type,
                    //     g.cmd = d.cmd,
                    //     g.timestamp = d.timestamp,
                    //     g.lat = d.lat,
                    //     g.lon = d.lon,
                    //     g.name = d.name;
                    // g.avatarUrl = d.avatarUrl;
                    // udp通讯
                    // var h = en.Encrypt(JSON.stringify(g));
                    // console.log("udp" + h),
                    //     that.data.udp.send({
                    //         address: "gps.osdiy.cn",
                    //         port: 3100,
                    //         message: h
                    //     });
                    var m = en.Encrypt(JSON.stringify(d));
                    that.data.client ?
                        (
                            console.log("发送update 数据"),
                            that.data.client.publish(that.data.devUpdateTopic, m, {
                                qos: 1
                            })) :
                        (that.data.client.end(!0),
                            connectT && (clearTimeout(connectT), connectT = false),
                            connectT = setTimeout(function () {
                                console.log("延时再连接"),
                                    that.onShow();
                            }, 1e3), console.log("刷新不正常，重连接"));
                }
            }
        };

        // 后台定位权限
        wx.getSetting({
            success: function (t) {
                t.authSetting["scope.userLocationBackground"] ?
                    (console.log("已授权后台位置"),
                        wx.startLocationUpdateBackground({
                            success: function (e) {
                                console.log("开启后台定位", e), wx.onLocationChange(o);
                            },
                            fail: function (e) {
                                console.log("开启后台定位失败", e);
                            }
                        })) : wx.authorize({
                            scope: "scope.userLocationBackground",
                            success: function (e) {
                                wx.showModal({
                                    title: "提示",
                                    content: "授权失败，点击右上角设置位置为使用时和离开后!",
                                    success: function (e) {
                                        e.confirm && wx.openSetting({
                                            complete: function (e) {
                                                e.authSetting = {
                                                    "scope.userLocationBackground": !0
                                                }, wx.startLocationUpdateBackground({
                                                    success: function (e) {
                                                        console.log("后台授权-success-res:", e), console.log(e), wx.onLocationChange(o);
                                                    },
                                                    fail: function (e) {
                                                        console.log("后台授权====fail失败--res:", e);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            },
                            fail: function (t) {
                                console.log("后台授权失败 --- userLocation", t);
                                // e.getnomalloation();
                                console.log("普通定位授权！");
                            }
                        });
            },
            fail: function (e) {
                console.log("getSetting--失败", e);
            }
        });
    },

    // 移动回到当前位置
    showCurPos() {
        if (!this.mapCtx) return;
        // 地图移动回当前位置
        this.mapCtx.moveToLocation({
            success: res => {
                // 防止重复触发,只触发最后一次
                if (this.data.mapT) clearTimeout(this.data.mapT);
                // 获取当前位置的经纬度
                this.setData({
                    mapT: setTimeout(() => {
                        this.getMyLocation()
                    }, 1000)
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
        let that = this;
        console.log("我调用了");
        try {
            if (!this.mapCtx) return;
            // this.mapCtx.getScale({
            //     success(res) {
            //         if (res.scale > 18) {                     
            //         }
            //     },
            //     fail(res) {
            //         console.log(res);
            //     }
            // })

            //包含所有坐标点
            let includePointsData = []
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
        } finally {
        }
    },
    // 计算两点经纬度之间的距离 单位：km
    getDistance(latFrom, lngFrom, latTo, lngTo) {
        var rad = function (d) { //角度转弧度
            return parseFloat(d * Math.PI / 180.0);
        }
        var EARTH_RADIUS = 6378.13649;
        var radLatFrom = rad(latFrom);
        var radLatTo = rad(latTo);
        //差值
        var a = Math.abs(radLatFrom - radLatTo);
        var b = Math.abs(rad(lngFrom) - rad(lngTo));
        var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.pow(Math.sin(b / 2), 2)));
        distance = distance * EARTH_RADIUS;
        distance = Math.round(distance * 1e4) / 1e4;
        console.log(distance + "两点之间距离");
        return parseFloat(distance.toFixed(3));
    },
    // 记录轨迹
    ShowPolyline: function () {
        this.setData({
            enableShowPolyline: !this.data.enableShowPolyline
        });
        // 默认开启轨迹

        // 关闭轨迹
        if (!this.data.enableShowPolyline) {
            this.setData({
                polylinecolor: "#fff",
            });
            wx.showToast({
                title: "关闭轨迹显示",
                icon: "none",
                duration: 2e3
            })
        } else {
            this.setData({
                polylinecolor: "#1e90ff",
            });
            wx.showToast({
                title: "打开轨迹显示,开始记录移动轨迹",
                icon: "none",
                duration: 2e3
            })
        }
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

    onShow: function () {
        let that = this;
        // 清空现有的原始marker
        let markers = that.data.markers;
        let markerid = that.data.markerid;
        let nowMarkersLen = that.data.nowMarkersLen;
        markers.splice(nowMarkersLen); //清空用户
        markerid = 10; //复原
        that.setData({
            markers,
            markerid,
        })

        // that.data.udp = wx.createUDPSocket();
        // that.data.udp.bind();
        // that.data.udp.onMessage(that.onUdpMessage);
        // console.log("UDP INIT!");

        // 连接服务器
        that.data.client = connect("wxs://".concat(that.data.host, "/mqtt"), that.data.options)
        that.data.client.on('connect', () => {
            console.log("成功连上MQTT服务器！")
            // if (this.data.clientCallback) {
            //   this.data.clientCallback(this.data.client)
            //  }
            // 订阅主题
            console.log(that.data.roomId);
            that.data.client.subscribe("/SharePos/" + that.data.roomId + "/update", function (err) {
                if (err) {
                    console.log("订阅报错")
                } else {
                    that.setData({
                        devUpdateTopic: "/SharePos/" + that.data.roomId + "/update"
                    });
                    wx.showToast({
                        title: "正在获取【" + that.data.roomId + "】的位置",
                        icon: "none",
                        duration: 1000
                    });
                    console.log("订阅/SharePos/" + that.data.roomId + "/update")
                }
            })
            that.data.client.subscribe("/SharePos/" + that.data.roomId + "/get",
                function (err) {
                    if (err) {
                        console.log("订阅出错");
                    } else {
                        that.setData({
                            devGetTopic: "/SharePos/" + that.data.roomId + "/get",
                        })
                        wx.showToast({
                            title: "正在获取【" + that.data.roomId + "】的位置",
                            icon: "none",
                            duration: 1000
                        }); //订阅后发布主题
                        console.log("订阅/SharePos/" + that.data.roomId + "/get");
                        that.clickRefresh()
                    }
                }
            )
        })
        that.data.client.on('message', function (topic, message) {
            if (message.length > 0) {
                console.log('收到' + topic + '下发的消息：')
                let c;
                try {
                    var d = en.Decrypt(message.toString());
                    console.log("收到后，解密数据：" + d);
                    c = JSON.parse(d); //uint8Array转JSON
                } catch (e) {
                    console.log("尝试不解密序列化");
                    if (!(c = JSON.parse(message.toString())))
                        return void console.log("解密parse出错，退出");
                    console.log("不解密序列化正常");
                }
                // 判断状态 解密 解析
                // let c = JSON.parse(message) //uint8Array转JSON
                console.log(c);
                if (c) {
                    that.data.receiveflag = !0;
                    switch (c.cmd) {
                        case 'refresh':
                            console.log("refresh cmd");
                            nt = Date.parse(new Date()) / 1e3
                            console.log("当前时间戳为" + nt);
                            console.log("以前时间戳为：" + lt);
                            if (nt - lt <= 2)
                                return void console.log("reflesh time <3s,break!");
                            lt = nt;
                            //对比以前时间戳，节流
                            wx.getLocation({
                                type: "gcj02",
                                success: (res) => {
                                    const latitude = res.latitude
                                    const longitude = res.longitude
                                    const nickname = that.data.name
                                    const avatarUrl = that.data.avatarUrl;
                                    const startState = that.data.startState;
                                    const endState = that.data.endState;
                                    let UpdateObj = new Object();
                                    UpdateObj.cmd = "update";
                                    UpdateObj.clientId = that.data.options.clientId;
                                    UpdateObj.timestamp = nt;
                                    UpdateObj.lat = latitude;
                                    UpdateObj.lon = longitude;
                                    UpdateObj.type = "gcj02";
                                    UpdateObj.name = nickname;
                                    UpdateObj.avatarUrl = avatarUrl;
                                    UpdateObj.startState = startState;
                                    UpdateObj.endState = endState;
                                    let time = new Date()
                                    UpdateObj.time = time;
                                    console.log(UpdateObj);
                                    console.log(that.data.devUpdateTopic);
                                    // let h = en.Encrypt(JSON.stringify(UpdateObj));
                                    // console.log("udp:" + h),
                                    //     that.data.udp.send({
                                    //         address: "gps.osdiy.cn",
                                    //         port: 3100,
                                    //         message: h
                                    //     });
                                    let m = en.Encrypt(JSON.stringify(UpdateObj));

                                    if (that.data.devUpdateTopic) {
                                        that.data.client.publish(
                                            that.data.devUpdateTopic,
                                            m, {
                                            qos: 1
                                        }
                                        )
                                    } else {
                                        connectT && (clearTimeout(connectT), connectT = false), connectT = setTimeout(function () {
                                            console.log("延时再连接"), that.onShow();
                                        }, 1e3);
                                    }
                                    that.setData({
                                        longitude: longitude,
                                        latitude: latitude
                                    })
                                },
                                fail: function (e) {
                                    console.error(e), console.log("获取本机gps失败！");
                                },
                                complete: function (e) { }
                            })
                            break;
                        case 'update':
                            if ("gcj02" === c.type) {
                                let lat = c.lat,
                                    lon = c.lon,
                                    timestamp = c.timestamp,
                                    startState = c.startState,
                                    endState = c.endState,
                                    clientId = c.clientId;
                                console.log("lat:" + c.lat)
                                console.log("lon:" + c.lon)
                                console.log("name:" + c.name)
                                console.log("avatarUrl:" + c.avatarUrl);
                                that.addmarker(lat, lon, c, clientId, timestamp);
                                that.getMaxMinLongitudeLatitude()
                                //检测当前位置是否到达标记点

                                if (that.data.recoredPolyline && c.name === that.data.name) {
                                    that.addpolyline(lat, lon)
                                }
                                if (startState) {
                                    that.onlyOneFn();//获取所有活动数据
                                }
                                if (startState && endState) {
                                    that.End();
                                }
                            }

                            // 有两个以上的markers才自动缩放地图，5s缩放一次
                            if (that.data.markers.length >= 2) {
                                that.throttle();
                            }
                            break;
                        default:
                            break;
                    }

                    // p && (clearTimeout(p), p = !1), p = setTimeout(function () {

                    // }, 3e3);
                }
            }
        })
        that.data.client.on("error", function (e) {
            console.log(" 服务器 error 的回调" + e);
        });
        that.data.client.on("reconnect", function () {
            console.log(" 服务器 reconnect的回调");
        });
        that.data.client.on("offline", function (e) {
            console.log(" 服务器offline的回调");
        });

    },

    showTips(e) {
        console.log(e);
        this.setData({
            showTips: true,
        })
    }, // 确认提交modal

    // 点击标记点
    onPointTap: function (e) {
        console.log(e);
        let that = this;

        var clickmarkerId = e.detail.markerId; // 获取点击的markers  id
        let currentdatabase = this.data.returnPosMessage;
        that.setData({
            clickmarkerId, //方便外部获取
        })
        var markersda = this.data.markers;
        //定位所点击的坐标点
        let index = markersda.findIndex(item => item.id == clickmarkerId)
        console.log(index);

        if (index && currentdatabase[+index]) {
            // markerid从1开始
            that.setData({
                showModal: true,
                Postitle: currentdatabase[index].Postitle,
                Posmessage: currentdatabase[index].Posmessage,
                fileList: currentdatabase[index].fileList,
            })
        }
    },

    // js小数相加的精度问题：先化为整数相加后再除回去
    accAdd: function (e, t) {
        var o, a, n;
        try {
            o = e.toString().split(".")[1].length;
        } catch (e) {
            o = 0;
        }
        try {
            a = t.toString().split(".")[1].length;
        } catch (e) {
            a = 0;
        }
        return (e * (n = Math.pow(10, Math.max(o, a))) + t * n) / n;
    },

    // 添加轨迹
    addpolyline: function (lat, lng) {
        let mypoints = this.data.mypoints;
        if (0 == this.data.lastlat) {
            this.data.lastlat = lat, this.data.lastlon = lng;
            //获取当前经纬度
        } else {
            var distance;
            //计算添加点与当前未更新的经纬度距离
            distance = this.getDistance(lat, lng, this.data.lastlat, this.data.lastlon);
            console.log("1 len:" + distance); //一段的距离
            this.data.totallen = this.accAdd(distance, this.data.totallen).toFixed(3);
            console.log("total len:" + this.data.totallen);
            this.data.lastlat = lat, this.data.lastlon = lng;
            let i = new Date().getTime();
            let min = Math.round((parseInt(i) - parseInt(this.data.starttime)) / 1e3 / 60);//分钟
            let lenmessage = `已走距离:${this.data.totallen}公里,时长:${min}分钟`;

            this.setData({
                lenmessage,
            })
        }
        mypoints.push({
            latitude: lat,
            longitude: lng
        });

        this.setData({
            "polyline[0].points": mypoints,
        });
    },
    // 添加新用户的marker
    addmarker(latitude, longitude, obj, clientId, timestamp) {
        console.log({ latitude, longitude, obj, clientId, timestamp });
        if (typeof (clientId) === "undefined") return; //不是用户则直接返回

        var that = this,
            markers = that.data.markers,
            nowMarkersLen = that.data.nowMarkersLen,
            isSame = false;
        let avatarUrl = obj.avatarUrl;
        // 跳过自定义坐标点
        for (let index = nowMarkersLen; index < markers.length; index++) {
            const obj = markers[index];
            console.log(obj.clientId, clientId);
            if (obj.clientId === clientId) { //已存在的用户更新气泡数据
                isSame = true;
                obj.timestamp = timestamp;
                obj.latitude = latitude;
                obj.longitude = longitude;
            }
        }


        // 短路运算，isSame为false才执行
        // 不存在的用户添加

        console.log('isSame' + isSame, "nowclientis:", clientId);
        isSame ||
            (markers.push({
                clientId: clientId,
                timestamp: timestamp,
                iconPath: avatarUrl,
                id: that.data.markerid,
                latitude: latitude,
                longitude: longitude,
                label: {
                    borderWidth: 4,
                    borderColor: '#fff',
                    borderRadius: 8,
                    height: 38,
                    width: 38,
                    anchorX: -19,
                    anchorY: -45,
                },
                width: 31,
                height: 31,
                anchor: {
                    x: 0.5,
                    y: 1.3,
                },
                callout: {
                    fontSize: 14,
                    padding: 3,
                    borderRadius: 4,
                    anchorY: -5,
                    color: '#FFFFFF',
                    bgColor: '#6495ED',
                    content: obj.name,
                    display: "ALWAYS",
                }
            }),
                that.data.markerid++, //下一个的id
                console.log("addmarker ok markerid :" + that.data.markerid))

        // 添加markers，使用addMarkers而不是setdata，防止并发渲染两个框
        // if (!that.mapCtx) return;
        // that.mapCtx.addMarkers({
        //     clear: false,
        //     markers,
        //     success: (res) => {
        //         console.log('removeMarkers', res)
        //     }
        // })
        that.setData({
            markers,
        })
    },

    // 断开连接
    logout: function () {
        console.log("app 11onLoad:erase the deviceIMEI!");
        wx.setStorageSync("deviceIMEI", ""),
            wx.setStorageSync("roomId", "");
        wx.setStorageSync("userinfo", "");

        if (this.data.client && this.data.client.connected) {
            this.data.client.end(true);
            this.data.client.unsubscribe(this.data.devUpdateTopic);
            this.data.client.unsubscribe(this.data.devGetTopic);
        }
    },

    // 刷新
    clickRefresh() {
        console.log("刷新:this.data.devGetTopic:" + this.data.devGetTopic);
        let that = this;
        that.data.receiveflag = !1;
        if (that.data.client && that.data.client.connected) {
            let t = new Object()
            t.cmd = 'refresh'; //信息
            console.log(t);
            that.data.client.publish(that.data.devGetTopic, JSON.stringify(t), {
                qos: 1
            });
            wx.showToast({
                title: "请求刷新成功"
            })
            console.log("r", r);
            console.log("u", u);
            r && (clearTimeout(r), r = !1);
            r = setTimeout(function () {
                console.log("延迟调用============");
                if (!1 === that.data.receiveflag) {
                    that.data.client.end(!0);
                    u && (clearTimeout(u), u = !1);
                    u = setTimeout(function () {
                        console.log("延时再连接"), that.onShow();
                    }, 1e3);
                }
            }, 3e3);
        } else {
            wx.showToast({
                title: "请先连接服务器"
            })
            that.data.client.end(!0),
                u && (clearTimeout(u), u = !1),
                u = setTimeout(function () {
                    console.log("延时再连接"), that.onShow();
                }, 1e3), console.log("刷新不正常，重连接");
        }
    },

    // udp
    // onUdpMessage: function (res) {
    //     console.log(res);
    //     if (res.remoteInfo.size > 0) {
    //         console.log("onUdpMessage() 接收数据 " + res.remoteInfo.size + " 字节：" + JSON.stringify(res, null, "\t"));
    //         var e = new Uint8Array(res.message),
    //             t = String.fromCharCode.apply(null, e),
    //             o = decodeURIComponent(escape(t));
    //         console.log("message:" + o);
    //     }
    // },

    // 到达目标坐标点附近50米，震动
    getMaxMinLongitudeLatitude() { //默认附近0.080千米
        let distince = 0.080;
        let r = 6378.13649; // 地球半径千米 gcj02
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
        console.log(lat, lng);
        // 判断标记点是否在当前坐标附近80米内
        let markers;
        if (this.data.active !== 2) {
            markers = this.data.markers;
        } else {
            markers = this.data.hiddenMarkers
        }
        let nowMarkersLen = this.data.nowMarkersLen;
        let tipsMessage = this.data.tipsMessage;
        // 有任务点之后才开始
        let allFinish 
        if(this.data.markersLen > 0){
            allFinish = true;//记录是否所有任务点都完成
        }
        for (let index = 0; index < this.data.markersLen; index++) {
            const item = markers[index];
            if (item.latitude <= +maxlat && item.latitude >= +minlat && item.longitude <= +maxlng && item.longitude >= +minlng) {
                if (typeof (item.hasVibrateShort) == 'undefined') {
                    wx.vibrateLong();
                    item.hasVibrateShort = true;
                    console.log("到达" + item.label.content + '附近');
                    item.iconPath = "/images/finish.png";
                    item.width = 30;
                    item.height = 30;
                    if (this.data.active == 2) {
                        let allMarkers = this.data.markers;
                        if (!allMarkers.includes(item)) {
                            console.log("unshift!....");
                            allMarkers.unshift(item)
                            tipsMessage[index].isFinish = true;//标记为已完成
                            nowMarkersLen++;
                        }
                    }
                }

            }
            // 与上所有的hasVibrateShort，若都为true结果也为true。否则可能是false或者undefined
            if(typeof (item.hasVibrateShort)!='undefined' && item.hasVibrateShort){
                allFinish = allFinish && true;
            }else{
                allFinish  = allFinish && false;
            }
        }
        if (this.data.startState && allFinish) {
            this.setData({
                endState: true,
            })
            console.log("游戏结束");
        }
        this.setData({
            nowMarkersLen,
            tipsMessage,
        })
    },

    // 点击地点提示，有中间弹出框
    checkdetail() {
        console.log('地点提示点击成功');
        this.setData({
            showTips: true,
        })
    },
    // 点击蓝色小图片图标，预览某一地点的图片
    showPointImg(event) {
        console.log('点击图片成功');
        // 拿到图片的地址url
        let currentUrl = event.currentTarget.dataset.src;
        wx.previewImage({
            urls: [currentUrl] // 预览的地址url
        })
    },
    // 关闭地点提示弹出框
    onCloseTips() {
        let that = this;
        that.setData({
            showTips: false,
        }, res => {
            that.setData({
                Posmessage: '',
                Postitle: '',
                fileList: [],
            })
        });
    },

    // 跳转到排行榜页面
    checkRanking() {
        let that = this;
        wx.navigateTo({
            url: '/pages/ranking/ranking?id=' + that.data.roomId
        })
    },

    Start() {
        this.setData({
            startState: true,
        })
        this.getbackgroudloation()
    },
    ForceEnd() {
        let that = this;
        wx.showModal({
            title: '是否确定结束游戏?',
            complete: (res) => {
                if (res.confirm) {
                    setTimeout(function () {
                        that.logout();
                        wx.redirectTo({
                            url: '/pages/ranking/ranking?id=' + that.data.roomId
                        })
                    }, 2000)
                }
                if (res.cancel) {
                    that.setData({
                        endState: false,
                    })
                }
            }
        })
    },
    End() {
        let that = this;
        if (that.data.endState) {
            wx.showToast({
                title: '恭喜你完成任务!',
                duration: 2000,
                icon: 'success',
                success: function () {
                    setTimeout(function () {
                        that.logout();
                        wx.redirectTo({
                            url: '/pages/ranking/ranking?id=' + that.data.roomId
                        })
                    }, 2000)
                }
            })
        }
    }

})

// 只执行一次的函数
function once(fn) {
    let caller = true;
    return function () {
        if (caller) {
            caller = false
            fn.apply(this, arguments)
            fn = null;
        }
    }
}

// 节流函数
// interval 间隔时间，也就是cd的长短
function throttle(fn, interval) {
    //该变量用于记录上一次函数的执行事件
    let lastTime = 0
    const _throttle = function (...args) {
        // 获取当前时间
        const nowTime = new Date().getTime()
        // cd剩余时间
        const remainTime = nowTime - lastTime
        // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
        if (remainTime - interval >= 0) {
            fn.apply(this, args)
            // 将上一次函数执行的时间设置为nowTime，这样下次才能重新进入cd
            lastTime = nowTime
        }
    }
    // 返回_throttle函数
    return _throttle
}