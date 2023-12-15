const httpServer = require('http').createServer()

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Updated origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

httpServer.listen(8080, () =>{
    console.log('listening on *:8080')
})
io.on('connection', (socket) => {
    console.log(`client ${socket.id} has connected`)
    // socket.on('newTransaction', (transaction) => {
    //     socket.broadcast.emit('newTransaction', transaction)
    // })
    // // socket.on('updateProject', (project) => {
    // //     socket.broadcast.emit('updateProject', project)
    // // })
    // // socket.on('deleteProject', (project) => {
    // //     socket.broadcast.emit('deleteProject', project)
    // // })
    // socket.on('loggedIn', function (user) {
    //     // socket.join(user.id)
    //     // if (user.type == 'A') {
    //     //     socket.join('administrator')
    //     // }
    // })
    // socket.on('loggedOut', function (user) {
    //     socket.leave(user.id)
    //     socket.leave('administrator')
    // })
    // socket.on('insertedUser', function (user) {
    //     socket.in('administrator').emit('insertedUser', user)
    // })
    // socket.on('updatedUser', function (user) {
    //     socket.in('administrator').except(user.id).emit('updatedUser', user)
    //     socket.in(user.id).emit('updatedUser', user)
    // })
})
