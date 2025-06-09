const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://floressalvador:eJLNDa9fiBxHUhJu@learnnode.v4yj8.mongodb.net/nasa?retryWrites=true&w=majority&appName=LearnNode';

mongoose.connection.on('open', ()=> {
  console.warn('Connection open');
});

mongoose.connection.on('error', (error)=> {
  console.error(`Error trying to connect ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Connection closed');
});

async function connect() {
  await mongoose.connect(MONGO_URL);
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = {
  connect,
  disconnect,
}