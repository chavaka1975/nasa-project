const API_URL = 'http://localhost:3001/v1';

async function httpGetPlanets() {
  const responsePlanets = await fetch(`${API_URL}/planets`);
  return responsePlanets.json();
}

async function httpGetLaunches() {
  const responseLaunches = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await responseLaunches.json();
  return fetchedLaunches.sort((flightA, flightB) => {
    return flightA.flightNumber - flightB.flightNumber;
  }); 
}

async function httpSubmitLaunch(launch) {
  try {
    return fetch(`${API_URL}/launches`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch(error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return fetch(`${API_URL}/launches/${id}`, {
      method: 'delete',
    });
  } catch(error) {
    console.log(error);
    return {
      ok: false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};