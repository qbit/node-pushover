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
  title: 'Testing attachment',
  attachment: fs.createReadStream('img/pushover-header.png')
}

// console.log( p );

p.send(msg, function (err, result, res) {
  console.log('error', err)
  console.log('result', result)
  console.log('res.headers', res.headers)
  // process.exit(0);
})

fs.readFile('img/pushover-header.png', function (err, data) {
  if (err) throw err;

  msg = {
    message: 'test from ' + process.argv[1],
    title: 'Testing attachment from buffer',
    attachment: data
  }

  p.send(msg, function (err, result, res) {
    console.log('error', err)
    console.log('result', result)
    console.log('res.headers', res.headers)
  })
});
