const app = require('express')();
const http = require('http').createServer(app);
var path = require('path');
var ss = require('socket.io-stream');


app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

//Socket Logic
const socketio = require('socket.io')(http)

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
    })
    userSocket.on("send_image", (data) => {
        ss(data).on("receive_image", function (stream, data) {
            var fileName = path.basename(data.name);
            stream.pipe(fs.createWriteStream(fileName));
            userSocket.broadcast.emit("receive_image", fileName)
        })
    })
})

http.listen(process.env.PORT)


