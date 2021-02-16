const db = require('../../data/db-config');

const create = async (city) => {
  return await db('saved_cities').insert(city).returning('*');
};

const findBy = async (filter) => {
  return await db('saved_cities').where(filter);
};

const findByUser_id = async (user_id) => {
  return await db('saved_cities')
    .where({ user_id: user_id })
    .select('id', 'name', 'city_id');
};

const remove = async (id) => {
  return db('saved_cities').where({ id: id }).del();
};

module.exports = {
  create,
  findBy,
  findByUser_id,
  remove,
};
