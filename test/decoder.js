var vows = require('vows'),
    events = require('events'),
    assert = require('assert'),
    fs = require('fs'),
    util = require('util'),
    child_process = require('child_process'),
    qr = require('../qr');
    
var Decoder = qr.Decoder;
var test_file_name = './test-decoder.png';
    
vows.describe('Decoder').addBatch({
    'The decoder library': {
        topic: function() {
            var cmd_options = {
                cwd: __dirname + '/../include/zxing-1.6'
            };
            var java = child_process.spawn('java', [
                '-cp', 
                'javase/javase.jar:core/core.jar', 
                'com.google.zxing.client.j2se.CommandLineRunner'
            ], cmd_options);
            java.on('exit', this.callback);
        },
        'is installed and available': function(exit_code, process) {
            assert.equal(exit_code, null, 'the decoder library does not appear to have been installed properly');
        }
    }
}).addBatch({
    'The decoder': { 
        topic: new(Decoder),
        'is an event emitter': function(decoder) {
            assert.ok((decoder instanceof events.EventEmitter));
        },
        'has some default options': function(decoder) {
            assert.ok(decoder.default_options);
        },
        'has a decode method': function(decoder) {
            assert.notEqual(decoder.decode, undefined, 'decode method undefined');
            assert.ok((typeof decoder.decode == "function"));
        }
    }
}).addBatch({
    'The decode method': {
        'without a value': {
            topic: function() {
                var decoder = new Decoder;
                decoder.on('error', this.callback);
                decoder.decode();
            },
            'emits an \'error\' event with an Error object': function(result, decoder) {
                assert.ok((result instanceof Error));
            }
        },
        'with a value': {
            'that is a URL': {
                topic: function() {
                    var decoder = new Decoder;
                    decoder.on('end', this.callback);
                    decoder.decode('https://www.google.com/chart?chs=150x150&cht=qr&chl=test%20value');
                },
                'emits an \'end\' event with a value': function(result, decoder) {
                    assert.ok((result instanceof Buffer));
                    assert.equal(result, 'test value', 'Unexpected value returned for QR URL');
                }
            },
            'that is a file path': {
                topic: function() {
                    var decoder = new Decoder;
                    decoder.on('end', this.callback);
                    decoder.decode(__dirname + '/test_value_qr.png');
                },
                'emits an \'end\' event with a value': function(result, decoder) {
                    assert.ok((result instanceof Buffer));
                    assert.equal(result, 'test value', 'Unexpected value returned for QR file');
                }
            }
        }
    }
}).export(module);