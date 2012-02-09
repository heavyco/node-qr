var util = require('util'),
    events = require('events'),
    child_process = require('child_process'),
    fs = require('fs'),
    java = require('java');

var Decoder = exports.Decoder = function(){
    events.EventEmitter.call(this);
}
util.inherits(Decoder, events.EventEmitter);

// set java awt to run headless (prevents AWT thread issues)
java.options.push("-Djava.awt.headless=true");

// add zxing and imageio classes to classpath
java.classpath.push(__dirname + "/../javalib/zxing-core.jar");
java.classpath.push(__dirname + "/../javalib/zxing-javase.jar");
java.classpath.push(__dirname + "/../javalib/classes.jar");

// instantiate new reader, only needs to be done once
var code_reader = java.newInstanceSync("com.google.zxing.MultiFormatReader");

Decoder.prototype.decode = function(path) 
{
    // preserve scope through self
    var self = this;
  
    try {
        // ensure path has been passed
        if(path == undefined) {
            throw new Error('No path provided');
        }
        
        // is it a URL, or a file path?
        if(/^http/.test(path)) {
            // we're dealing with a URL
            throw new Error('Sorry, URLs are not directly supported at this time');
        } else {
            // we're dealing with a file
            self._decodeFile(path, function(err, result) {
                if(err) {
                    self.emit('error', err);
                } else {
                    self.emit('end', result);
                }
            });            
        }
    } catch(err) {
      // pass the error off
      self.emit('error', err);
    }
}

Decoder.prototype._decodeFile = function(path, callback) 
{
    // preserve scope through self
    var self = this;
    
    
    // make sure the path exists
    fs.stat(path, function(err, stats){
        try {
            if(err) {
                throw new Error('Provided path not found');
            }
            
            // create a new file and pass it to the _decode method
            var image = java.newInstanceSync("java.io.File", path);
            self._decode(image, function(err, result){
                // bubble up errors
                if(err) {
                    throw err;
                }
                
                // pass back our result
                callback(null, result);
            });
        
        } catch(err) {
            callback(err);
        }
    });
   
}

Decoder.prototype._decode = function(image, callback) 
{
    try {
        var buffered_image = java.callStaticMethodSync("javax.imageio.ImageIO", "read", image);

        var luminance_source = java.newInstanceSync("com.google.zxing.client.j2se.BufferedImageLuminanceSource", buffered_image);
        var hybrid_binarizer = java.newInstanceSync("com.google.zxing.common.HybridBinarizer", luminance_source);
        var binary_bitmap = java.newInstanceSync("com.google.zxing.BinaryBitmap", hybrid_binarizer);
        var result = code_reader.decodeSync(binary_bitmap);
        
        // if the image passed had no qr code, getText will throw an exception
        // which we need to capture and adjust the message for
        try {
            callback(null, result.getTextSync());
        } catch(err) {
            // rethrow with better message
            throw new Error('No QR code found');
        }
    } catch(err) {
        callback(err);
    }
}