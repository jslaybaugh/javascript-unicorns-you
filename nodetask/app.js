var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server);

server.listen(80);

// routing
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the task group
var usernames = {};
// task history
var tasks = [];

io.sockets.on('connection', function (socket)
{
	// when a client connects, update to show them all tasks since restart
	io.sockets.emit('updatetasks', tasks);

	// when the client emits 'addtask', this listens and executes
	socket.on('addtask', function (data)
	{
 		tasks.push(data);
 		data.Id = tasks.length - 1;
 		io.sockets.emit('addtask', socket.username, data);
 		if (data.Task.toUpperCase().indexOf("UNICORN") >= 0)
 		{
 			io.sockets.emit("cornify");
 		}
	});

	// when the client emits 'taskcompleted', this listens and executes
	socket.on("taskcompleted", function (index, completed)
	{
 		tasks[index].Completed = completed;
 		io.sockets.emit("taskcompleted", index, completed);
	});

	// when the client emits 'removetask', this listens and executes
	socket.on('removetask', function (index)
	{
 		tasks.splice(index, 1);
 		io.sockets.emit('removetask', index);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function (username)
	{
 		socket.username = username;
 		usernames[username] = username;
 		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function ()
	{
 		// remove the username from global usernames list
 		delete usernames[socket.username];
 		io.sockets.emit('updateusers', usernames);
	});
});