const express = require('express');
const app = express();
const port = 5000; // You can choose any port number
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');

const bodyParser = require('body-parser');
const cors = require('cors');

// Use middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

mongoose
  .connect('mongodb://0.0.0.0:27017/Vehicle_Enrolment')
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle customer requests
  socket.on('customerRequest', (requestData) => {
    // Process the request and store it in the database
    console.log('data added');
    // Then, broadcast the request to all admin panels
    io.emit('newRequest', requestData);
  });

  // Handle other events as needed

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Define your routes and middleware here
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
