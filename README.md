# Node QR #

node-qr is a simple NodeJS binding to the libqrencode C library written by Kentaro Fukuchi (http://fukuchi.org/works/qrencode/index.en.html).

## Installation ##

To use node-qr, you will first need to install the libqrencode C library

For Mac OS X (assumed MacPorts installed)

    port install qrencode
    
For Ubuntu Linux

    apt-get install qrencode
    
Others (see instructions on site)

    http://fukuchi.org/works/qrencode/index.en.html
 
   
Node-qr is available in the Node Package Manager (NPM)

    npm install qr

## Usage ##

Currently node-qr only comes with an encoder. The usage is simple

    encoder.encode(value, path = null, options = {});

First, require the module

    var Encoder = require('qr').Encoder;
    var encoder = new Encoder;

The following example will encode a given value and emit an 'end' event with PNG data upon completion

    // add an event listener for the 'end' event
    // which fires upon encoding completion
    encoder.on('end', function(png_data){
        // png_data is an instance of Buffer
        // do something
    });
    encoder.encode('some value');
    
Alternatively, you can pass a file path for the PNG data to be saved to

    encoder.on('end', function(){
        // if you specify a file path, nothing will be passed to the end listener
        // do something
    });
    encoder.encode('some value', '/tmp/my_qr_file.png');
    
If at any time an error occurs, an 'error' event will be emitted

    encoder.on('error', function(err){
        // err is an instance of Error
        // do something
    });
    
See the tests in test/qr.js for more ways to use the encoder.

While node-qr and libqrencode can encode images up to 4000 characters, this library makes no attempt to automatically set error correction and version options based on the size of the value (yet, anyway). You are responsible for determining what length your values will be and adjusting the options accordingly.

See [2D QR Code Barcode Generation Guide](http://www.idautomation.com/barcode/qr-code.html#Data_Encoded) for more information on limitations of QR Codes and the devices that read them.
    
## Encoder Options ##

The following options can be passed via the third argument of the encode method, which should be an object

* background_color: self explanatory
* foreground_color: self explanatory
* dot_size: specify the size of dot (pixel). (default=3)
* margin: specify the width of margin. (default=4)
* level: specify error correction level from L (lowest) to H (highest). (default=L)
* case_sensitive: ignore case distinctions and use only upper-case characters. (default=true)
* version: specify the version of the symbol. (default=1)
* type: type of image to export ('PNG','EPS','SVG','ANSI','ANSI256','ASCII','ASCIIi','UTF8','ANSIUTF8')

For more information around options, see the docs provided for the libqrencoder library [here](http://fukuchi.org/works/qrencode/index.en.html "libqrencoder")

## Feedback/Pull Requests ##

Feedback and pull requests are always welcomed. This is a work-in-progress. Any help is greatly appreciated.

## Who's Using node-qr? ##

* Rax.io (Rackspace Short URL Service) - http://rax.io

## Are you using node-qr? ##

If you are using Node QR in a production environment, I'd love to know! Send me a PM or email if you don't mind being listed in this readme.