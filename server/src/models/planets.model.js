const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');
const planets = require('./planets.schema');

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', async (planet) => {
      isHabitablePlanet(planet) && await savePlanet(planet)
    })
    .on('error', (error) => {
      console.error(`Error ${error}`);
      reject(error);
    })
    .on('end', async () => {
      const planetsInDB = await getAllPlanets();
      console.log(`We have ${planetsInDB.length} planets`);
      resolve();
    })
  });
}

  function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
      && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
      && planet['koi_prad'] < 1.6;
  }

  async function getAllPlanets() {
    return await planets.find({}, {
      '_id': 0,
      '__v': 0
    });
  }

  async function savePlanet(planet) {
    try {
      await planets.findOneAndUpdate({
        keplerName: planet.kepler_name
      }, {
        keplerName: planet.kepler_name
      }, {
        upsert: true
      });
    } catch(error) {
      console.error(`Error saving the planet ${error}`);
    }
  }

  module.exports = {
    loadPlanetsData,
    getAllPlanets,
  };