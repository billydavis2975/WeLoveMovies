const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reviewsService = require("./reviews.service");
const mapProperties = require("../utils/map-properties");

async function reviewExists(req, res, next) {
  const review = await reviewsService.read(Number(req.params.reviewId));
  console.log(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(req, res, next) {
  const { review } = res.locals;
  await reviewsService.delete(review.review_id);
  res.sendStatus(204);
}

async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const updatedRecord = await reviewsService.update(updatedReview);

  const mapReviews = mapProperties({
    critic_id: "critic.id",
    ["reviews.critic_id"]: "critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    ["critic.created_at"]: "critic.created_at",
    ["critic.updated_at"]: "critic.updated_at",
  });
  console.log(updatedRecord);
  const data = mapReviews(updatedRecord);
  data.critic_id = updatedRecord.critic_id;
  res.json({ data });
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
