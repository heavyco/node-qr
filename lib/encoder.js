var util = require('util'),
    events = require('events'),
    child_process = require('child_process');

var Encoder = exports.Encoder = function(){
    events.EventEmitter.call(this);
}
util.inherits(Encoder, events.EventEmitter);

Encoder.prototype.options = {
     dot_size: 3, // default 3x3px per dot
     margin: 4, // default 4 dots for the margin
     level: 'L', // valid args (lowest to highest): L, M, Q, H
     case_sensitive: true, // case sensitive,
     version: 1 // default version 1
}

Encoder.prototype.encode = function(value, path, options)
{
    // preserve scope in callbacks with self
    var self = this;
    
    try {
        // check for undefined value
        if(value == undefined) {
            throw new Error('No value specified for encode method');
        }
        
        // if options are given, override defaults
        if(options == null) options = {};
        for(var key in options) {
            self.options[key] = options[key];
        }
        
        // start with base set of args that we'll always pass
        var qrencode_args = [
            '-s', self.options.dot_size, 
            '-m', self.options.margin,
            '-l', self.options.level,
            '-v', self.options.version
        ];
        
        // if case-sensitivity is turned disabled, add flag
        if(!self.options.case_sensitive) qrencode_args.push('-i')
        
        // if we have a path, write to the path
        // otherwise, it will write to stdout
        qrencode_args.push('-o');
        if(path != null) {
            qrencode_args.push(path);
        } else {
            qrencode_args.push('-');
        }
        
        // add the value to be encoded
        qrencode_args.push(value);
        
        // create stdout data container
        var stdout, stderr;
        
        // spawn the child process
        var qrencode = child_process.spawn(
            'qrencode', 
            qrencode_args
        );
        
        // add event listener for stdout data and populate stdout var
        // in the event no path was given
        qrencode.stdout.on('data', function(data) {
            stdout = data;
        });
        
        // add event listener for stderr
        
        
        // add listener for process exist and emit end or error event
        // depending on exit code
        qrencode.on('exit', function(code) {
            if(code == 0) {
                self.emit('end', stdout);
            } else {
                self.emit('error', new Error(stderr));
            }
        });
        
    } catch(err) {
        this.emit('error', err);
    }
}