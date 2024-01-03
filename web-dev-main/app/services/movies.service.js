const statusCodes = require("../constants/statusCodes");
const pool = require("../boot/database/db_connect");
const logger = require("../middleware/winston");
const uploadFile = require("../upload/uploadFile");

const addMovie = async (req, res) => {
  const { title, release_date, author } = req.body;
  const { type, poster, backdrop_poster, overview } = req.body;

  if (!title || !release_date || !author || !type) {
    res
      .status(statusCodes.missingParameters)
      .json({ message: "Missing parameters" });
  } else {
    pool.query(
      `INSERT INTO movies(title, release_date, author, type, poster, backdrop_poster, overview, creation_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        title,
        release_date,
        author,
        type,
        poster,
        backdrop_poster,
        overview,
        req.body.creation_date,
      ],
      (err, rows) => {
        if (err) {
          logger.error(err.stack);
          res
            .status(statusCodes.queryError)
            .json({ error: "Exception occured while adding new movie" });
        } else {
          console.log(rows);
          res.status(statusCodes.success).json({ message: "Movie added" });
        }
      }
    );
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;

  let movie_id = parseInt(id);
  if (movie_id === NaN) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: "id must be a number" });
  }
  pool.query(
    `SELECT * FROM movies WHERE movie_id = $1;`,
    [movie_id],
    (err, rows) => {
      if (err) {
        logger.error(err.stack);
        res
          .status(statusCodes.queryError)
          .json({ error: "Exception occured while getting movie" });
      } else {
        res.status(statusCodes.success).json({ movie: rows.rows });
      }
    }
  );
};

const getMovies = async (req, res) => {
  pool.query("SELECT * FROM movies;", (err, rows) => {
    if (err) {
      logger.error(err.stack);
      res
        .status(statusCodes.queryError)
        .json({ message: "Exception occured while getting movies" });
    } else {
      res.status(statusCodes.success).json({ movies: rows.rows });
    }
  });
};

const updateMovieById = async (req, res) => {
  const { id } = req.params;
  const { release_date } = req.body;

  let movie_id = parseInt(id);
  if (!release_date || isNaN(movie_id)) {
    return res
      .status(statusCodes.missingParameters)
      .json({ message: "Wrong or missing parameters" });
  } else {
    pool.query(
      `UPDATE movies SET release_date = $1 WHERE movie_id = $2;`,
      [release_date, movie_id],
      (err, rows) => {
        if (err) {
          logger.error(err.stack);
          res
            .status(statusCodes.queryError)
            .json({ message: "Exception occured while updating movie" });
        } else {
          if (rows.rowCount === 0) {
            res
              .status(statusCodes.notFound)
              .json({ message: `Movie with id ${movie_id} doesn't exist` });
          } else {
            res.status(statusCodes.success).json({ message: "Movie updated" });
          }
        }
      }
    );
  }
};

const addMovieWithImage = async (req, res) => {
  const { title, release_date, author } = req.body;
  const { type, movie_url } = req.body;

  if (!title || !release_date || !author || !type || !movie_url) {
    res
      .status(statusCodes.missingParameters)
      .json({ message: "Missing parameters" });
  } else {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const result = await client.query(
        `INSERT INTO movies(title, release_date, author, type, creation_date)
      VALUES ($1, $2, $3, $4, $5) RETURNING movie_id;`,
        [title, release_date, author, type, req.body.creation_date]
      );

      logger.info("MOVIE RESULT: ", result.rows);

      const image_reuslt = await client.query(
        `INSERT INTO movie_images(movie_id, movie_url) VALUES ($1, $2) RETURNING image_id;`,
        [result.rows[0].movie_id, movie_url]
      );

      logger.info("IMAGE RESULT: ", image_reuslt.rows);

      res
        .status(statusCodes.success)
        .json({ message: "Movie with image added" });

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error(error.stack);
      res
        .status(statusCodes.queryError)
        .json({ message: "Exception occured while adding movie with image" });
    } finally {
      client.release();
    }
  }
};

const uploadImage = async (req, res) => {
  const { id } = req.params;

  let movie_id = parseInt(id);
  if (isNaN(movie_id)) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: "id must strictly be a number" });
  }
  let sql = "UPDATE movies SET poster = $1 WHERE movie_id = $2;";
  if (req.file) {
    let { mimetype } = req.file;

    if (
      mimetype !== "image/png" &&
      mimetype !== "image/jpeg" &&
      mimetype !== "image/jpg"
    ) {
      res
        .status(statusCodes.badRequest)
        .json({ message: "Please only upload images" });
    } else {
      uploadFile(`${req.user.id}/`, req, sql, (response) => {
        if (response.error) {
          res
            .status(statusCodes.badRequest)
            .json({ error: "Error while uploading image" });
        } else {
          res.status(statusCodes.success).json({ response });
        }
      });
    }
  } else {
    res
      .status(statusCodes.missingParameters)
      .json({ message: "File is missing" });
  }
};

module.exports = {
  addMovie,
  getMovieById,
  getMovies,
  updateMovieById,
  addMovieWithImage,
  uploadImage,
};
