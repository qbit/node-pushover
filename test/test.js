var Push = require('../lib/pushover.js')

var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  update_sounds: false,
  debug: true
})

var msg = {
  message: 'test from ' + process.argv[1],
  sound: 'magic',
  title: 'Well - this is fantastic'
}

p.send(msg, function (err, result, res) {
  console.log('====> Regular test')
  if (err) {
    console.log(err)
    process.exit(1)
  }
  process.exit(0)
})
