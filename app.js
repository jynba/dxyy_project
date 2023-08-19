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
                env: '',
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
        // 活动地点
        map: [{
            "name": "红色东莞",
            "scale": 16,
            "data": [
                {
                latitude: 22.796092,
                longitude: 113.632321,
                name: '海战博物馆',
                image: 'https://p1.ssl.qhimg.com/t01b8bd5fa219b64b19.jpg'
              },
              {
                latitude: 22.75883,
                longitude: 113.66341,
                name: '虎门炮台',
                image: 'https://youimg1.c-ctrip.com/target/100e0y000000lma72515B.jpg'
              },
              {
                latitude: 22.824252,
                longitude: 113.659932,
                name: '林则徐纪念馆',
                image: 'https://pic.baike.soso.com/ugc/baikepic2/11122/20200620020834-327388368_jpeg_697_504_69457.jpg/0'
              },
              {
                latitude: 22.819096,
                longitude: 113.667486,
                name: '太平手袋厂陈列馆',
                image: "http://dx.dg.gov.cn/dx/jdskpd/202011/03e1f8a40dbe43e6aafc0a61f534bd1e/images/c87d55e64f8041199dc9de9a625850f5.png"
              },
              {
                latitude: 22.784733,
                longitude: 113.687632,
                name: '蒋光鼐故居',
                image:"https://tse1-mm.cn.bing.net/th/id/OIP-C.JOYUtUNfNBarK_jT61oXMAHaFC?pid=ImgDet&rs=1"
              },
              {
                latitude:22.758242,
                longitude: 113.663617,
                name: '沙角炮台',
                image:"https://ts1.cn.mm.bing.net/th/id/R-C.34a96710c7faccc0ceacdad280c2696c?rik=7DttAUbsdAUYuA&riu=http%3a%2f%2fimg1.qunarzz.com%2ftravel%2fpoi%2f1501%2f6a%2f20c7d16dd3d4e3.jpg_r_1024x683x95_21ebdb0a.jpg&ehk=0JJjnG2%2bawypRP0fsyNSgDiRhOxGNNjSoZGQ0UD8ddk%3d&risl=&pid=ImgRaw&r=0"
              },
            ]
          },
          {
            "name": "潮州八景",
            "scale": 16,
            "data": [
                {
                latitude: 23.662586,
                longitude: 116.655377,
                name: '湘桥春涨',
                image: 'https://bkimg.cdn.bcebos.com/pic/d50735fae6cd7b899758d7b30c2442a7d9330ecd?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5'
              },{
                latitude: 23.663897,
                longitude: 116.660373,
                name: '韩祠橡木',
                image: 'https://bkimg.cdn.bcebos.com/pic/a1ec08fa513d26970e38e56d56fbb2fb4316d813?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5'
              },{
                latitude: 23.674207,
                longitude: 116.649769,
                name: '金山古松',
                image: 'https://bkimg.cdn.bcebos.com/pic/a8014c086e061d954ff4da0878f40ad162d9ca54?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5'
              },{
                latitude: 23.644835,
                longitude: 116.651663,
                name: '凤凰时雨',
                image: 'https://bkimg.cdn.bcebos.com/pic/f3d3572c11dfa9ec3fef08156bd0f703908fc1eb?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5'
              },{
                latitude: 23.647195,
                longitude: 116.658606,
                name: '龙湫宝塔',
                image: 'https://bkimg.cdn.bcebos.com/pic/63d9f2d3572c11dfe47f5213602762d0f703c250?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U4MA==,g_7,xp_5,yp_5'
              },{
                latitude: 23.690524,
                longitude: 116.648324,
                name: '鳄渡秋风',
                image: 'https://bkimg.cdn.bcebos.com/pic/b17eca8065380cd71fb94fdda244ad345982815f?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5'
              },{
                latitude: 23.673755,
                longitude: 116.643534,
                name: '西湖鱼筏',
                image: "https://bkimg.cdn.bcebos.com/pic/314e251f95cad1c8793311177c3e6709c93d5172?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U4MA==,g_7,xp_5,yp_5"
              },{
                latitude: 23.673829,
                longitude: 116.6517,
                name: '北阁佛灯',
                image: "https://bkimg.cdn.bcebos.com/pic/838ba61ea8d3fd1f96164e0a334e251f95ca5fe7?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U4MA==,g_7,xp_5,yp_5"
              },
            ]
          },
          {
            "name": "岭南文化",
            "scale": 16,
            "data": [
                {
                latitude: 23.137972,
                longitude: 113.262939,
                name: '五羊石像',
                image: 'https://bkimg.cdn.bcebos.com/pic/4b90f603738da97793d5e286bc51f8198718e3a1?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5'
              },{
                latitude: 23.126828,
                longitude: 113.26995,
                name: '南越王博物馆',
                image: 'https://bkimg.cdn.bcebos.com/pic/11385343fbf2b21193130b4e5ad172380cd79123202b?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5'
              },{
                latitude:23.128228,
                longitude: 113.259848,
                name: '六榕寺',
                image: 'https://bkimg.cdn.bcebos.com/pic/29381f30e924b8997bba06456e061d950b7bf6cd?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5'
              },{
                latitude: 23.126669,
                longitude: 113.245729,
                name: '陈家祠堂',
                image: 'https://bkimg.cdn.bcebos.com/pic/0df431adcbef76094b36710f5096b4cc7cd98d103045?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxNTA=,g_7,xp_5,yp_5'
              },{
                latitude: 23.086212,
                longitude: 113.425741,
                name: '黄埔军校',
                image: 'https://bkimg.cdn.bcebos.com/pic/7c1ed21b0ef41bd56047223458da81cb38db3dde?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UyNzI=,g_7,xp_5,yp_5'
              },{
                latitude: 23.132872,
                longitude:113.264691,
                name: '中山纪念堂',
                image: 'https://bkimg.cdn.bcebos.com/pic/96dda144ad345982b644b7f30ff431adcaef8480?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxNTA=,g_7,xp_5,yp_5'
              }
            ]
          },
          {
            "name": "顺峰山公园",
            "scale": 16,
            "data": [
                {
                latitude: 22.823888,
                longitude: 113.2773,
                name: '迎春亭',
                image: 'https://youimg1.c-ctrip.com/target/100q0y000000m75ec3B24.jpg'
              },{
                latitude: 22.82346,
                longitude: 113.27902,
                name: '青云塔',
                image: 'https://i1.hdslb.com/bfs/archive/1abede8e7c6771bef1905a5e41028034259993e9.jpg'
              },{
                latitude: 22.824531,
                longitude: 113.280474,
                name: '汀芷园',
                image: 'http://p9.itc.cn/q_70/images03/20201213/a539a7fb9161432199b36f629bf0a3a2.jpeg'
              },{
                latitude: 22.821176,
                longitude: 113.293933,
                name: '湿地花海',
                image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F66a969b7-f2c2-4a2b-b32e-bcc26b1b776d%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1682908449&t=f98f729bc892a3adb84c30308d425e70'
              },{
                latitude: 22.815367,
                longitude: 113.277638,
                name: '观音堂',
                image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fss2.meipian.me%2Fusers%2F9294353%2F7bc8287c02b29eb7dc7fa27719b84312.jpg%3Fmeipian-raw%2Fbucket%2Fivwen%2Fkey%2FdXNlcnMvOTI5NDM1My83YmM4Mjg3YzAyYjI5ZWI3ZGM3ZmEyNzcxOWI4NDMxMi5qcGc%3D%2Fsign%2F1dc9a10ccf2b765e9bbd1d04de29dcdd.jpg&refer=http%3A%2F%2Fss2.meipian.me&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1682908744&t=b63b50c173d855842b48545c40cf009f'
              },{
                latitude: 22.819441,
                longitude:113.285389,
                name: '伏波桥',
                image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fc3b284f9-9602-4caa-92d1-c96f3f3fff65%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1682909003&t=cf4519a8fad21e04709e28e7bf39dbbb'
              },{
                latitude: 22.819031,
                longitude: 113.295332,
                name: '野生雀鸟岛',
                image: 'https://photo.tuchong.com/1339488/f/549060964.jpg'
              },

            ]
          },
        ]
    }

})