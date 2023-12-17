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
        io.to(receiverVcardId).emit('newTransaction', transaction);
     })
     socket.on('loggedIn', function (user) {
          socket.join(user.id)
          if (user.user_type == 'A') {
              socket.join('administrator')
              console.log('login as administrator')
              socket.in('administrator').emit('loginUser', user)
              //io.to('administrator').emit('userLoggedIn', user);
          }
          if (user.user_type == 'V') {
            socket.join(`vcard-${user.id}`); // Vcards join a specific room
            console.log(`Vcard ${user.id} logged in`);
        }
     })

     // Admin creates a transaction
    socket.on('adminTransaction', (transaction) => {
        const receiverVcardId = transaction.vcard; // ID of the vCard receiver
        socket.in(`vcard-${receiverVcardId}`).emit('newTransaction', transaction);
        console.log(`Transaction sent to vCard ${receiverVcardId}`);
    });
    socket.on('debitTransaction', (transaction) => {
        const receiverVcard = transaction.reference;
        io.to(`vcard-${receiverVcard}`).emit('receivedDebit', transaction);
        console.log(`Debit transaction sent to vCard ${receiverVcard}`);
    });
    // User logs out
    socket.on('loggedOut', (user) => {
        socket.leave(user.id);
        if (user.user_type === 'V') {
            socket.leave(`vcard-${user.id}`);
        }
        console.log(`User ${user.id} logged out`);
    });

    socket.on('blockUser', (vcard) => {
        socket.in(`vcard-${vcard}`).emit('blockUser', vcard);
    });

    socket.on('deleteUser', (vcard) => {
        socket.in(`vcard-${vcard}`).emit('deleteUser', vcard);
    });
})
