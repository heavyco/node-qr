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
        
        // create stdout data container
        var stdout, stderr;
        
        // spawn the child process
        var decoder = child_process.spawn(
            'java',
            [
                '-jar',
                'qrcode-cui.jar',
                value
            ],
            {
                cwd: __dirname + '/../include/qrcode/bin'
            }
        );
        
        // add event listener for stdout data and populate stdout var
        // in the event no path was given
        decoder.stdout.on('data', function(data) {
            stdout = data;
        });
        
        // add event listener for stderr
        decoder.stderr.on('data', function(data) {
            stderr = data;
        });
        
        // add listener for process exist and emit end or error event
        // depending on exit code
        decoder.on('exit', function(code) {
            if(code == 0 && stdout instanceof Buffer) {
                // strip the trailing new line
                self.emit('end', stdout.slice(0, stdout.length-1));
            } else {
                self.emit('error', new Error(stderr));
            }
        });
        
    } catch(err) {
        this.emit('error', err);
    }
}