var https = require('https'),
    url = require('url'),
    qs = require('querystring'),
    p_url = 'https://api.pushover.net/1/messages.json';

var request = require('request');

function setDefaults(o) {
    var def = [
	'device',
	'title',
	'url',
	'url_title',
	'priority',
	'timestamp',
	'sound'
    ];

    var i = 0; l = def.length;
    for (; i < l; i++) {
	if (!o[def[i]]) {
	    o[def[i]] = '';
	}
    }

    return o;
}

function Pushover(opts) {
    var self = this;
    this.token = opts.token;
    this.user = opts.user;
    this.httpOptions = opts.httpOptions;
    this.sounds = {
	"pushover":"Pushover (default)",
	"bike":"Bike",
	"bugle":"Bugle",
	"cashregister":"Cash Register",
	"classical":"Classical",
	"cosmic":"Cosmic",
	"falling":"Falling",
	"gamelan":"Gamelan",
	"incoming":"Incoming",
	"intermission":"Intermission",
	"magic":"Magic",
	"mechanical":"Mechanical",
	"pianobar":"Piano Bar",
	"siren":"Siren",
	"spacealarm":"Space Alarm",
	"tugboat":"Tug Boat",
	"alien":"Alien Alarm (long)",
	"climb":"Climb (long)",
	"persistent":"Persistent (long)",
	"echo":"Pushover Echo (long)",
	"updown":"Up Down (long)",
	"none":"None (silenthhhhh)"
    };

    if (opts.debug) {
	this.debug = opts.debug;
    }

    if (opts.onerror) {
	this.onerror = opts.onerror;
    }

    if (opts.update_sounds) {
	self.updateSounds();
	setInterval(function() {
	    self.updateSounds();
	}, 86400000);
    }
}

Pushover.prototype.errors = function(d) {
    if (typeof d === 'string') {
	d = JSON.parse(d);
    }

    if (d.errors) {
	if (this.onerror) {
	    this.onerror.call(null, d.errors[0]);
	} else {
	    throw new Error(d.errors[0]);
	}
    }
};

Pushover.prototype.updateSounds = function() {
    var self = this, data = '';
    var surl = 'https://api.pushover.net/1/sounds.json?token=' + self.token;
    
    request.get({url:surl}, function (err, httpResponse, data) {
    	if (self.debug) {
    	    console.log(httpResponse.statusCode);
    	}
    	if (err) {
    		//??
    	} else {
    		var j = JSON.parse(data);
    	    self.errors(data);
    	    self.sounds = j.sounds;    	}
    }).on('error', function(err) {
    	// ??
    });
    
};

Pushover.prototype.send = function(obj, fn) {
    var self = this;
    
    obj = setDefaults(obj);

    var req_string = {
    		token: self.token || obj.token,
    		user: self.user || obj.user
    };

    var p;
    for (p in obj) {
    	req_string[ p ] = obj[p];
    }
    
    var err;
    
    request.post({url:p_url, qs: req_string, headers: self.httpOptions}, function optionalCallback(err, httpResponse, data) {
    	if (self.debug) {
    	    console.log(httpResponse.statusCode);
    	}
    	if (err) {
    	    	if (fn) {
    	    	    fn.call(null, err);
    	    	}
    	} else {
    	    self.errors(data);
    	    if (fn) {
    	    	fn.call(null, err, data);
    	    }
    	}
    }).on('error', function(err) {
    	if (fn) {
    	    fn.call(null, err);
    	}
    	// In the tests the "end" event did not get emitted if  "error" was emitted,
    	// but to be sure that the callback is not get called twice, null the callback function
    	fn = null;
    });
        
};

exports = module.exports = Pushover;
