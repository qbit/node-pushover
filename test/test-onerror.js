var push = require( '../lib/pushover.js' );

var p = new push( {
	user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
	update_sounds: false,
	debug: true,
	onerror: function(err) {
		console.log('ERROR!', err);
	}
});

var msg = {
	message: 'omg node test',
	sound: 'magic',
	title: "Well - this is fantastic",
};

// console.log( p );

p.send( msg, function( err, result ) {
	console.log( 'error', err );
	console.log( 'result', result );
	// process.exit(0);
});
