![Pushover](https://pushover.net/assets/pushover-header-0f47af8e08d8bef658a999a9e6584fcc.png)

Send [pushover.net](http://pushover.net) notifications from Node.JS

## Usage

### Install

	npm install pushover-notifications
	
### Pushover API values

Any API paramaters, as found on https://pushover.net/api, can be passed in the object. For example, `retry` and `expire` can be added to the object being passed to `.send`! Here's an example with many different parameters.
```javascript
var msg = {
	message: "This is a message",
	title: "Well - this is fantastic",
	sound: 'magic',
	device: 'test_device',
	priority: 2,
	url: "http://pushover.net",
	url_title: "Pushover Website"
};
```
## Examples

### Sending a message
```javascript

var push = require( 'pushover-notifications' );

var p = new push( {
	user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
	// onerror: function(error) {},
	// update_sounds: true // update the list of sounds every day - will
	// prevent app from exiting.
});

var msg = {
	// These values correspond to the parameters detailed on https://pushover.net/api
	// 'message' is required. All other values are optional.
	message: 'omg node test',	// required
	title: "Well - this is fantastic",
	sound: 'magic',
	device: 'devicename',
	priority: 1
};

p.send( msg, function( err, result ) {
	if ( err ) {
		throw err;
	}

	console.log( result );
});
```

### Sending a message to multiple users
```javascript

var users = [
  'token1',
  'token2',
  'token3'
];

var msg = {
  message: 'omg node test',
  title: "Well - this is fantastic",
  sound: 'magic' // optional
  priority: 1 // optional,
};

for ( var i = 0, l = users.length; i < l; i++ ) {

  msg.user = users[i];
  // token can be overwritten as well.

  p.send( msg, function( err, result ) {
    if ( err ) {
      throw err;
    }

    console.log( result );
  });
}

```
