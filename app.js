const express = require('express');
const http = require('http'); // To create the HTTP server
const { Server } = require('socket.io'); // Socket.io for real-time functionality
const cors = require('cors');

// Initialize the app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect (adjust port as needed)
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Sample route to test server
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages from clients
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit('receive_message', data); // Broadcast message to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
