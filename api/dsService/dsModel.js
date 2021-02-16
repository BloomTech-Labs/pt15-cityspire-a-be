const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);

const getPrediction = (x1) => {
  return dsClient.get(`/predict?city_state=${x1}`);
};

const getViz = (state) => {
  return dsClient.get(`/viz/${state}`);
};

module.exports = { getPrediction, getViz };
