var Encoder = require('./qr').Encoder,
    Benchmark = require('benchmark');
var encoder = new Encoder;
var suite = new Benchmark.Suite

suite.add('Encoder#encode()', function(){
  encoder.encode('node-qr');
})
.on('cycle', function(event, bench){
  console.log(String(bench));
})
.on('complete', function(){
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });