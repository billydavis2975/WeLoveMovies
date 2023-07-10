exports.up = function (knex) {
  return knex.schema.createTable("movies", (table) => {
    table.increments("movie_id").primary(); //sets unique movie id
    table.string("title");
    table.integer("runtime_in_minutes");
    table.string("rating");
    table.text("description");
    table.string("image_url");
    table.timestamps(true, true); //created_at and updated_at columns
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movies");
};
