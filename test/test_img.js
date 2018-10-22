var Push = require('../lib/pushover.js')
var fs = require('fs')

var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  update_sounds: false,
  debug: true
})

var msg = {
  message: 'test from ' + process.argv[1],
  sound: 'magic',
  title: 'Image loaded sync',
  file: 'test/test_img.png'
}

p.send(msg, function (err, result, res) {
  console.log('====> Sync image test')
  if (err) {
    console.log(err)
    process.exit(1)
  }
  process.exit(0)
})

fs.readFile('test/test_img.png', function(err, data) {
  var ap = new Push({
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN'],
    update_sounds: false,
    debug: true
  })

  var o = {
    name: 'pushover.png',
    data: data
  }

  var amsg = {
    message: 'test from ' + process.argv[1],
    sound: 'magic',
    title: 'Image loaded async',
    file: o
  }

  ap.send(amsg, function (err, result, res) {
    console.log('====> Async image test')
    if (err) {
      console.log(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
