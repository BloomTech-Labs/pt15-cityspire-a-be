const express = require('express');
const authRequired = require('../middleware/authRequired');
const ownsFavorite = require('../middleware/ownsFavorite');
const router = express.Router();
const savedCities = require('./savedCitiesModel');

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
