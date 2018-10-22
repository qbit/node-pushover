var Push = require('../lib/pushover.js')

var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'] + 'ERROR_TEST',
  update_sounds: false,
  debug: true,
  onerror: function (err, res) {
    console.log('ERROR!', err)
    if (err.match('application token is invalid')) {
      if (res) {
        console.log(res.headers)
      }
      process.exit(0)
    } else {
      process.exit(1)
    }
  }
})

var msg = {
  message: 'test from ' + process.argv[1],
  sound: 'magic',
  title: 'Well - this is fantastic'
}

p.send(msg, function (err, result, res) {
  console.log('====> On error test')
})
