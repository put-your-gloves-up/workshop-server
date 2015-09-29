/**
 * Created by jerek0 on 29/09/15.
 */

var express = require('express');
var peer = require('peer').ExpressPeerServer;
var config = require('../config.json');

function ServerManager() {
    this.app = express();
    this.server = require('http').createServer(this.app);
    
    this.init();
};

ServerManager.prototype.init = function() {
    // peer
    this.app.use('/peer', peer(this.server, {debug: true}));
    
    console.log('ServerManager initialized');
};

ServerManager.prototype.launch = function() {
    this.server.listen(config.port, function(){
        console.log('Server launched on port '+config.port);
    });
};

module.exports = ServerManager;