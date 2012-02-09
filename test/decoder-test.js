var vows = require('vows'),
    events = require('events'),
    assert = require('assert'),
    fs = require('fs'),
    util = require('util'),
    child_process = require('child_process'),
    qr = require('../qr');
    
var Decoder = qr.Decoder;
    
vows.describe('Decoder').addBatch({
    'The decoder': { 
        topic: new(Decoder),
        'is an event emitter': function(decoder) {
            assert.ok((decoder instanceof events.EventEmitter));
        },
        'has a decode method': function(decoder) {
            assert.ok((typeof decoder.decode == "function"));
        }
    }
})
.addBatch({
    'The decode method': {
        'without a provided path': {
            topic: function(){
                var decoder = new Decoder;
                decoder.on('error', this.callback);
                // pass no path
                decoder.decode();
            },
            'emits an \'error\' event with a helpful message': function(result, decoder) {
                assert.ok((result instanceof Error), 'Unexpected result emitted with error event.');
                assert.equal(result.message, 'No path provided');
            }
        },
        'with an invalid path': {
            topic: function(){
                var decoder = new Decoder;
                decoder.on('error', this.callback);
                decoder.decode(__dirname + '/does-not-exist.png');
            },
            'emits an \'error\' event with a helpful message': function(result, decoder) {
                assert.ok((result instanceof Error), 'Unexpected result emitted with error event.');
                assert.equal(result.message, 'Provided path not found');
            }
        },
        'with a valid path': {
            'to a valid qr code image': {
                topic: function(){
                    var decoder = new Decoder;
                    decoder.on('end', this.callback);
                    decoder.decode(__dirname + '/test-file.png');
                },
                'emits an \'end\' event with the expected result': function(result, decoder) {
                    assert.ok((typeof result == "string"), 'Unexpected result emitted with end event.');
                    assert.equal(result, 'Stay hungry, stay foolish.');
                }
            },
            'to an invalid qr code image': {
                topic: function(){
                    var decoder = new Decoder;
                    decoder.on('error', this.callback);
                    // pass it a good path, but with no qr code
                    decoder.decode(__dirname + '/bad-file.jpg');
                },
                'emits an \'error\' event with a helpful message': function(result, decoder) {
                    assert.ok((result instanceof Error), 'Unexpected result emitted with error event.');
                    assert.equal(result.message, 'No QR code found');
                }
            }
        }
    }
})
.addBatch({
    'The decode method': {
        'with a URL': {
            topic: function() {
                var decoder = new Decoder;
                decoder.on('error', this.callback);
                decoder.decode('http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=Stay%20hungry%2C%20stay%20foolish.&chld=H|0');
            },
            'emits an \'error\' event with a helpful message': function(result, decoder) {
                assert.ok((result instanceof Error), 'Unexpected result emitted with error event.');
                assert.equal(result.message, 'Sorry, URLs are not directly supported at this time');
            }
        }
    }
})
.export(module);