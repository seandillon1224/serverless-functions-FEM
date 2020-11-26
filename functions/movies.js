const {URL} = require('url');
const fetch = require('node-fetch');
// const movies = require('../data/movies.json');
const { query } = require('./util/hasura');

exports.handler = async () => {
    const {movies} = await query({
        query: `
        query movies {
            movies {
              id
              tagline
              title
              poster
            }
          }
        `,
    })
    const api = new URL("https://www.omdbapi.com/");
    // add secret api key
    api.searchParams.set('apikey', process.env.OMDB_API_KEY);

    const promises = movies.map(async (movie) => {
        // use movies imdb id to look up details
        api.searchParams.set('i', movie.id);
        const res = await fetch(api);
        const movieData = await res.json();
        const scores = movieData.Ratings;

        return {
            ...movie,
            scores
        }
    });

    const moviesWithRatings = await Promise.all(promises);

    return {
        statusCode: 200,
        body: JSON.stringify(moviesWithRatings)
    }
};