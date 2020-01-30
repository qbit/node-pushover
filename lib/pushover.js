var fs = require('fs')
var https = require('https')
var http = require('http')
var url = require('url')
var qs = require('querystring')
var pUrl = 'https://api.pushover.net/1/messages.json'
var path = require('path')

function setDefaults (o) {
  var def = [
    'device',
    'title',
    'url',
    'url_title',
    'priority',
    'timestamp',
    'sound'
  ]

  var i = 0
  var l = def.length
  for (; i < l; i++) {
    if (!o[def[i]]) {
      o[def[i]] = ''
    }
  }

  return o
}

function loadImage(imgPath) {
  var o = {}
  o.name = path.basename(imgPath)
  o.data = fs.readFileSync(imgPath)
  return o
}


function reqString2MP(rs, b, imgObj) {
  var a = []
  var parts = []
  var o = qs.parse(rs)

  a.push(b)

  for (var p in o) {
    if (o[p] !== '') {
      a.push('Content-Disposition: form-data; name="' + p + '"')
      a.push("")
      a.push(o[p])
      a.push(b)
    }
  }

  if (imgObj) {
    a.push('Content-Disposition: form-data; name="attachment"; filename="' + imgObj.name + '"')
    if (imgObj.hasOwnProperty('type')) {
      a.push('Content-Type: ' + imgObj.type)
    } else {
      a.push('Content-Type: application/octet-stream')
    }
    a.push('')
    a.push('')
  } else {
    a.splice(-1, 1)
  }

  var payload
  if (imgObj) {
    payload = Buffer.concat([
      Buffer.from(a.join('\r\n'), 'utf8'),
      Buffer.from(imgObj.data, 'binary'),
      Buffer.from('\r\n' + b + '--\r\n', 'utf8')
    ])
  } else {
    payload = Buffer.concat([
      Buffer.from(a.join('\r\n'), 'utf8'),
      Buffer.from(b + '--\r\n', 'utf8')
    ])
  }
  return payload
}

function Pushover (opts) {
  var self = this
  this.boundary = "--" + Math.random().toString(36).substring(2)
  this.token = opts.token
  this.user = opts.user
  this.httpOptions = opts.httpOptions
  this.sounds = {
    'pushover': 'Pushover (default)',
    'bike': 'Bike',
    'bugle': 'Bugle',
    'cashregister': 'Cash Register',
    'classical': 'Classical',
    'cosmic': 'Cosmic',
    'falling': 'Falling',
    'gamelan': 'Gamelan',
    'incoming': 'Incoming',
    'intermission': 'Intermission',
    'magic': 'Magic',
    'mechanical': 'Mechanical',
    'pianobar': 'Piano Bar',
    'siren': 'Siren',
    'spacealarm': 'Space Alarm',
    'tugboat': 'Tug Boat',
    'alien': 'Alien Alarm (long)',
    'climb': 'Climb (long)',
    'persistent': 'Persistent (long)',
    'echo': 'Pushover Echo (long)',
    'updown': 'Up Down (long)',
    'none': 'None (silent)'
  }

  if (opts.debug) {
    this.debug = opts.debug
  }

  if (opts.onerror) {
    this.onerror = opts.onerror
  }

  if (opts.update_sounds) {
    self.updateSounds()
    setInterval(function () {
      self.updateSounds()
    }, 86400000)
  }
}


Pushover.prototype.errors = function (d, res) {
  if (typeof d === 'string') {
    try {
      d = JSON.parse(d)
    } catch (error) {
      this.onerror(error, res)
    }
  }

  if (d.errors) {
    if (this.onerror) {
      this.onerror(d.errors[0], res)
    } else {
      // If no onerror was provided throw our error
      throw new Error(d.errors[0], res)
    }
  }
}

Pushover.prototype.updateSounds = function () {
  var self = this
  var data = ''
  var surl = 'https://api.pushover.net/1/sounds.json?token=' + self.token
  var req = https.request(url.parse(surl), function (res) {
    res.on('end', function () {
      try {
        var j = JSON.parse(data)
        self.errors(data, res)
        self.sounds = j.sounds
      } catch (error) {
        self.errors('Pushover: parsing sound data failed', res)
      }
    })

    res.on('data', function (chunk) {
      data += chunk
    })
  })

  req.on('error', function (e) {
    self.errors(e)
  })

  req.write('')
  req.end()
}

Pushover.prototype.send = function (obj, fn) {
  var self = this
  var o = url.parse(pUrl)
  var proxy
  o.method = 'POST'

  obj = setDefaults(obj)

  var reqString = {
    token: self.token || obj.token,
    user: self.user || obj.user
  }

  var p
  for (p in obj) {
    if (obj[p] !== '') {
      if (p !== 'file') {
        reqString[ p ] = obj[p]
      }
    }
  }

  reqString = qs.stringify(reqString)

  var mp
  if (obj.file) {
    if (typeof obj.file === 'string') {
      mp = reqString2MP(reqString, self.boundary, loadImage(obj.file))
    }
    if (typeof obj.file === 'object') {
      mp = reqString2MP(reqString, self.boundary, obj.file)
    }
  } else {
      mp = reqString2MP(reqString, self.boundary)
  }

  o.headers = {
    'Content-type': 'multipart/form-data; boundary=' + self.boundary.substring(2),
    'Content-Length': mp.length
  }

  var httpOpts = self.httpOptions || {}
  if (httpOpts) {
    Object.keys(httpOpts).forEach(function (key) {
      if (key !== 'proxy') {
        o[key] = httpOpts[key]
      }
    })
  }

  if (httpOpts.hasOwnProperty('proxy') && httpOpts.proxy && httpOpts.proxy !== '') {
    proxy = url.parse(httpOpts.proxy)
    o.headers.Host = o.host
    o.host = proxy.hostname
    o.protocol = proxy.protocol
  }

  var request
  if ((httpOpts.proxy && httpOpts.proxy !== '') || pUrl.match(/http:/)) {
    request = http.request
  } else {
    request = https.request
  }

  var req = request(o, function (res) {
    if (self.debug) {
      console.log(res.statusCode)
    }
    var err
    var data = ''
    res.on('end', function () {
      self.errors(data, res)
      if (fn) {
        fn(err, data, res)
      }
    })

    res.on('data', function (chunk) {
      data += chunk
    })
  })

  req.on('error', function (err) {
    if (fn) {
      fn(err)
    }
  // In the tests the "end" event did not get emitted if  "error" was emitted,
  // but to be sure that the callback is not get called twice, null the callback function
    fn = null
  })

  if (self.debug) {
    console.log(reqString.replace(self.token, 'XXXXX').replace(self.user, 'XXXXX'))
  }

  req.write(mp)
  req.end()
}

exports = module.exports = Pushover
