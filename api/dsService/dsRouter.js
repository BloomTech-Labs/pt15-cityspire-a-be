const express = require('express');
const router = express.Router();
const dsModel = require('./dsModel');
const authRequired = require('../middleware/authRequired');
const findCityId = require('../middleware/findCityId');

/**
 * @swagger
 * /data/predict/{cityState}:
 *  get:
 *    description: Get prediction for 3 inputs
 *    summary: Returns a prediction result
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - cityState:
 *        name: x1
 *        in: path
 *        description: A city and state
 *        required: true
 *        example: Port Charlotte, Florida
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A predition result object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id_num:
 *                  type: number
 *                  description: id for cities
 *                population:
 *                  type: number
 *                  description: population
 *                crime_rate:
 *                  type: number
 *                  description: crime_rate
 *                rental_rate:
 *                  type: number
 *                  description: rental_rate
 *                walk_score:
 *                  type: number
 *                  description: walk_score
 *              example:
 *                id_num: 5760
 *                population: 62348
 *                crime_rate: 30.31
 *                rental_rate: 1799.74
 *                walk_score: 17
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Error making prediction'
 */
router.get('/predict/:x1', authRequired, function (req, res) {
  const x1 = String(req.params.x1);
  dsModel
    .getPrediction(x1)
    .then((response) => {
      [response.data.city, response.data.state] = findCityId(
        response.data.id_num
      ).split(', ');
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

router.get('/id_num/:x1', authRequired, function (req, res) {
  const x1 = req.params.x1;
  const x2 = String(findCityId(x1));
  dsModel
    .getPrediction(x2)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

router.get(
  '/recommend/:population/:crime_rate/:rental_rate/:walk_score',
  authRequired,
  function (req, res) {
    const population = String(req.params.population);
    const crimeRate = String(req.params.crime_rate);
    const rentalRate = String(req.params.rental_rate);
    const walkScore = String(req.params.walk_score);
    dsModel
      .getRecommend(population, crimeRate, rentalRate, walkScore)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json(error);
      });
  }
);

router.get('/state_id/:id', authRequired, function (req, res) {
  const id = req.params.id;
  dsModel
    .getStateId(id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

module.exports = router;
