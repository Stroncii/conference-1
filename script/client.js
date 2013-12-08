function Client(name, password) {
	
	this.name = name;
	this.password = password;
}

function clients() {

	if (clients.data == undefined) {
		clients.data = [ new Client("Client_1", "1111"),
						 new Client("Client_2", "2222")
		];
	}
	
	return {
		get: function() { 
				var names = new Array();
				for (var i = 0; i < clients.data.length; i++) {
					names.push(clients.data[i].name);
				}
				return names; 
			},
			
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
			}		
	}
}
