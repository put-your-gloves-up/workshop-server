/**
 * Created by jerek0 on 29/09/15.
 */
var crypto = require("crypto");
var socketIo = require('socket.io');

function ClientsDialer(server) {
    this.server = server;
    this.users = [];
    this.sockets = [];
    this.io = socketIo(server);
    
    this.init();
}

ClientsDialer.prototype.init = function() {
    this.io.on('connection', this.registerIO.bind(this));

    console.log('ClientsDialer initialized');
};

ClientsDialer.prototype.registerIO = function(socket) {
    var scope = this;
    
    // user
    socket.user = {
        id: crypto.randomBytes(20).toString('hex')
    };
    
    scope.sockets[socket.user.id] = socket;

    // get user id
    socket.on('getUserId', function(){

        // return user id (only to user)
        socket.emit('getUserId', socket.user.id);
    });

    // get users list
    socket.on('getUsersList', function(){

        // if we ask for user list, it means we are connected to peer
        scope.users.push(socket.user.id);

        // emit users list to everybody
        scope.io.emit('getUsersList', scope.users);
    });

    // disconnect
    socket.on('disconnect', function(){

        // remove user from list
        var i = 0;
        for(i; i < scope.users.length; i++){
            if(scope.users[i] == socket.user.id){
                scope.users.splice(i, 1);
            }
        }
        
        delete scope.sockets[socket.user.id];

        // emit users list to everybody
        scope.io.emit('getUsersList', scope.users);
    });
    
    socket.on('peerToPeer', function(data) {
        //console.log(data.targetId);
        //console.log(scope.users);
        scope.sockets[data.targetId] && scope.sockets[data.targetId].emit('peerToPeer', data);
    });
};

module.exports = ClientsDialer;