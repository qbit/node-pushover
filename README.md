![Pushover](https://pushover.net/assets/pushover-header-0f47af8e08d8bef658a999a9e6584fcc.png)

Send [pushover.net](http://pushover.net) notifications from Node.JS

## Usage

### Install

	npm install pushover-notifications

## Examples

### Sending a message
```javascript

var push = require( 'pushover-notifications' );

var p = new push( {
	user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
});

var msg = {
	message: 'omg node test',
	title: "Well - this is fantastic",
	sound: 'magic', // optional
	priority: 1 // optional
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
