const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { socketIoInit } = require('./socket/socket');

app.use(cors());

//Initialize socket.io
socketIoInit(server);

//MIDDLEWARE
const router = require('./routes/router');
app.use(router);

//SERVER AND PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
