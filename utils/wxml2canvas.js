const wxml = (name, share_img, qrcode_img) => {
    return `
    <view class="container" >
      <view class="item-box">
      <image class="img" src='`+ share_img + `'></image>
      </view>
      <view class="item-box2" >
        <text class="text">`+ name + `</text>
      </view>
      <view class="item-box3">
      <image class="img2" src='`+ qrcode_img + `'></image>
      </view>
    </view>
    `
}

const style = {
    container: {
        width: 300,
        height: 456,
        backgroundColor: '#fff',
    },
    itemBox: {
        width: 300,
        height: 260,
        alignItems: 'center',
    },
    itemBox2: {
        width: 300,
        height: 50,
        alignItems: 'center',
        marginTop: 20
    },
    itemBox3: {
        width: 300,
        height: 120,
        alignItems: 'center'
    },
    img: {
        width: 270,
        height: 251,
        marginTop: 15
    },
    img2: {
        width: 100,
        height: 100,
    },
    text: {
        width: 260,
        height: 40,
        textAlign: 'center',
        fontSize: 14,
        marginTop: 5,
        lineHeight: '1.1em',
        scale: 1
    }
}


module.exports = {
    wxml, style
}