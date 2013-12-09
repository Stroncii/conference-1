function Client(name, password) {
	
	this.name = name;
	this.password = password;
}

function clients() {

	if (clients.data == undefined) {
		clients.data = [ new Client("Client_1", "1111"),
						 new Client("Client_2", "2222")
		];
		clients.names = new Array();
		for (var i = 0; i < clients.data.length; i++) {
			clients.names.push(clients.data[i].name);
		}
	}
	
	return {
	
		add: function(newClient) {
				if (newClient != undefined) {
					clients.data.push(newClient);
				}
			},
			
		checkPass: function(name, pass) {
				for (var i = 0; i < clients.data.length; i++) {
					if (clients.data[i].name == name && clients.data[i].password == pass) {
						return true;
					}
				}	
				return false;
			},
		
		has: function(name) {
			if (clients.names.indexOf(name) != -1) {
				return true;
			}
			else {
				return false;
			}
		}
	}
}
