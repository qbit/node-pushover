![Pushover](img/pushover-header.png)

Send [pushover.net](http://pushover.net) notifications from Node.JS

[![Build Status](https://travis-ci.org/qbit/node-pushover.svg?branch=master)](https://travis-ci.org/qbit/node-pushover)
[![Coverity Scan Build Status](https://scan.coverity.com/projects/10939/badge.svg)](https://scan.coverity.com/projects/qbit-node-pushover)


[![NPM](https://nodei.co/npm/pushover-notifications.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pushover-notifications/)

## Usage

### Install

	npm install pushover-notifications

### Pushover API values

Any API parameters, as found on https://pushover.net/api, can be passed in the object. For example, `retry` and `expire` can be added to the object being passed to `.send`! Here's an example with many different parameters.
```javascript
var msg = {
  message: "This is a message",
  title: "Well - this is fantastic",
  sound: 'magic',
  device: 'test_device',
  priority: 2,
  url: "http://pushover.net",
  url_title: "Pushover Website"
}
```
## Examples

### Sending a message
```javascript

var Push = require( 'pushover-notifications' )

var p = new Push( {
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  // httpOptions: {
  //   proxy: process.env['http_proxy'],
  //},
  // onerror: function(error) {},
  // update_sounds: true // update the list of sounds every day - will
  // prevent app from exiting.
})

var msg = {
  // These values correspond to the parameters detailed on https://pushover.net/api
  // 'message' is required. All other values are optional.
  message: 'omg node test',	// required
  title: "Well - this is fantastic",
  sound: 'magic',
  device: 'devicename',
  priority: 1
}

p.send( msg, function( err, result ) {
  if ( err ) {
    throw err
  }

  console.log( result )
})
```

### Sending a message with an attachment (blocking)
```javascript

var Push = require( 'pushover-notifications' )

var p = new Push( {
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  // httpOptions: {
  //   proxy: process.env['http_proxy'],
  //},
  // onerror: function(error) {},
  // update_sounds: true // update the list of sounds every day - will
  // prevent app from exiting.
})

var msg = {
  // These values correspond to the parameters detailed on https://pushover.net/api
  // 'message' is required. All other values are optional.
  message: 'omg node test',	// required
  title: "Well - this is fantastic",
  sound: 'magic',
  device: 'devicename',
  priority: 1,
  file: '/tmp/fantastic.png' // this will read using fs.readFileSync()!
}

p.send( msg, function( err, result ) {
  if ( err ) {
    throw err
  }

  console.log( result )
})
```

### Sending a message with an attachment (non-blocking)
```javascript

var Push = require( 'pushover-notifications' )
var fs = require( 'fs' )

fs.readFile('/tmp/fantastic.png', function(err, data) {
  var p = new Push( {
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN'],
    // httpOptions: {
    //   proxy: process.env['http_proxy'],
    //},
    // onerror: function(error) {},
    // update_sounds: true // update the list of sounds every day - will
    // prevent app from exiting.
  })

  var msg = {
    // These values correspond to the parameters detailed on https://pushover.net/api
    // 'message' is required. All other values are optional.
    message: 'omg node test',	// required
    title: "Well - this is fantastic",
    sound: 'magic',
    device: 'devicename',
    priority: 1,
    file: { name: 'fantastic.png', data: data }
  }
  
  p.send( msg, function( err, result ) {
    if ( err ) {
      throw err
    }
  
    console.log( result )
  })
})
```

### Sending a message to multiple users

```javascript

var users = [
  'token1',
  'token2',
  'token3'
]

var msg = {
  message: 'omg node test',
  title: "Well - this is fantastic",
  sound: 'magic' // optional
  priority: 1 // optional,
  file: '/tmp/fancy_image.png' // optional
  // see test/test_img.js for more examples of attaching images
}

for ( var i = 0, l = users.length; i < l; i++ ) {
  msg.user = users[i]
  // token can be overwritten as well.

  p.send( msg, function( err, result ) {
    if ( err ) {
      throw err
    }

    console.log( result )
  })
}
```
