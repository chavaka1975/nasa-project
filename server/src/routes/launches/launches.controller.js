const { getAllLaunches, deleteLaunchDB, scheduleNewLaunch } = require('../../models/launches.model');
const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllLaunches(req, res) {
  const launches = await getAllLaunches();
  console.log('Launchez', launches);
 return res.status(200).json(launches);
}

function returnBadRequest(res, errorMessage) {
  return res.status(400).json({
    error: errorMessage,
  });
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  console.log('launch', launch);
  if ( !launch?.mission || !launch?.rocket || !launch?.launchDate || !launch?.target) {
    return returnBadRequest(res, 'Missing launch property');
  }

  launch.launchDate = new Date(launch.launchDate);
  if ( isNaN(launch.launchDate) ) {
    return returnBadRequest(res, 'Invalid launc Date');
  }

  if ( !(await isValidPlanet(launch.target)) ) {
    return returnBadRequest(res, 'Invalid Destination');
  }

  const newLaunch = await scheduleNewLaunch(launch);
  return res.status(201).json(newLaunch);
}

async function isValidPlanet(target) {
  const planets = await getAllPlanets();
  const planet = planets.find(planet => planet.keplerName === target);
  return planet || false;
}

async function httpDeleteLaunch(req, res) {
  const flightNumber = +req.params?.flightNumber;
  try {
    const launchUpdated = await deleteLaunchDB(flightNumber);
    if (!launchUpdated) {
      return res.status(404).json({
        code: 404,
      });
    }
    return res.status(200).json(launchUpdated);
  } catch(error) {
    console.log(error);
    return res.status(200).json({});
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
}