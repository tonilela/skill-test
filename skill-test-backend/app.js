const express = require('express');
require("dotenv")
const app = express();
const cors = require( "cors" );
const routes = require('./src/index');
const { Server } = require('socket.io');

const http = require('http');
const server = http.createServer(app);

app.use(cors( { origin: process.env.FRONTEND_URL || `http://localhost:3000` } ) );
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
  },
});

app.use(routes);

app.get('/health', (req, res) => {
  res.send('Everything works as it should!');
});

const users = {};

io.on('connection', (socket) => {
 console.log('a user connected');

 socket.on('disconnect', () => {
  console.log('user disconnected');
 });

 socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
 });

 socket.on('login', (email) => {
  users[email] = socket;
 });
});

app.post('/notify', (req, res) => {
  const { email, message } = req.body;
  if (users[email]) {
    users[email].emit('message', message);
  } else {
    io.emit('message',message)
  }

  res.sendStatus(200);
 });
 

 server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});