const express = require('express');
const router = express.Router();
const dsModel = require('./dsModel');
const authRequired = require('../middleware/authRequired');
const findCityId = require('../middleware/findCityId');

/**
 * @swagger
 * /data/predict/{cityState}:
 *  get:
 *    description: Get prediction city and state.
 *    summary: Returns a prediction result. Requires okta token.
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - cityState:
 *        name: cityState
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

/**
 * @swagger
 * /data/predict/{id_num}:
 *  get:
 *    description: Get prediction for city id_num.
 *    summary: Returns a prediction result. Requires okta token.
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - cityState:
 *        name: id_num
 *        in: path
 *        description: Finds city info by the id_num of the city
 *        required: true
 *        example: 5760
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

/**
 * @swagger
 * /data/predict/{population}/{crime_rate}/{rental_rate}/{walk_score}:
 *  get:
 *    description: Get prediction for 3 inputs
 *    summary: Returns a prediction result. Requires okta token
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - population:
 *        name: population
 *        in: path
 *        description: uses population to help find city's near that value.
 *        required: true
 *        example: 5760
 *        schema:
 *          type: string
 *      - crime_rate:
 *        name: crime_rate
 *        in: path
 *        description: uses crime_rate to help find city's near that value.
 *        required: true
 *        example: 30
 *        schema:
 *          type: string
 *      - rental_rate:
 *        name: rental_rate
 *        in: path
 *        description: uses rental_rate to help find city's near that value.
 *        required: true
 *        example: 1500
 *        schema:
 *          type: string
 *      - walk_score:
 *        name: walk_score
 *        in: path
 *        description: uses walk_score to help find city's near that value.
 *        required: true
 *        example: 80
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

/**
 * @swagger
 * /data/state_id/{id_num}:
 *  get:
 *    description: Return city for id_num.
 *    summary: Returns city for given id_num. Requires okta token.
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - id_num:
 *        name: id_num
 *        in: path
 *        description: FInds city by id_num
 *        required: true
 *        example: 5760
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
 *                CIty_state:
 *                  type: string
 *                  description: city
 *              example:
 *                city_state: 5760
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Error making prediction'
 */

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
