var util = require('util'),
    events = require('events'),
    child_process = require('child_process');

var Encoder = exports.Encoder = function(){
    events.EventEmitter.call(this);


}
util.inherits(Encoder, events.EventEmitter);

Encoder.prototype.default_options = {
    foreground_color: '#000000', // change foreground color in qrencode v3.4.0+
    background_color: '#FFFFFF', // change background color in qrencode v3.4.0+
    dot_size: 3, // default 3x3px per dot
    margin: 4, // default 4 dots for the margin
    level: 'L', // valid args (lowest to highest): L, M, Q, H
    case_sensitive: true, // case sensitive,
    version: 1, // default version 1,
    type : null // Default to null type, removing this flag qrencode < v3.4.0
};

Encoder.prototype.types = ['PNG', 'EPS', 'SVG', 'ANSI', 'ANSI256', 'ASCII',
  'ASCIIi', 'UTF8', 'ANSIUTF8', null];

/**
 * Converts a string value to QR Code PNG data, and optionally saves to a file
 *
 * @param String value      The value to be encoded
 * @param String path       Where to save the PNG file (optional)
 * @param Object options    A hash of options (optional)
 * @return void
 */
Encoder.prototype.encode = function(value, path, options)
{
    // preserve scope in callbacks with self
    var self = this,
        cmd_options, qrencode_args, stdout, stderr, qrencode, exitcode;

    try {
        // check for undefined value
        if(value == undefined) {
            throw new Error('No value specified for encode method');
        }

        // create new buffer for value
        value = new Buffer(value);

        // if options are given, override defaults
        cmd_options = {};
        if(options == null) options = {};
        for(var key in this.default_options) {
            cmd_options[key] = (options[key] == undefined) ?
                this.default_options[key]
                : options[key];
        }

        // start with base set of args that we'll always pass
        qrencode_args = [
            '-s', cmd_options.dot_size,
            '-m', cmd_options.margin,
            '-l', cmd_options.level,
            '-v', cmd_options.version
        ];

        // only set foreground and background colors if they differ from
        // defaults to maintain compatibility with qrencode pre-v3.4.0
        if(cmd_options.foreground_color !== self.default_options.foreground_color
          || cmd_options.background_color !== self.default_options.background_color) {

          // remove # symbol from color codes because qrencoder does not like it
          cmd_options.foreground_color = cmd_options.foreground_color.replace('#', '');
          cmd_options.background_color = cmd_options.background_color.replace('#', '');

          qrencode_args.push(
            '--foreground=' + cmd_options.foreground_color,
            '--background=' + cmd_options.background_color
          );
        }

        // Only include the type flag if it has been passed to
        // maintain compatibility with qrencode pre-v3.4.0
        if(cmd_options.type !== null){
            if(self.types.indexOf(cmd_options.type.toUpperCase()) === -1){
                throw new Error('type must be one of ', self.types.toString());
            }
            qrencode_args.push('-t' + cmd_options.type);
        }

        // if case-sensitivity is disabled, add flag
        if(!cmd_options.case_sensitive) qrencode_args.push('-i');

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

        // spawn the child process
        qrencode = child_process.spawn(
            'qrencode',
            qrencode_args
        );

        // add event listener for stdout data and populate stdout var
        // in the event no path was given
        qrencode.stdout.on('data', function(data) {
            stdout = data;
        });

        // add event listener for stderr
        qrencode.stderr.on('data', function(data) {
            stderr = data;
        });

        // add listener for process exit and save exit code
        qrencode.on('exit', function(code) {
            exitcode = code;
        });

        // add listener for filehandle close and emit end or error event
        // depending on exit code
        qrencode.on('close', function() {
            if(exitcode !== 0) {
                self.emit('error', new Error(stderr));
            } else {
                self.emit('end', stdout);
            }
        });

    } catch(err) {
        this.emit('error', err);
    }
}
