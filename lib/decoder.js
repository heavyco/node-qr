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
        var java = child_process.spawn(
            'java',
            [
                '-cp',
                'javase/javase.jar:core/core.jar',
                'com.google.zxing.client.j2se.CommandLineRunner',
                value
            ],
            {
                cwd: __dirname + '/../include/zxing-1.6'
            }
        );
        
        // add event listener for stdout data and populate stdout var
        // in the event no path was given
        java.stdout.on('data', function(data) {
            stdout = data;
        });
        
        // add event listener for stderr
        java.stderr.on('data', function(data) {
            stderr = data;
        });
        
        // add listener for process exist and emit end or error event
        // depending on exit code
        java.on('exit', function(code) {
            if(code == 0) {
                // parse value from stdout
                var regexp = new RegExp(/Parsed result:\n([^\n]+)/);
                var out_value = regexp.exec(stdout.toString('utf-8'));
                util.debug(util.inspect(out_value, true));
                if(out_value && typeof out_value === "object") {
                    self.emit('end', new Buffer(out_value[1]));
                } else {
                    self.emit('error', new Error('Could not parse result from input'));
                }
            } else {
                self.emit('error', new Error(stderr));
            }
        });
        
    } catch(err) {
        this.emit('error', err);
    }
}