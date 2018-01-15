var Push = require('../lib/pushover.js')

var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'] + 'ERROR_TEST',
  update_sounds: false,
  debug: true,
  onerror: function (err) {
    console.log('ERROR!', err)
    if (err.match('application token is invalid')) {
      process.exit(0)
    } else {
      console.log('OMG')
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
  console.log('error', err)
  console.log('result', result)
  console.log('res.headers', res.headers)
})
