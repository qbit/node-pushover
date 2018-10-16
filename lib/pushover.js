var https = require('https')
var http = require('http')
var url = require('url')
var qs = require('querystring')
var pUrl = 'https://api.pushover.net/1/messages.json'
var FormData = require('form-data')

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

function Pushover (opts) {
  var self = this
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
    d = JSON.parse(d)
  }

  if (d.errors) {
    if (this.onerror) {
      this.onerror(d.errors[0], res)
    } else {
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
      var j = JSON.parse(data)
      self.errors(data, res)
      self.sounds = j.sounds
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
  var form = new FormData()
  var proxy
  o.method = 'POST'

  obj = setDefaults(obj)

  form.append('token',self.token || obj.token)
  form.append('user',self.user || obj.user)

  var p
  for (p in obj) {
    form.append(p,obj[p])
  }

	o.headers = form.getHeaders()

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

  form.submit(o,function(err,res) {
    if(err) {
	    if (fn) {
		    fn(err)
	    }
	    // In the tests the "end" event did not get emitted if  "error" was emitted,
	    // but to be sure that the callback is not get called twice, null the callback function
	    fn = null
    }

	  if (self.debug) {
		  console.log(res.statusCode)
	  }

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



  // if (self.debug) {
  //   console.log(form.replace(self.token, 'XXXXX').replace(self.user, 'XXXXX'))
  // }
}

exports = module.exports = Pushover
