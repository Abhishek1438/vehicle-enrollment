import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server URL

const customerSocket = {
  connect: () => {
    socket.connect();
  },

  disconnect: () => {
    socket.disconnect();
  },

  sendRequest: (requestData) => {
    socket.emit('customerRequest', requestData);
  },

  onNewRequest: (callback) => {
    socket.on('newRequest', (requestData) => {
      callback(requestData);
    });
  },

  // Add other socket event listeners and methods as needed
};

export default customerSocket;
