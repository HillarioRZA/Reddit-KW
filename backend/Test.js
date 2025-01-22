const { io } = require('socket.io-client');

// Ganti URL sesuai dengan alamat server
const socket = io('http://localhost:5000');

// Event saat berhasil terhubung ke server
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);

  // Test untuk mendengar event 'newComment'
  socket.on('newComment', (data) => {
    console.log('New Comment:', data);
  });

  // Test untuk mendengar event 'updateComment'
  socket.on('updateComment', (data) => {
    console.log('Updated Comment:', data);
  });

  // Test untuk mendengar event 'deleteComment'
  socket.on('deleteComment', (data) => {
    console.log('Deleted Comment ID:', data);
  });

socket.on('newVote', (data) => {
  console.log('New vote:', data);
});

socket.on('voteUpdated', (data) => {
  console.log('Vote updated:', data);
});

socket.on('voteDeleted', (data) => {
  console.log('Vote deleted:', data);
});


  // Simulasi disconnect
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});
