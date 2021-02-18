const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);

const getPrediction = (x1) => {
  return dsClient.get(`/predict?city_state=${x1}`);
};

const getRecommend = (population, crime_rate, rental_rate, walk_score) => {
  return dsClient.get(
    `/recommend?population=${population}&crime_rate=${crime_rate}&rental_rate=${rental_rate}&walk_score=${walk_score}`
  );
};

const getStateId = (cityState) => {
  return dsClient.get(`/state_id?city_state=${cityState}`);
};

const getViz = (state) => {
  return dsClient.get(`/viz/${state}`);
};

module.exports = { getPrediction, getViz, getRecommend, getStateId };
