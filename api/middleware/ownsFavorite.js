const savedCities = require('../savedCities/savedCitiesModel');

const ownsFavorite = (req, res, next) => {
  savedCities.findBy({ id: req.params.id }).then((resp) => {
    if ((resp[0].user_id = req.profile.id)) {
      next();
    } else {
      res
        .status(401)
        .json({ message: 'not authorized to access this resource.' });
    }
  });
};

module.exports = ownsFavorite;
