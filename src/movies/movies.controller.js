const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const moviesService = require("./movies.service");

async function list(req, res, next) {
  if (req.query.is_showing === "true") {
    const data = await moviesService.movieIsShowing();
    res.json({ data });
  } else {
    const data = await moviesService.list();
    res.json({ data });
  }
}

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

// async function movieIsShowing(req, res, next) {
//   if (req.query.is_showing === "true") {
//     const data = await moviesService.movieIsShowing();
//     res.json({ data });
//   } else {
//     next();
//   }
// }

async function whichTheater(req, res, next) {
  const theaters = await moviesService.whichTheater(req.params.movieId);
  res.json({ data: theaters });
}

// async function movieReviews(req, res, next) {
//   const reviews = await moviesService.movieReviews(req.params.movieId);
//   res.json({ data: reviews });
// }
async function movieReviews(req, res, next) {
  const reviews = await moviesService.movieReviews(req.params.movieId);

  const transformedReviews = reviews.map((review) => {
    const {
      review_id,
      content,
      score,
      created_at,
      updated_at,
      critic_id,
      movie_id,
      preferred_name,
      surname,
      organization_name,
    } = review;

    return {
      review_id,
      content,
      score,
      created_at,
      updated_at,
      critic_id,
      movie_id,
      critic: {
        critic_id,
        preferred_name,
        surname,
        organization_name,
        created_at,
        updated_at,
      },
    };
  });

  res.json({ data: transformedReviews });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(movieExists), read],
  whichTheater: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(whichTheater),
  ],
  movieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(movieReviews),
  ],
};
