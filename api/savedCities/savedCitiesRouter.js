const express = require('express');
const authRequired = require('../middleware/authRequired');
const ownsFavorite = require('../middleware/ownsFavorite');
const router = express.Router();
const savedCities = require('./savedCitiesModel');

/**
 * @swagger
 * /saved:
 *  get:
 *    description: Return saved cities by user_id
 *    summary: Return saved cities by user_id. Requires okta token.
 *    security:
 *      - okta: []
 *    tags:
 *      - saved
 *    responses:
 *      200:
 *        description: A saved cities result object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: id for saved object
 *                name:
 *                  type: string
 *                  description: name of city
 *                city_state:
 *                  type: string
 *                  description: city_state string used to search api.
 *              example:
 *                id: 1
 *                name: 5760
 *                city_state: 62348
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Error making prediction'
 */

router.get('/', authRequired, function (req, res) {
  savedCities
    .findByUser_id(req.profile.id)
    .then((cities) => {
      res.status(200).json(cities);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/**
 * @swagger
 * /saved:
 *  post:
 *    description: Save city by user_id.
 *    summary: Save city by user_id. Requires okta token.
 *    security:
 *      - okta: []
 *    tags:
 *      - saved
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - city_state
 *            properties:
 *              name:
 *                type: string
 *              city_state:
 *                type: string
 *                description: Used to search ds_api for results.
 *            example:
 *              name: port charlotte
 *              city_state: Port Charlotte, Florida
 *    responses:
 *      200:
 *        description: A predition result object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                city_state:
 *                   type: string
 *                   description: Used to search ds_api for results.
 *              example:
 *                name: port charlotte
 *                city_state: Port Charlotte, Florida
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Error making prediction'
 */

router.post('/', authRequired, function (req, res) {
  req.body.user_id = req.profile.id;
  savedCities
    .create(req.body)
    .then((response) => {
      res.status(201).json({ added: response });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: res.message });
    });
});

/**
 * @swagger
 * /saved/{id}:
 *  delete:
 *    summary: Remove a saved city
 *    security:
 *      - okta: []
 *    tags:
 *      - saved
 *    parameters:
 *      - id:
 *        name: id
 *        in: path
 *        description: id of saved city
 *        required: true
 *        example: 23
 *        schema:
 *          type: number
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A message
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: saved city was deleted.
 */
router.delete('/:id', authRequired, ownsFavorite, function (req, res) {
  savedCities
    .remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'deleted' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
