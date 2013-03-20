Run on the commandline like,
	node app.js

This will print out usage syntax. Examples:

	node app.js 'https://github.com/bcelenza/node-qr' ~/tmp/
	
    node app.js 'https://github.com/bcelenza/node-qr' ~/tmp/ 100
	
	node app.js 'https://github.com/bcelenza/node-qr' /Users/ablair/Desktop/ 50
	
This script will generate a QR code png called 'qr_code.png' at the given path. Make sure you have the trailing slash in your path.