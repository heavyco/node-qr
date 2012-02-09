var Encoder = require('./qr').Encoder,
    Decoder = require('./qr').Decoder,
    Benchmark = require('benchmark');
var encoder = new Encoder;
var decoder = new Decoder;
var suite = new Benchmark.Suite

suite.add('Encoder#encode()', function(){
    encoder.encode('node-qr');
})
.add('Decoder#decode()', function(){
    decoder.on('error', function(err){
        console.log('Error: ' + err.message);
    });
    decoder.decode(__dirname + '/test/test-file.png');
})
.on('cycle', function(event, bench){
    console.log(String(bench));
})
.on('complete', function(){
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });