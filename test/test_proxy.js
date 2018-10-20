var Push = require('../lib/pushover.js')

var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  httpOptions: {
    proxy: process.env['http_proxy']
  },
  update_sounds: false,
  debug: true
})

var msg = {
  message: 'test from ' + process.argv[1],
  sound: 'magic',
  title: 'test from'
}

p.send(msg, function (err, result) {
  console.log('====> Proxy test')
  if (err) {
    console.log(err)
    process.exit(1)
  }
  process.exit(0)
})
