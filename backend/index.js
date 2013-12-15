var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/load"] = requestHandlers.load;
handle["/add"] = requestHandlers.add;

server.start(router.route, handle);