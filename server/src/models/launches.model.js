const axios = require('axios');

const launchesDB = require('./launches.schema');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const launch = {
  flightNumber: 100, //flight_number
  mission: 'Name of the mission', //name
  rocket: 'Exporer X1', //rocket.name
  launchDate: new Date('December 27, 2030'), //date_local
  target: 'Kepler-442 b', //not applicable
  customers: ['ZTM', 'NASA'], //payloads.customers per payload
  upcoming: true, //upcoming
  success: true, //success
}

//saveLaunch(launch);

async function getAllLaunches() {
  return await launchesDB.find({}, {
    '_id': 0,
    '__v': 0
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort('-flightNumber');
  return latestLaunch?.flightNumber || 100;
}

async function saveLaunch(launch) {
  return await launchesDB.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, {
    ...launch
  }, {
    upsert: true,
    returnNewDocument: true,
  });
}

async function scheduleNewLaunch(launch) {
  const flightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber,
  };
  return await saveLaunch(newLaunch);
}

async function deleteLaunchDB(flightNumber) {
  return await launchesDB.findOneAndUpdate({
    flightNumber,
    upcoming: true,
    success: true,
  }, {
    $set: {
      upcoming: false,
      success: false,
    }
  }, {
    new: true,
  });
}

async function populateData() {
  console.log('Downloading launch data ...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [{
        path: 'rocket',
        select: {
          name: 1,
        }
      }, {
        path: 'payloads',
        select: {
          customers: 1
        }
      }]
    }
  });

  const mapped = response?.data?.docs?.forEach((doc, index) => {
    const {flight_number, name, rocket, date_local, upcoming, success, payloads} = doc;
    const customers = getCustomers(payloads);
    const newLaunch = {
      flightNumber: flight_number,
      mission: name,
      rocket: rocket?.name,
      launchDate: date_local,
      upcoming: upcoming,
      success: success,
      customers
    }
    saveLaunch(newLaunch);
    console.log(`Saved ${index}`);
  });
}

async function loadLunchData() {
  const exist = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if(!exist) {
    await populateData();
  }
}

function getCustomers(payloads) {
  const allCustomers = payloads.flatMap((payload) => {
    return payload.customers;
  });

  return [...new Set(allCustomers)];
}

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

module.exports = {
  deleteLaunchDB,
  getAllLaunches,
  scheduleNewLaunch,
  loadLunchData,
}