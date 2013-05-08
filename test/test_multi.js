var push = require( '../lib/pushover.js' );

var p = new push( {
	// user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
	debug: true
});

var msg = {
	message: 'omg node test',
	title: "Well - this is fantastic",
  user: process.env['PUSHOVER_USER']
};

// console.log( p );

p.send( msg, function( err, result ) {
	console.log( err );
	console.log( result );
  process.exit(0);
});
