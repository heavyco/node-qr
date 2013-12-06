var vows = require('vows'),
    events = require('events'),
    assert = require('assert'),
    fs = require('fs'),
    util = require('util'),
    child_process = require('child_process'),
    qr = require('../qr');
    
var Encoder = qr.Encoder;
var test_file_name = './test.png';
    
vows.describe('Encoder').addBatch({
    'The libqrencode library': {
        topic: function() {
            var which = child_process.spawn('which', ['qrencode']);
            which.on('exit', this.callback);
        },
        'is installed and available via $PATH': function(exit_code, process) {
            assert.equal(exit_code, null, 'libqrencode does not appear to have been installed properly');
        }
    }
}).addBatch({
    'The encoder': { 
        topic: new(Encoder),
        'is an event emitter': function(encoder) {
            assert.ok((encoder instanceof events.EventEmitter));
        },
        'has some default options': function(encoder) {
            assert.ok(encoder.default_options);
        },
        'has an encode method': function(encoder) {
            assert.ok((typeof encoder.encode == "function"));
        }
    }
}).addBatch({
    'The encode method': {
        'with a provided value': {
            'and a path': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    encoder.encode('test', test_file_name);
                },
                'emits an \'end\' event': function(result, encoder) {
                    return true;
                },
                'creates a PNG file at provided path': function(result, encoder) {
                    var stats = fs.statSync(test_file_name);
                    assert.notEqual(stats.size, 0, 'Zero file size');
                    fs.unlinkSync(test_file_name);
                }
            },
            'and no path': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    encoder.encode('test');
                },
                'emits an \'end\' event': function(result, encoder) {
                    return true;
                },
                'provides PNG data with event': function(result, encoder) {
                    assert.ok((result instanceof Buffer));
                    assert.notEqual(result.length, 0, 'Zero buffer length');
                }
            },
            'and a custom size option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    // set custom dot size of 10px
                    encoder.encode('test', null, { dot_size: 10 });
                },
                'provides PNG data with a custom size': function(result, encoder) {
                    assert.ok((result instanceof Buffer));
                    assert.notEqual(result.length, 0, 'Zero buffer length for custom size');
                }
            },
            'and a custom margin option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    // set custom margin size of 5 dots
                    encoder.encode('test', null, { margin: 5 });
                },
                'provides PNG data with a custom margin': function(result, encoder) {
                    assert.ok((result instanceof Buffer));
                    assert.notEqual(result.length, 0, 'Zero buffer length for custom margin');
                }
            },
            'and a custom level option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    // set a custom level option of 'H'
                    encoder.encode('test', null, { level: 'H' });
                },
                'provides PNG data with a custom level': function(result, encoder) {
                    assert.ok((result instanceof Buffer));
                    assert.notEqual(result.length, 0, 'Zero buffer length for custom level');
                }
            },
            'and a custom version option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    // set a custom version
                    encoder.encode('test', null, { version: 10 });
                },
                'provides PNG data with a different version': function(result, encoder) {
                    assert.ok((result instanceof Buffer));
                    assert.notEqual(result.length, 0, 'Zero buffer length for custom version');
                }
            },
            'and a custom type option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('end', this.callback);
                    // set a custom output
                    encoder.encode('test', null, { type: 'SVG' });
                },
                'provides SVG data' : function(result, encoder) {
                    assert.ok((result instanceof Buffer));
                    assert.notEqual(result.length, 0, 'Zero buffer length for custom type');
                }
            },
            'and an invalid type option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('error', this.callback);
                    // set an incorrect type option
                    encoder.encode('test', null, { type: 'SPVG' });
                },
                'emits an \'error\' event with Error object' : function(result, encoder) {
                    assert.ok((result instanceof Error), 'Unexpected result emitted with error event');
                    assert.notEqual(result.message, "");
                }
            },
            'and an invalid option': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('error', this.callback);
                    // set bad option
                    encoder.encode('test', null, { version: 1000 });
                },
                'emits an \'error\' event with Error object': function(result, encoder) {
                    assert.ok((result instanceof Error), 'Unexpcted result emitted with error event');
                    assert.notEqual(result.message, "");
                }
            },
            'and a bad path': {
                topic: function() {
                    var encoder = new Encoder;
                    encoder.on('error', this.callback);
                    // set a bad  path
                    encoder.encode('test', 'C:/notwindows/');
                },
                'emits an \'error\' event with Error object': function(result, encoder) {
                    assert.ok((result instanceof Error), 'Unexpcted result emitted with error event');
                    assert.notEqual(result.message, "");
                }
            }
        },
        'without a provided value': {
            topic: function() {
                var encoder = new Encoder;
                encoder.on('error', this.callback);
                encoder.encode();
            },
            'emits an \'error\' event with an Error object': function(result, encoder) {
                assert.ok((result instanceof Error), 'Unexpcted result emitted with error event');
                assert.equal(result.message, "No value specified for encode method");
            }
        }
    }
}).export(module);