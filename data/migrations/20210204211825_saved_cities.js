exports.up = function (knex) {
  return knex.schema.createTable('saved_cities', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('city_id').notNullable();
    table
      .string('user_id')
      .unsigned()
      .notNullable()
      .references('profiles.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('saved_cities');
};
