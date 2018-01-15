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

// console.log( p );

p.send(msg, function (err, result, res) {
  console.log('error', err)
  console.log('result', result)
  console.log('res.headers', res.headers)
  // process.exit(0);
})
