const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const theatersService = require("./theaters.service");
const mapProperties = require("../utils/map-properties");

async function list(req, res) {
  const data = await theatersService.list();
  res.json({ data });
}

async function moviesAtTheaters(req, res) {
  const theaters = await theatersService.moviesAtTheaters();

  const transformedTheaters = theaters.reduce((acc, theater) => {
    const {
      theater_id,
      name,
      address_line_1,
      address_line_2,
      city,
      state,
      zip,
      created_at,
      updated_at,
      movie_id,
      title,
      runtime_in_minutes,
      rating,
      description,
      image_url,
      is_showing,
    } = theater;

    const mappingConfiguration = {
      theater_id: "theater_id",
      name: "name",
      address_line_1: "address_line_1",
      address_line_2: "address_line_2",
      city: "city",
      state: "state",
      zip: "zip",
      created_at: "created_at",
      updated_at: "updated_at",
      movie_id: "movies.movie_id",
      title: "movies.title",
      runtime_in_minutes: "movies.runtime_in_minutes",
      rating: "movies.rating",
      description: "movies.description",
      image_url: "movies.image_url",
      is_showing: "movies.is_showing",
    };

    const transform = mapProperties(mappingConfiguration);
    const transformedTheater = transform(theater);

    const existingTheater = acc.find(
      (t) => t.theater_id === transformedTheater.theater_id
    );

    if (existingTheater) {
      existingTheater.movies.push(transformedTheater.movies);
    } else {
      transformedTheater.movies = [transformedTheater.movies];
      acc.push(transformedTheater);
    }

    return acc;
  }, []);

  res.json({ data: transformedTheaters });
}

module.exports = {
  list: [asyncErrorBoundary(moviesAtTheaters)],
};
