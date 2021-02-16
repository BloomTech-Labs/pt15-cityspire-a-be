const cityIds = require('../../data/id_num.json');

module.exports = function (x) {
  return cityIds[x];
};
