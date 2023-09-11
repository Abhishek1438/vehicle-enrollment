import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server URL

const adminSocket = {
  connect: () => {
    socket.connect();
  },

  disconnect: () => {
    socket.disconnect();
  },

  // Add event listeners for admin-specific events
  // For example, listening for 'newRequest' to display customer requests

  onNewRequest: (callback) => {
    socket.on('newRequest', (requestData) => {
      callback(requestData);
    });
  },

  // Add other socket event listeners and methods as needed
};

export default adminSocket;
