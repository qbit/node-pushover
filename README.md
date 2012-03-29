# pushover
Send pushover notifications from Node.JS

## Usage

### Install

	npm install pushover

## Examples

```javascript

var push = require( '../lib/pushover.js' );

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
