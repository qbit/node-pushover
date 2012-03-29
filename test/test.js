var push = require( '../lib/pushover.js' );

var p = new push( {
	user: '',
	token: '',
	debug: true
});

var msg = {
	message: 'omg node test',
	title: "Well - this is fantastic",
};

// console.log( p );

p.send( msg, function( err, result ) {
	console.log( err );
	console.log( result );
});
