/**
 * Created by jerek0 on 29/09/15.
 */
var crypto = require("crypto");
var socketIo = require('socket.io');

function ClientsDialer(server) {
    this.server = server;
    this.users = [];
    this.io = socketIo(server);
    
    this.init();
}

ClientsDialer.prototype.init = function() {
    this.io.on('connection', this.registerIO.bind(this));

    console.log('ClientsDialer initialized');
};

ClientsDialer.prototype.registerIO = function(socket) {
    // user
    socket.user = {
        id: crypto.randomBytes(20).toString('hex')
    };

    // get user id
    socket.on('getUserId', function(){

        // return user id (only to user)
        socket.emit('getUserId', socket.user.id);
    });

    // get users list
    socket.on('getUsersList', function(){

        // if we ask for user list, it means we are connected to peer
        this.users.push(socket.user.id);

        // emit users list to everybody
        io.emit('getUsersList', this.users);
    });

    // disconnect
    socket.on('disconnect', function(){

        // remove user from list
        var i = 0;
        for(i; i < this.users.length; i++){
            if(this.users[i] == socket.user.id){
                this.users.splice(i, 1);
            }
        }

        // emit users list to everybody
        io.emit('getUsersList', this.users);
    });
};

module.exports = ClientsDialer;