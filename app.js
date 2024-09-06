const express = require('express');
const http = require('http'); // To create the HTTP server
const { Server } = require('socket.io'); // Socket.io for real-time functionality
const cors = require('cors');
const authRoutes = require('./middleware/authRoutes');



// Initialize the app and HTTP server
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'https://alex-chat.netlify.app',
  'https://real-time-chat-qgos.onrender.com'
];

// //auth routes
app.use('/auth', authRoutes);

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) { // Allow localhost for local testing
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST"]
}));

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"]
  }
});

// Sample route to test server
app.get('/', (req, res) => {
  res.send('Server is running');
});
const onlineUsers = new Map(); // Change to Map for easier user management

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_connected', (username) => {
    // console.log(`User ${username} connected`);
      onlineUsers.set(socket.id, username);
      io.emit('update_online_users', Array.from(onlineUsers.values()));
      // Emit a system message when a user connects
      io.emit('receive_message', {
        content: `${username} has joined the chat`,
        id: 'system',
        username: 'System',
        timestamp: new Date().toISOString()
      });
  });

  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit('receive_message', data); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      console.log(`User ${username} disconnected`);
      onlineUsers.delete(socket.id);
      io.emit('update_online_users', Array.from(onlineUsers.values()));
      // Emit a system message when a user disconnects
      io.emit('receive_message', {
        content: `${username} has left the chat`,
        id: 'system',
        username: 'System',
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});