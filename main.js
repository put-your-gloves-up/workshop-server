
var ServerManager = require("./classes/ServerManager");
var ClientsDialer = require('./classes/ClientsDialer');

var app = {
    init: function() {
        this.serverManager = new ServerManager();
        this.clientsDialer = new ClientsDialer(this.serverManager.server);
        
        this.serverManager.launch();
    }
};

app.init();