var vows = require('vows'),
    assert = require('assert'),
    util = require('util'),
    qr = require('../qr');
    
vows.describe('QR').addBatch({
    'The QR module': { 
        topic: qr,
        'exists': function(qr) {
            assert.notEqual(qr, undefined, 'QR module is undefined');
        },
        'has an encoder object': function(qr) {
            assert.notEqual(qr.Encoder, undefined, 'QR Encoder undefined');
        }
    }
}).export(module);