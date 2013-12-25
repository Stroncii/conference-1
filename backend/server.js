var http = require("http");
var url = require("url");
var connect = require("connect");

function start(route, handle) {
	
	function onRequest(request, response) {
	
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");

		route(handle, pathname, request, response);
	}

	connect.createServer().use(connect.static(__dirname + "/../frontend")).use(onRequest).listen(80);
	console.log("Ready on port 80");
}

exports.start = start;