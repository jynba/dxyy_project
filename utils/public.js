var e = require("aes.js"), r = e.enc.Utf8.parse("26212AB12341CAEB"), t = e.enc.Utf8.parse("ABCDEF1234123412");

module.exports.Decrypt = function(n) {
    var p = e.enc.Hex.parse(n), c = e.enc.Base64.stringify(p);
    return e.AES.decrypt(c, r, {
        iv: t,
        mode: e.mode.CBC,
        padding: e.pad.Pkcs7
    }).toString(e.enc.Utf8).toString();
}, module.exports.Encrypt = function(n) {
    var p = e.enc.Utf8.parse(n);
    return e.AES.encrypt(p, r, {
        iv: t,
        mode: e.mode.CBC,
        padding: e.pad.Pkcs7
    }).ciphertext.toString().toUpperCase();
};