var Filters = {}
var encode

Filters.Base64Filter = (function () {
  var Base64Filter = {}

  // constants
  var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var b64tab = (function (bin) {
    var t = {}
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i
    return t
  })(b64chars)
  var fromCharCode = String.fromCharCode
  // encoder stuff
  var cbUtob = function (c) {
    var cc
    if (c.length < 2) {
      cc = c.charCodeAt(0)
      return cc < 0x80 ? c : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)))
    } else {
      cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00)
      return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)))
    }
  }
  var reUtob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g
  var utob = function (u) {
    return u.replace(reUtob, cbUtob)
  }
  var cbEncode = function (ccc) {
    var padlen = [0, 2, 1][ccc.length % 3]
    var ord = ccc.charCodeAt(0) << 16 | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0))
    var chars = [b64chars.charAt(ord >>> 18), b64chars.charAt((ord >>> 12) & 63), padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)]
    return chars.join('')
  }
  var btoa = function (b) {
    return b.replace(/[\s\S]{1,3}/g, cbEncode)
  }
  var _encode = function (u) {
    return btoa(utob(u))
  }
  encode = function (u, urisafe) {
    return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g,
      function (m0) {
        return m0 === '+' ? '-' : '_'
      }).replace(/=/g, '')
  }
  // decoder stuff
  var reBtou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g')
  var cbBtou = function (cccc) {
    switch (cccc.length) {
      case 4:
        var cp = ((0x07 & cccc.charCodeAt(0)) << 18) | ((0x3f & cccc.charCodeAt(1)) << 12) | ((0x3f & cccc.charCodeAt(2)) << 6) | (0x3f & cccc.charCodeAt(3))
        var offset = cp - 0x10000
        return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00))
      case 3:
        return fromCharCode(((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2)))
      default:
        return fromCharCode(((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1)))
    }
  }
  var btou = function (b) {
    return b.replace(reBtou, cbBtou)
  }
  var cbDecode = function (cccc) {
    var len = cccc.length
    var padlen = len % 4
    var n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0)
    var chars = [fromCharCode(n >>> 16), fromCharCode((n >>> 8) & 0xff), fromCharCode(n & 0xff)]
    chars.length -= [0, 0, 2, 1][padlen]
    return chars.join('')
  }
  var atob = function (a) {
    return a.replace(/[\s\S]{1,4}/g, cbDecode)
  }
  var _decode = function (a) {
    return btou(atob(a))
  }
  var decode = function (a) {
    return _decode(String(a).replace(/[-_]/g,
      function (m0) {
        return m0 === '-' ? '+' : '/'
      }).replace(/[^A-Za-z0-9\+\/]/g, ''))
  }

  var install = function (Vue, options) {
    Vue.filter('base64', {
      read: function (val) {
        return decode(val)
      },
      write: function (val, oldVal) {
        return encode(val)
      }
    })
    // Vue.filter('base64', function (val, method) {
    //   if (method === 'decode') {
    //     return decode(val)
    //   }
    //   if (method === 'encode') {
    //     return encode(val)
    //   }
    // })
  }
  Base64Filter.install = install
  return Base64Filter
})()

Filters.install = function (Vue, options) {
  Vue.use(Filters.Base64Filter)
}
export default Filters
export {encode}
