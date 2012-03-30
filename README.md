![Pushover](https://pushover.net/assets/pushover-header-0f47af8e08d8bef658a999a9e6584fcc.png)

# [pushover](http://pushover.net)
Send pushover notifications from Node.JS

## Usage

### Install

	npm install pushover-notifications

## Examples

```javascript

var push = require( 'pushover-notifications' );

var p = new push( {
	user: '',
	token: ''
});

var msg = {
	message: 'omg node test',
	title: "Well - this is fantastic",
	//priority: 1,
};

p.send( msg, function( err, result ) {
	if ( err ) {
		throw err;
	}

	console.log( result );
});
```
