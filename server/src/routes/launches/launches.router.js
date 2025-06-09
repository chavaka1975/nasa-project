const express = require('express');
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
} = require('./launches.controller');

const launchRouter = express.Router();

launchRouter.get('/', httpGetAllLaunches);
launchRouter.post('/', httpAddNewLaunch);
launchRouter.delete('/:flightNumber', httpDeleteLaunch);

module.exports = launchRouter;