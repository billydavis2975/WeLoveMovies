const knex = require("../db/connection");

function list() {
  return knex("theaters").select("*");
}

function moviesAtTheaters() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "m.*", "mt.is_showing", "mt.theater_id");
}
module.exports = {
  list,
  moviesAtTheaters,
};
