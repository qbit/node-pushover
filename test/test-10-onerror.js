var Push = require('../lib/pushover.js')

var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  update_sounds: false,
  debug: true,
  onerror: function (err, res) {
    if (res.statusCode == 429) {
      process.exit(0)
    }
  }
})

var msg = {
  message: 'test from ' + process.argv[1],
  sound: 'magic',
  title: 'Well - this is fantastic'
}

var ten = [1,2,3,4,5,6,7,8,9,10];

ten.forEach(function() {
  p.send(msg, function (err, result, res) {
    console.log('====> On error test')
  });
});
