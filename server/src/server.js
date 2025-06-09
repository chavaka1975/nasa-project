const http = require('http');
const app = require('./app');
const { connect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

async function startServer() {
  try {
    await connect();
    await loadPlanetsData();
    await loadLunchData();
  
    server.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`)
    });
  } catch(error) {
    console.error(error);
  }
}

startServer();