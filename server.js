const http = require('http')
const app = require('./app')


const server = http.createServer(app)

const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on:
    - Local: http://localhost:${PORT}
    - Network: http://${getLocalIP()}:${PORT}`);
  });
  
  // Helper function to get your local IP
  function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  }


