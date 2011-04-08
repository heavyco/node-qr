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
            var which = child_process.spawn('which', ['qrencode']);
            which.on('exit', this.callback);
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
}).export(module);