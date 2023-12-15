const httpServer = require('http').createServer()

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Updated origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

httpServer.listen(8081, () =>{
    console.log('listening on *:8081')
})
io.on('connection', (socket) => {
    console.log(`client ${socket.id} has connected`)
     socket.on('newTransaction', (transaction) => {
         socket.broadcast.emit('newTransaction', transaction)
     })
     socket.on('loggedIn', function (user) {
          socket.join(user.id)
          console.log('testes')
          if (user.user_type == 'A') {
              socket.join('administrator')
              console.log('login as administrator')
              //socket.in('administrator').emit('loginUser', user)
              io.to('administrator').emit('userLoggedIn', { userId: user.id });
          }
     })
     socket.on('loggedOut', function (user) {
         socket.leave(user.id)
         socket.leave('administrator')
     })
     socket.on('insertedUser', function (user) {
         socket.in('administrator').emit('insertedUser', user)
     })
})
