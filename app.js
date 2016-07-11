var app = require('express')();
var http = require('http').Server(app);

app.get('/uploads/:file', function(req, res) {
    res.sendFile('uploads//' + req.params.file, {"root": __dirname});
});

var deploy = "http://5.196.88.52:5001/";
var local   = "http://localhost:5001/";

function fileServer(http){
    var io  = require('socket.io')(http),
        fs  = require('fs');

    io.sockets.on('connection', function(socket) {
        socket.on('downloadImage', function(data) {

            if (data.image == true) {
                var buff = new Buffer(data.buffer
                    .replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
                fs.writeFile(__dirname + "/uploads/" + data.name, buff, function(err) {
                    if(err){
                        console.log('File could not be saved: ' + err);
                    }else{
                        io.emit('downloadSucceed', { status: 200, path: local + "uploads/" + data.name } );
                        console.log('File ' + data.name + " saved");
                    }
                });
            }
        });
    });
}

fileServer(http);

http.listen(5001);