var push = require( '../lib/pushover.js' );

var p = new push( {
	user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
	httpOptions: {
        	proxy: process.env['http_proxy'],
        },
	update_sounds: false,
	debug: true
});

var msg = {
	message: 'test from ' + process.argv[1],
	sound: 'magic',
	title: "test from",
};

// console.log( p );

p.send( msg, function( err, result ) {
	console.log( 'error', err );
	console.log( 'result', result );
	// process.exit(0);
});
