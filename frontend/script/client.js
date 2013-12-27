(function(namespace) {

	function Client(id, name) {
		
		this.id = id;
		this.name = name;
	}
	Client.prototype.toString = function() {
		return this.name;
	}
	
	var clientsArray = new Array(); //stores all Client objects
	var namesArray = new Array();	//stores only names
	
	namespace.clients = {
	
		create:	createFunction,		
		add:	addFunction,	
		has: 	hasFunction,
		getById: getByIdFunction
	}
	
	//return new Client object
	function createFunction(id, name) {
	
		return new Client(id, name);
	}
	
	//add array of Client objects to clientsArray
	function addFunction(newClients) {
		clientsArray = clientsArray.concat(newClients);
		for (var i = 0; i < newClients.length; i++) {
			namesArray.push(newClients[i].name);
		}
	}
	
	//check if client with this name is in clientsArray
	function hasFunction(name) {
	
		return (namesArray.indexOf(name) != -1);
	}
	
	//get Client object from clientsArray by id
	//function returns null if there is no such object
	function getByIdFunction(id) {
	
		for (var i = 0, j = clientsArray.length; i < j; i++) {
			if (clientsArray[i].id == id) {
				return clientsArray[i];
			}
		}
		return null;
	}
	
})(myNamespace);