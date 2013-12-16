var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/load"] = requestHandlers.load;
handle["/add"] = requestHandlers.add;
handle["/cancelReservation"] = requestHandlers.cancelReservation;
handle["/cancelSequence"] = requestHandlers.cancelSequence;

server.start(router.route, handle);