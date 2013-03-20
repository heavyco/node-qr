if ( process.argv.length >= 4 ){
	console.info('\nString to encode: ' + process.argv[2] + "\n");
	console.info('\nPath to save png: ' + process.argv[3] + "\n");
	var sourceStr = process.argv[2];
	var outputPath = process.argv[3];
}else{
	console.error('\nUsage: node app.js string path [int dot size (default is 3)]\n');
	return;
}

if (process.argv.length == 5){
	console.info('\nDot size: ' + process.argv[4] + "\n");
	var dotSize = process.argv[4];
}else{
	console.info('\nUsing default dot size: 3\n');
	var dotSize = 3;
}

var fs = require('fs');

fs.exists(outputPath, function (exists) {
	if (exists){
		console.info("verified: path exists");
	}else{
		console.error('"Error: path not found"');
		return;
	}
});

var Encoder = require('qr').Encoder;
var encoder = new Encoder;

encoder.on('end', function(){
    // if you specify a file path, nothing will be passed to the end listener
    // do something
});

encoder.on('error', function(err){
    // err is an instance of Error
    // do something
	console.error(err);
});

var destination = outputPath + '/qr_code.png';
encoder.encode(sourceStr, destination, {dot_size:dotSize});

//open the file
var exec = require('child_process').exec,
    child;

child = exec('open ' + destination,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});