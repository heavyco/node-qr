var vows = require('vows'),
    events = require('events'),
    assert = require('assert'),
    fs = require('fs'),
    util = require('util'),
    qr = require('../qr');
    
var Encoder = qr.Encoder;
var test_file_name = './test.png';
    
vows.describe('Encoder').addBatch({
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
                    assert.equal(stats.size, 237, 'Unexpected file size');
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
                    assert.equal(result.length, 237, 'Unexpected buffer length');
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
                    assert.equal(result.length, 330, 'Unexpected buffer length for custom size');
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
                    assert.equal(result.length, 235, 'Unexpected buffer length for custom margin');
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
                    assert.equal(result.length, 231, 'Unexpected buffer length for custom level');
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
                    assert.equal(result.length, 867, 'Unexpected buffer length for custom version');
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
                    assert.ok((result instanceof Error));
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
                    assert.ok((result instanceof Error));
                    assert.notEqual(result.message, "");
                }
            }
        }
    }
}).export(module);