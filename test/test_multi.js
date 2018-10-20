var Push = require('../lib/pushover.js')

var p = new Push({
  // user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  debug: true
})

var msg = {
  message: 'test from ' + process.argv[1],
  title: 'Well - this is fantastic',
  user: process.env['PUSHOVER_USER']
}

p.send(msg, function (err, result) {
  console.log('====> Multi test')
  if (err) {
    console.log(err)
    process.exit(1)
  }
  process.exit(0)
})
