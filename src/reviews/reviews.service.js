const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

async function update(updatedReview) {
  console.log(updatedReview.review_id);
  await knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview);
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select(
      "c.critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at",
      "c.updated_at",
      "r.review_id",
      "r.content",
      "r.score",
      "r.movie_id",
      "r.critic_id",
      "r.created_at",
      "r.updated_at"
    )
    .where({ review_id: updatedReview.review_id })
    .first();
}

module.exports = {
  read,
  update,
  delete: destroy,
};
