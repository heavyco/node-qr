var util = require('util'),
    events = require('events'),
    child_process = require('child_process');

var Decoder = exports.Decoder = function(){
    events.EventEmitter.call(this);
    
    
}
util.inherits(Decoder, events.EventEmitter);

Decoder.prototype.default_options = {
    
};

Decoder.prototype.decode = function(value, options)
{
    // preserve scope in callbacks with self
    var self = this;
    
    try {
        // check for undefined value
        if(value == undefined) {
            throw new Error('No value specified for encode method');
        }
        
    } catch(err) {
        this.emit('error', err);
    }
}